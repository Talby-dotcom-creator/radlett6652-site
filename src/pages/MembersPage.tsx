import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { optimizedApi as api } from '../lib/optimizedApi';
import { LodgeDocument, MeetingMinutes, MemberProfile, CMSBlogPost } from '../types';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import VirtualizedList from '../components/VirtualizedList';
import PaginationControls from '../components/PaginationControls';
import DashboardCard from '../components/DashboardCard';
import ProfileSummaryCard from '../components/dashboard/ProfileSummaryCard';
import RecentUpdatesCard from '../components/dashboard/RecentUpdatesCard';
import RecentDocumentsCard from '../components/dashboard/RecentDocumentsCard';
import QuickActionsCard from '../components/dashboard/QuickActionsCard';
import { FileText, Clock, Users, AlertTriangle, BookOpen, ScrollText, Archive, LogOut, Search, Filter, X, ExternalLink, Database } from 'lucide-react';

// Document categories with their display information
const DOCUMENT_CATEGORIES = [
  { key: 'news', label: 'Lodge News', icon: FileText },
  { key: 'blog', label: 'Blog Posts', icon: BookOpen },
  { key: 'snippet', label: 'Weekly Snippets', icon: ScrollText },
  { key: 'grand_lodge', label: 'Grand Lodge Communications', icon: FileText },
  { key: 'provincial', label: 'Provincial Communications', icon: FileText },
  { key: 'summons', label: 'Summons', icon: ScrollText },
  { key: 'minutes', label: 'Meeting Minutes', icon: Clock },
  { key: 'gpc_minutes', label: 'GPC Minutes', icon: Clock },
  { key: 'lodge_instruction', label: 'Lodge of Instruction', icon: BookOpen },
  { key: 'resources', label: 'Resources', icon: Archive },
  { key: 'solomon', label: 'Solomon', icon: BookOpen },
  { key: 'bylaws', label: 'Bylaws', icon: FileText },
  { key: 'forms', label: 'Forms', icon: FileText },
  { key: 'ritual', label: 'Ritual', icon: BookOpen },
  { key: 'other', label: 'Other', icon: FileText }
];

const MembersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, profile: userProfile, loading: authLoading, needsPasswordReset, forceRefresh } = useAuth();
  
  // Basic state
  const [allDocuments, setAllDocuments] = useState<LodgeDocument[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([]);
  const [blogPosts, setBlogPosts] = useState<CMSBlogPost[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [pageContent, setPageContent] = useState<Record<string, string>>({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Document filtering state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simple pagination state (no external hook)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Handle navigation for non-authenticated users
  useEffect(() => {
    console.log('🔍 MembersPage: Auth state check:', {
      authLoading,
      user: user ? user.email : null,
      profile: userProfile ? { role: userProfile.role, status: userProfile.status } : null,
      needsPasswordReset
    });
    
    if (!authLoading && !user) {
      console.log('🚪 MembersPage: No user, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }
    
    // Redirect pending users to pending page
    if (!authLoading && user && userProfile && userProfile.status === 'pending') {
      console.log('⏳ MembersPage: User pending, redirecting to pending page');
      navigate('/members/pending', { replace: true });
      return;
    }
    
    // Redirect inactive users to pending page as well
    if (!authLoading && user && userProfile && userProfile.status === 'inactive') {
      console.log('❌ MembersPage: User inactive, redirecting to pending page');
      navigate('/members/pending', { replace: true });
      return;
    }
    
    if (!authLoading && user && needsPasswordReset) {
      console.log('🔑 MembersPage: Password reset needed, redirecting');
      navigate('/password-reset', { replace: true });
      return;
    }
  }, [authLoading, user, userProfile, needsPasswordReset, navigate]);

  // Load initial data - only once when user is available
  useEffect(() => {
    if (!user || authLoading || dataLoaded) {
      return;
    }

    const loadData = async () => {
      try {
        setDataLoading(true);
        setConnectionError(null);
        
        console.log('🚀 MembersPage: Starting data load...');
        const startTime = Date.now();

        // Load page content (optional) - don't let this fail the whole page
        try {
          console.log('📄 MembersPage: Loading page content...');
          const content = await api.getPageContent('members');
          const contentMap: Record<string, string> = {};
          content.forEach(item => {
            contentMap[item.section_name] = item.content;
          });
          setPageContent(contentMap);
          console.log('✅ MembersPage: Page content loaded');
        } catch (contentError) {
          console.warn('Could not load page content:', contentError);
          // Continue without page content
        }
        
        console.log('📊 MembersPage: Loading documents and minutes...');
        const dataStartTime = Date.now();
        
        // Load essential data with individual error handling
        const results = await Promise.allSettled([
          api.getLodgeDocumentsPaginated(1, 50), // Load first 50 documents only
          api.getMeetingMinutes(),
          api.getBlogPosts(),
          api.getNewsArticles(),
          api.getSnippets()
        ]);
        
        const dataLoadTime = Date.now() - dataStartTime;
        console.log(`📊 MembersPage: Data requests completed in ${dataLoadTime}ms`);

        // Handle documents result
        if (results[0].status === 'fulfilled') {
          setAllDocuments(results[0].value.documents || []);
          console.log('📊 MembersPage: Documents loaded:', results[0].value.documents?.length || 0);
        } else {
          console.error('📊 MembersPage: Documents failed to load:', results[0].reason);
          setAllDocuments([]);
        }

        // Handle minutes result
        if (results[1].status === 'fulfilled') {
          setMinutes(results[1].value);
          console.log('📊 MembersPage: Minutes loaded:', results[1].value.length);
        } else {
          console.error('📊 MembersPage: Minutes failed to load:', results[1].reason);
          setMinutes([]);
        }
        
        // Handle blog posts result (combine all blog content types)
        const allBlogPosts: CMSBlogPost[] = [];
        if (results[2].status === 'fulfilled') {
          allBlogPosts.push(...results[2].value);
          console.log('📊 MembersPage: Blog posts loaded:', results[2].value.length);
        }
        if (results[3].status === 'fulfilled') {
          allBlogPosts.push(...results[3].value);
          console.log('📊 MembersPage: News articles loaded:', results[3].value.length);
        }
        if (results[4].status === 'fulfilled') {
          allBlogPosts.push(...results[4].value);
          console.log('📊 MembersPage: Snippets loaded:', results[4].value.length);
        }
        setBlogPosts(allBlogPosts);
        console.log('📊 MembersPage: Total blog content loaded:', allBlogPosts.length);
        
        const totalTime = Date.now() - startTime;
        console.log(`🎉 MembersPage: Total load time: ${totalTime}ms`);
        
        // Check if we have any critical failures
        const criticalFailures = results.filter(r => r.status === 'rejected').length;
        if (criticalFailures === results.length) {
          setConnectionError('Unable to load member data. Please check your connection and try again.');
        }
        
      } catch (err) {
        console.error('Error loading member data:', err);
        setConnectionError('Failed to load member data. Please try refreshing the page.');
      } finally {
        setDataLoading(false);
        setDataLoaded(true);
      }
    };

    loadData();
    
  }, [user, authLoading, dataLoaded]);

  // Calculate filtered and paginated documents
  const filteredAndPaginatedDocuments = useMemo(() => {
    if (selectedCategories.length === 0) {
      return { documents: [], total: 0, totalPages: 0 };
    }

    let allSelectedDocuments: (LodgeDocument | MeetingMinutes | CMSBlogPost)[] = [];
    
    // Collect documents from selected categories
    selectedCategories.forEach(category => {
      if (category === 'minutes') {
        allSelectedDocuments.push(...minutes);
      } else if (category === 'news') {
        const newsArticles = blogPosts.filter(post => post.category === 'news');
        allSelectedDocuments.push(...newsArticles);
      } else if (category === 'blog') {
        const blogArticles = blogPosts.filter(post => post.category === 'blog');
        allSelectedDocuments.push(...blogArticles);
      } else if (category === 'snippet') {
        const snippets = blogPosts.filter(post => post.category === 'snippet');
        allSelectedDocuments.push(...snippets);
      } else {
        const categoryDocs = allDocuments.filter(doc => doc.category === category);
        allSelectedDocuments.push(...categoryDocs);
      }
    });
    
    // Apply search filter
    if (searchTerm.trim()) {
      allSelectedDocuments = allSelectedDocuments.filter(doc => {
        const title = doc.title.toLowerCase();
        const description = ('description' in doc ? doc.description : doc.content)?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return title.includes(search) || description.includes(search);
      });
    }
    
    // Sort by date (newest first)
    allSelectedDocuments.sort((a, b) => {
      const dateA = new Date(
        'meeting_date' in a ? a.meeting_date : 
        'publish_date' in a ? a.publish_date : 
        a.created_at
      );
      const dateB = new Date(
        'meeting_date' in b ? b.meeting_date : 
        'publish_date' in b ? b.publish_date : 
        b.created_at
      );
      return dateB.getTime() - dateA.getTime();
    });
    
    // Calculate pagination
    const total = allSelectedDocuments.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const documents = allSelectedDocuments.slice(start, end);
    
    return { documents, total, totalPages };
  }, [selectedCategories, allDocuments, minutes, searchTerm, currentPage, pageSize]);

  // Reset to first page when categories or search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategories, searchTerm]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleCategoryToggle = (categoryKey: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryKey)) {
        return prev.filter(cat => cat !== categoryKey);
      } else {
        return [...prev, categoryKey];
      }
    });
  };

  const handleClearAllCategories = () => {
    setSelectedCategories([]);
    setSearchTerm('');
  };

  // Get document counts by category
  const getCategoryCount = (categoryKey: string) => {
    if (categoryKey === 'minutes') {
      return minutes.length;
    } else if (categoryKey === 'news') {
      return blogPosts.filter(post => post.category === 'news').length;
    } else if (categoryKey === 'blog') {
      return blogPosts.filter(post => post.category === 'blog').length;
    } else if (categoryKey === 'snippet') {
      return blogPosts.filter(post => post.category === 'snippet').length;
    }
    return allDocuments.filter(doc => doc.category === categoryKey).length;
  };

  // Simple pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Document row renderer for virtualized list
  const DocumentRow = ({ index, style, data }: { index: number; style: React.CSSProperties; data: (LodgeDocument | MeetingMinutes | CMSBlogPost)[] }) => {
    const doc = data[index];
    const isMinute = 'meeting_date' in doc;
    const isBlogPost = 'publish_date' in doc;
    
    return (
      <div style={style} className="px-4">
        <div className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between hover:shadow-soft transition-shadow">
          <div className="flex-grow">
            <h3 className="font-medium text-primary-600">{doc.title}</h3>
            {isBlogPost ? (
              <>
                <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{(doc as CMSBlogPost).summary}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium bg-purple-100 text-purple-600 px-2 py-1 rounded">
                    {(doc as CMSBlogPost).category.toUpperCase()}
                  </span>
                  <span className="text-xs text-neutral-500 ml-4">
                    Published: {new Date((doc as CMSBlogPost).publish_date).toLocaleDateString('en-GB')}
                  </span>
                  {(doc as CMSBlogPost).is_members_only && (
                    <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded ml-2">
                      MEMBERS ONLY
                    </span>
                  )}
                </div>
              </>
            ) : isMinute ? (
              <>
                <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{doc.content.substring(0, 150)}...</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    MEETING MINUTES
                  </span>
                  <span className="text-xs text-neutral-500 ml-4">
                    Meeting: {new Date(doc.meeting_date).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </>
            ) : (
              <>
                {doc.description && (
                  <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{doc.description}</p>
                )}
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                    {doc.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-neutral-500 ml-4">
                    Added {new Date(doc.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <a
              href={
                isBlogPost ? `/news/${doc.id}` :
                isMinute ? (doc as any).document_url || '#' : 
                doc.url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-500 hover:text-primary-600 transition-colors"
              title={
                isBlogPost ? "View blog post" :
                isMinute ? "View meeting minutes" : 
                "Open document"
              }
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center pt-12">
          <LoadingSpinner subtle={true} />
        </div>
      </div>
    );
  }

  // Show loading while data is loading
  if (user && dataLoading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center pt-12">
          <LoadingSpinner subtle={true} />
          <p className="text-neutral-600 mt-4">Loading member dashboard...</p>
          {connectionError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Connection Issue</p>
                  <p>{connectionError}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Connection Error Banner */}
        {connectionError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Database className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Limited Functionality</p>
                <p>{connectionError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="mt-2"
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Document Category Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-primary-600">
                    Document Categories
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Select categories to view
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={forceRefresh}
                    className="flex items-center"
                  >
                    Refresh Profile
                  </Button>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-3">
                {DOCUMENT_CATEGORIES.map((category) => {
                  const count = getCategoryCount(category.key);
                  const IconComponent = category.icon;
                  
                  return (
                    <label
                      key={category.key}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCategories.includes(category.key)
                          ? 'border-secondary-500 bg-secondary-50'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.key)}
                        onChange={() => handleCategoryToggle(category.key)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                        selectedCategories.includes(category.key)
                          ? 'border-secondary-500 bg-secondary-500'
                          : 'border-neutral-300'
                      }`}>
                        {selectedCategories.includes(category.key) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <IconComponent size={16} className="text-neutral-500 mr-2" />
                      <div className="flex-grow">
                        <span className="text-sm font-medium text-neutral-700">
                          {category.label}
                        </span>
                        <span className="text-xs text-neutral-500 ml-2">
                          ({count})
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Clear All Button */}
              {selectedCategories.length > 0 && (
                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllCategories}
                    className="w-full flex items-center justify-center"
                  >
                    <X size={16} className="mr-2" />
                    Clear All Selections
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Dashboard Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Profile Summary Card */}
              <ProfileSummaryCard 
                profile={userProfile} 
                userEmail={user?.email}
              />
              
              {/* Recent Updates Card */}
              <RecentUpdatesCard 
                minutes={minutes}
                onViewAllMinutes={() => setSelectedCategories(['minutes'])}
              />
              
              {/* Recent Documents Card */}
              <RecentDocumentsCard 
                documents={allDocuments}
                onViewAllDocuments={() => setSelectedCategories(['grand_lodge', 'provincial', 'summons', 'resources'])}
              />
              
              {/* Quick Actions Card - spans full width on mobile, single column on larger screens */}
              <div className="md:col-span-2 lg:col-span-3">
                <QuickActionsCard 
                  isAdmin={isAdmin || userProfile?.role === 'admin'}
                  onSelectMinutes={() => setSelectedCategories(['minutes'])}
                />
              </div>
            </div>

            {/* Document Browser Section */}
            <DashboardCard 
              title="Document Browser"
              icon={FileText}
              headerAction={
                selectedCategories.length > 0 && (
                  <span className="text-sm text-neutral-500">
                    {filteredAndPaginatedDocuments.total} documents found
                  </span>
                )
              }
            >
              {selectedCategories.length === 0 && (
                <p className="text-sm text-neutral-500 mb-6">
                  Select categories from the left to view documents
                </p>
              )}

              {/* Search Bar - Only show when categories are selected */}
              {selectedCategories.length > 0 && (
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search within selected documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  </div>
                </div>
              )}

              {/* Document Display Area */}
              {selectedCategories.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-12 h-12 text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-600 mb-2">
                    Select Document Categories
                  </h3>
                  <p className="text-neutral-500 max-w-md mx-auto">
                    Choose one or more categories from the left sidebar to view documents. 
                    You can select multiple categories to see a combined view.
                  </p>
                </div>
              ) : filteredAndPaginatedDocuments.documents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-600 mb-2">
                    No Documents Found
                  </h3>
                  <p className="text-neutral-500 max-w-md mx-auto">
                    {searchTerm 
                      ? `No documents match your search "${searchTerm}" in the selected categories.`
                      : 'No documents found for your current selection. Try selecting different categories.'
                    }
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm('')}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Virtualized list for better performance */}
                  <VirtualizedList
                    items={filteredAndPaginatedDocuments.documents}
                    height={600}
                    itemHeight={120}
                    renderItem={DocumentRow}
                    className="border border-neutral-200 rounded-lg"
                  />
                  
                  {/* Pagination controls */}
                  {filteredAndPaginatedDocuments.total > pageSize && (
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={filteredAndPaginatedDocuments.totalPages}
                      pageSize={pageSize}
                      totalItems={filteredAndPaginatedDocuments.total}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      canGoNext={currentPage < filteredAndPaginatedDocuments.totalPages}
                      canGoPrev={currentPage > 1}
                      onFirstPage={() => setCurrentPage(1)}
                      onLastPage={() => setCurrentPage(filteredAndPaginatedDocuments.totalPages)}
                      onNextPage={() => setCurrentPage(prev => Math.min(prev + 1, filteredAndPaginatedDocuments.totalPages))}
                      onPrevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    />
                  )}
                </div>
              )}
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;