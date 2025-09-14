// src/components/cms/MediaManager.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image, File, Trash2, Copy, Check, X, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../LoadingSpinner';
import Button from '../Button';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  size: number;
  uploadedAt: string;
  path: string; // Storage path in Supabase
}

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia?: (url: string) => void;
  allowMultiple?: boolean;
}

const STORAGE_BUCKET = 'cms-media';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

const MediaManager: React.FC<MediaManagerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectMedia, 
  allowMultiple = false 
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'images' | 'documents'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all'); // Added for year filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Added for category filter
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Document categories for organization
  const DOCUMENT_CATEGORIES = {
    'summons': { label: 'Summons', icon: FileText, color: 'bg-blue-100 text-blue-800' },
    'minutes': { label: 'Lodge Minutes', icon: FileText, color: 'bg-green-100 text-green-800' },
    'gpc_minutes': { label: 'GPC Minutes', icon: FileText, color: 'bg-purple-100 text-purple-800' },
    'grand_lodge': { label: 'Grand Lodge', icon: FileText, color: 'bg-red-100 text-red-800' },
    'provincial': { label: 'Provincial', icon: FileText, color: 'bg-yellow-100 text-yellow-800' },
    'other': { label: 'Other Documents', icon: File, color: 'bg-gray-100 text-gray-800' }
  };

  // Load media files from Supabase Storage
  const loadMediaFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: buckets, error: bucketsError } = await supabase.storage
        .listBuckets();
      
      if (bucketsError) {
        throw new Error(`Failed to list buckets: ${bucketsError.message}`);
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
      if (!bucketExists) {
        throw new Error(`Storage bucket '${STORAGE_BUCKET}' does not exist`);
      }

      const { data: files, error: listError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (listError) {
        throw new Error(`Failed to load files: ${listError.message}`);
      }

      if (!files) {
        setMediaItems([]);
        return;
      }

      const mediaItems: MediaItem[] = await Promise.all(
        files
          .filter(file => file.name !== '.emptyFolderPlaceholder')
          .map(async (file) => {
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(file.name);

            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
            const type = imageExtensions.includes(extension) ? 'image' : 'document';

            return {
              id: file.id || file.name,
              name: file.name,
              url: urlData.publicUrl,
              type,
              size: file.metadata?.size || 0,
              uploadedAt: file.created_at || new Date().toISOString(),
              path: file.name
            };
          })
      );

      setMediaItems(mediaItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMediaFiles();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedItems([]);
      setError(null);
    };
  }, [isOpen]);

  const generateUniqueFilename = (originalName: string): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}_${timestamp}_${randomString}.${extension}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setUploading(true);
    setError(null);
    const newUploadProgress: { [key: string]: number } = {};

    try {
      const { data: buckets, error: bucketsError } = await supabase.storage
        .listBuckets();
      
      if (bucketsError) {
        throw new Error(`Failed to check buckets: ${bucketsError.message}`);
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
      if (!bucketExists) {
        throw new Error(`Storage bucket '${STORAGE_BUCKET}' does not exist. Please create it first.`);
      }

      const uploadPromises = Array.from(files).map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File "${file.name}" is too large. Maximum size is 10MB.`);
        }

        const allowedTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
          'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ];

        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File type "${file.type}" is not supported.`);
        }

        const uniqueFilename = generateUniqueFilename(file.name);
        newUploadProgress[uniqueFilename] = 0;
        setUploadProgress({ ...newUploadProgress });

        const uploadResult = await Promise.race([
          supabase.storage
          .from(STORAGE_BUCKET)
          .upload(uniqueFilename, file, {
            cacheControl: '3600',
            upsert: false
          }),
          new Promise((_, reject) => {
            signal.addEventListener('abort', () => reject(new Error('Upload cancelled')));
          })
        ]);

        const { data, error: uploadError } = uploadResult;
        
        if (uploadError) {
          throw new Error(`Failed to upload "${file.name}": ${uploadError.message}`);
        }

        newUploadProgress[uniqueFilename] = 100;
        setUploadProgress({ ...newUploadProgress });

        return data;
      });

      await Promise.all(uploadPromises);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Longer delay for Supabase processing
      
      await loadMediaFiles();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress({});
      abortControllerRef.current = null;
    }
  };

  const handleSelectItem = (id: string) => {
    if (allowMultiple) {
      setSelectedItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setSelectedItems([id]);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const item = mediaItems.find(item => item.id === id);
    if (!item) return;

    try {
      setError(null);

      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([item.path]);

      if (deleteError) {
        throw new Error(`Failed to delete file: ${deleteError.message}`);
      }

      setMediaItems(prev => prev.filter(item => item.id !== id));
      setSelectedItems(prev => prev.filter(item => item !== id));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const handleSelectAndClose = () => {
    if (selectedItems.length > 0 && onSelectMedia) {
      const selectedItem = mediaItems.find(item => item.id === selectedItems[0]);
      if (selectedItem) {
        onSelectMedia(selectedItem.url);
      }
    }
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Extract year from filename or upload date
  const extractYear = (item: MediaItem): number => {
    const yearMatch = item.name.match(/(\d{4})/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      if (year >= 1900 && year <= new Date().getFullYear() + 1) {
        return year;
      }
    }
    return new Date(item.uploadedAt).getFullYear();
  };

  // Extract category from filename
  const extractCategory = (item: MediaItem): string => {
    const filename = item.name.toLowerCase();
    if (filename.includes('summons')) return 'summons';
    if (filename.includes('gpc') && filename.includes('minutes')) return 'gpc_minutes';
    if (filename.includes('minutes')) return 'minutes';
    if (filename.includes('grand') || filename.includes('ugle')) return 'grand_lodge';
    if (filename.includes('provincial') || filename.includes('pgl')) return 'provincial';
    return 'other';
  };

  // Get available years from documents
  const getAvailableYears = () => {
    const documentItems = mediaItems.filter(item => item.type === 'document');
    const years = [...new Set(documentItems.map(item => extractYear(item)))];
    return years.sort((a, b) => b - a); // Newest first
  };

  // Get document counts by category for current year filter
  const getCategoryCounts = () => {
    const documentItems = mediaItems.filter(item => {
      if (item.type !== 'document') return false;
      if (selectedYear !== 'all' && extractYear(item) !== parseInt(selectedYear)) return false;
      return true;
    });
    
    const counts: Record<string, number> = {};
    Object.keys(DOCUMENT_CATEGORIES).forEach(category => {
      counts[category] = documentItems.filter(item => extractCategory(item) === category).length;
    });
    return counts;
  };

  // Filter items
  const filteredImages = mediaItems.filter(item => item.type === 'image' && (filter === 'all' || filter === 'images'));
  
  const filteredDocuments = mediaItems.filter(item => {
    if (item.type !== 'document') return false;
    if (filter !== 'all' && filter !== 'documents') return false;
    if (selectedYear !== 'all' && extractYear(item) !== parseInt(selectedYear)) return false;
    if (selectedCategory !== 'all' && extractCategory(item) !== selectedCategory) return false;
    return true;
  }).sort((a, b) => {
    // Sort by upload date, newest first
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  const availableYears = getAvailableYears();
  const categoryCounts = getCategoryCounts();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Start of the fragment to wrap header, content, and footer */}
        <>
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-primary-600">Media Manager</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMediaFiles}
                disabled={loading}
                className="flex items-center"
              >
                <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <button
                onClick={onClose}
                className="p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  uploading 
                    ? 'border-neutral-200 bg-neutral-50 cursor-not-allowed' 
                    : 'border-neutral-300 hover:border-secondary-500'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${uploading ? 'text-neutral-300' : 'text-neutral-400'}`} />
                <p className={`mb-2 ${uploading ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {uploading ? 'Uploading files...' : 'Click to upload files or drag and drop'}
                </p>
                <p className="text-sm text-neutral-500">
                  Images, PDFs, and documents up to 10MB
                </p>
                
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="mt-4 space-y-2">
                    {Object.entries(uploadProgress).map(([filename, progress]) => (
                      <div key={filename} className="text-left">
                        <div className="flex justify-between text-sm text-neutral-600 mb-1">
                          <span className="truncate">{filename}</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-neutral-700">Type:</span>
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({mediaItems.length})
                </Button>
                <Button
                  variant={filter === 'images' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('images')}
                >
                  Images ({mediaItems.filter(item => item.type === 'image').length})
                </Button>
                <Button
                  variant={filter === 'documents' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('documents')}
                >
                  Documents ({mediaItems.filter(item => item.type === 'document').length})
                </Button>
              </div>

              {(filter === 'all' || filter === 'documents') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Filter by Year:</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    >
                      <option value="all">All Years ({mediaItems.filter(item => item.type === 'document').length})</option>
                      {availableYears.map(year => {
                        const yearCount = mediaItems.filter(item => 
                          item.type === 'document' && extractYear(item) === year
                        ).length;
                        return (
                          <option key={year} value={year.toString()}>
                            {year} ({yearCount} documents)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Filter by Category:</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    >
                      <option value="all">All Categories</option>
                      {Object.entries(DOCUMENT_CATEGORIES).map(([key, category]) => (
                        <option key={key} value={key}>
                          {category.label} ({categoryCounts[key] || 0})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {(selectedYear !== 'all' || selectedCategory !== 'all') && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-neutral-600">Active filters:</span>
                  {selectedYear !== 'all' && (
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                      Year: {selectedYear}
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded text-xs">
                      {DOCUMENT_CATEGORIES[selectedCategory as keyof typeof DOCUMENT_CATEGORIES]?.label}
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedYear('all');
                      setSelectedCategory('all');
                    }}
                    className="text-xs"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="col-span-full">
                <LoadingSpinner subtle={true} className="py-8" />
              </div>
            ) : (
              <>
                {filteredImages.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary-600 mb-4">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredImages.map((item) => (
                        <div
                          key={item.id}
                          className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedItems.includes(item.id)
                              ? 'border-secondary-500 ring-2 ring-secondary-200'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                          onClick={() => handleSelectItem(item.id)}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          
                          <div className="w-full h-32 bg-neutral-100 flex items-center justify-center hidden">
                            <File className="w-8 h-8 text-neutral-400" />
                          </div>
                          
                          <div className="p-3">
                            <p className="text-sm font-medium text-neutral-700 truncate" title={item.name}>
                              {item.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {formatFileSize(item.size)}
                            </p>
                          </div>

                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(item.url);
                              }}
                              className="p-1 bg-white bg-opacity-90 rounded hover:bg-opacity-100 transition-all"
                              title="Copy URL"
                            >
                              {copiedUrl === item.url ? (
                                <Check size={14} className="text-green-600" />
                              ) : (
                                <Copy size={14} className="text-neutral-600" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item.id);
                              }}
                              className="p-1 bg-white bg-opacity-90 rounded hover:bg-opacity-100 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>

                          {selectedItems.includes(item.id) && (
                            <div className="absolute top-2 left-2">
                              <div className="w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredDocuments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-primary-600 mb-4">Documents</h3>
                    <div className="space-y-3">
                      {filteredDocuments.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedItems.includes(item.id)
                              ? 'border-secondary-500 ring-2 ring-secondary-200'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                          onClick={() => handleSelectItem(item.id)}
                        >
                          <div className="flex items-center flex-grow min-w-0">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                              selectedItems.includes(item.id)
                                ? 'border-secondary-500 bg-secondary-500'
                                : 'border-neutral-300'
                            }`}>
                              {selectedItems.includes(item.id) && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            <FileText size={20} className="text-primary-600 mr-3 flex-shrink-0" />
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-medium text-neutral-700 truncate" title={item.name}>
                                {item.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {formatFileSize(item.size)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(item.url);
                              }}
                              className="p-1 bg-white bg-opacity-90 rounded hover:bg-opacity-100 transition-all"
                              title="Copy URL"
                            >
                              {copiedUrl === item.url ? (
                                <Check size={14} className="text-green-600" />
                              ) : (
                                <Copy size={14} className="text-neutral-600" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item.id);
                              }}
                              className="p-1 bg-white bg-opacity-90 rounded hover:bg-opacity-100 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredImages.length === 0 && filteredDocuments.length === 0 && (
                  <div className="col-span-full text-center py-8 text-neutral-50">
                    <Image className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                    <p>No media files found</p>
                    <p className="text-sm mt-1">Upload some files to get started</p>
                  </div>
                )}
              </>
            )}
          </div>

          {onSelectMedia && (
            <div className="border-t border-neutral-200 p-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSelectAndClose}
                disabled={selectedItems.length === 0}
              >
                Select {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
              </Button>
            </div>
          )}
        </> {/* End of the fragment */}
      </div>
    </div>
  );
};

export default MediaManager;
