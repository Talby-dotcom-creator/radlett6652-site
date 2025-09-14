import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, FileText, Users, MessageSquare, HelpCircle, Settings, BookOpen, Lightbulb, Image } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { cmsApi } from '../lib/cmsApi';
import { useToast } from '../hooks/useToast';
import { CMSEvent, CMSNewsArticle, CMSOfficer, CMSTestimonial, CMSFAQItem, CMSSiteSetting, CMSPageContent } from '../types';
import EventForm from '../components/cms/EventForm';
import NewsForm from '../components/cms/NewsForm';
import OfficerForm from '../components/cms/OfficerForm';
import TestimonialForm from '../components/cms/TestimonialForm';
import FAQForm from '../components/cms/FAQForm';
import PageContentForm from '../components/cms/PageContentForm';
import SiteSettingsForm from '../components/cms/SiteSettingsForm';
import ContentPreview from '../components/cms/ContentPreview';
import BlogForm from '../components/cms/BlogForm';
import MediaManager from '../components/cms/MediaManager';

type ContentType = 'events' | 'news' | 'blog' | 'snippets' | 'officers' | 'testimonials' | 'faq' | 'settings' | 'page_content';

const CMSAdminPage: React.FC = () => {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const { user, profile, needsPasswordReset, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();
  
  const [activeTab, setActiveTab] = useState<ContentType>('events');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [showMediaManager, setShowMediaManager] = useState(false);

  // Data states
  const [events, setEvents] = useState<CMSEvent[]>([]);
  const [news, setNews] = useState<CMSNewsArticle[]>([]);
  const [blogPosts, setBlogPosts] = useState<CMSNewsArticle[]>([]);
  const [snippets, setSnippets] = useState<CMSNewsArticle[]>([]);
  const [officers, setOfficers] = useState<CMSOfficer[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [faqItems, setFaqItems] = useState<CMSFAQItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<CMSSiteSetting[]>([]);
  const [pageContent, setPageContent] = useState<CMSPageContent[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NOW SAFE TO HAVE CONDITIONAL RETURNS AFTER ALL HOOKS ARE DECLARED

  // Redirect if not authenticated or not admin
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (needsPasswordReset) {
    return <Navigate to="/password-reset" replace />;
  }

  if (profile && (profile.role !== 'admin' || profile.status !== 'active')) {
    console.log('🚫 CMSAdminPage: Access denied. Profile:', profile);
    return <Navigate to="/members" replace />;
  }

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eventsData, newsData, blogData, snippetsData, officersData, testimonialsData, faqData, settingsData, contentData] = await Promise.all([
        cmsApi.getEvents(),
        cmsApi.getNewsArticles(),
        cmsApi.getBlogPosts(),
        cmsApi.getSnippets(),
        cmsApi.getOfficers(),
        cmsApi.getTestimonials(),
        cmsApi.getFAQItems(),
        cmsApi.getSiteSettings(),
        cmsApi.getPageContent()
      ]);
      
      setEvents(eventsData);
      setNews(newsData);
      setBlogPosts(blogData);
      setSnippets(snippetsData);
      setOfficers(officersData);
      setTestimonials(testimonialsData);
      setFaqItems(faqData);
      setSiteSettings(settingsData);
      setPageContent(contentData);
    } catch (err) {
      console.error('Error loading CMS data:', err);
      setError('Failed to load CMS data.');
      toastError('Failed to load CMS data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Show loading while auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen pb-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 text-center pt-12">
          <LoadingSpinner subtle={true} />
        </div>
      </div>
    );
  }

  // Show message if profile is still loading
  if (!profile) {
    return (
      <div className="min-h-screen pb-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 text-center pt-12">
          <LoadingSpinner subtle={true} />
          <p className="text-neutral-600 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        switch (activeTab) {
          case 'events':
            await cmsApi.deleteEvent(itemToDelete);
            break;
          case 'news':
            await cmsApi.deleteNewsArticle(itemToDelete);
            break;
          case 'blog':
            await cmsApi.deleteBlogPost(itemToDelete);
            break;
          case 'snippets':
            await cmsApi.deleteBlogPost(itemToDelete);
            break;
          case 'officers':
            await cmsApi.deleteOfficer(itemToDelete);
            break;
          case 'testimonials':
            await cmsApi.deleteTestimonial(itemToDelete);
            break;
          case 'faq':
            await cmsApi.deleteFAQItem(itemToDelete);
            break;
        }
        success('Item deleted successfully!');
        loadData();
      } catch (err) {
        console.error('Error deleting item:', err);
        toastError('Failed to delete item.');
      } finally {
        setItemToDelete(null);
        setShowConfirmDialog(false);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      switch (activeTab) {
        case 'events':
          if (editingItem) {
            await cmsApi.updateEvent(editingItem.id, data);
          } else {
            await cmsApi.createEvent(data);
          }
          break;
        case 'news':
          if (editingItem) {
            await cmsApi.updateNewsArticle(editingItem.id, data);
          } else {
            await cmsApi.createNewsArticle(data);
          }
          break;
        case 'blog':
          if (editingItem) {
            await cmsApi.updateBlogPost(editingItem.id, { ...data, category: 'blog' });
          } else {
            await cmsApi.createBlogPost({ ...data, category: 'blog' });
          }
          break;
        case 'snippets':
          if (editingItem) {
            await cmsApi.updateBlogPost(editingItem.id, { ...data, category: 'snippet' });
          } else {
            await cmsApi.createBlogPost({ ...data, category: 'snippet' });
          }
          break;
        case 'officers':
          if (editingItem) {
            await cmsApi.updateOfficer(editingItem.id, data);
          } else {
            await cmsApi.createOfficer(data);
          }
          break;
        case 'testimonials':
          if (editingItem) {
            await cmsApi.updateTestimonial(editingItem.id, data);
          } else {
            await cmsApi.createTestimonial(data);
          }
          break;
        case 'faq':
          if (editingItem) {
            await cmsApi.updateFAQItem(editingItem.id, data);
          } else {
            await cmsApi.createFAQItem(data);
          }
          break;
        case 'page_content':
          if (editingItem) {
            await cmsApi.updatePageContent(data.page_name, data.section_name, data.content);
          } else {
            await cmsApi.createPageContent(data);
          }
          break;
      }
      success(`${activeTab === 'page_content' ? 'Page content' : activeTab.slice(0, -1)} ${editingItem ? 'updated' : 'created'} successfully!`);
      setShowForm(false);
      setEditingItem(null);
      loadData();
    } catch (err) {
      console.error('Error saving item:', err);
      toastError('Failed to save item.');
    }
  };

  const handleSiteSettingsSubmit = async (data: Record<string, string>) => {
    try {
      // Update each setting individually
      await Promise.all(
        Object.entries(data).map(([key, value]) =>
          cmsApi.updateSiteSetting(key, value)
        )
      );
      success('Site settings updated successfully!');
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error('Error updating site settings:', err);
      toastError('Failed to update site settings.');
    }
  };

  const handleMediaSelect = (url: string) => {
    console.log('Selected media URL:', url);
    setShowMediaManager(false);
    success(`Media selected: ${url.substring(0, 50)}...`);
  };

  const handleTogglePublish = async (item: any) => {
    try {
      switch (activeTab) {
        case 'events':
          // Events don't have a published field, skip
          break;
        case 'news':
          await cmsApi.updateNewsArticle(item.id, { is_published: !item.is_published });
          break;
        case 'blog':
          await cmsApi.updateBlogPost(item.id, { is_published: !item.is_published });
          break;
        case 'snippets':
          await cmsApi.updateBlogPost(item.id, { is_published: !item.is_published });
          break;
        case 'officers':
          await cmsApi.updateOfficer(item.id, { is_active: !item.is_active });
          break;
        case 'testimonials':
          await cmsApi.updateTestimonial(item.id, { is_published: !item.is_published });
          break;
        case 'faq':
          await cmsApi.updateFAQItem(item.id, { is_published: !item.is_published });
          break;
      }
      success(`Item ${item.is_published || item.is_active ? 'unpublished' : 'published'} successfully!`);
      loadData();
    } catch (err) {
      console.error('Error toggling publish status:', err);
      toastError('Failed to toggle publish status.');
    }
  };

  const handlePreview = (item: any) => {
    setPreviewContent(item);
    setShowPreview(true);
  };

  const renderTabContent = () => {
    if (loading) {
      return <LoadingSpinner subtle={true} className="py-8" />;
    }

    if (showForm) {
      switch (activeTab) {
        case 'events':
          return (
            <EventForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
            />
          );
        case 'news':
          return (
            <NewsForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
            />
          );
        case 'blog':
        case 'snippets':
          return (
            <BlogForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
            />
          );
        case 'officers':
          return (
            <OfficerForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
            />
          );
        case 'testimonials':
          return (
            <TestimonialForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
            />
          );
        case 'faq':
          return (
            <FAQForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
            />
          );
        case 'page_content':
          return (
            <PageContentForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem}
            />
          );
        case 'settings':
          return (
            <SiteSettingsForm
              initialData={siteSettings}
              onSubmit={handleSiteSettingsSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          );
      }
    }

    return renderContentList();
  };

  const renderContentList = () => {
    let items: any[] = [];
    let emptyMessage = '';

    switch (activeTab) {
      case 'events':
        items = events;
        emptyMessage = 'No events found. Click "New Event" to create one.';
        break;
      case 'news':
        items = news;
        emptyMessage = 'No news articles found. Click "New Article" to create one.';
        break;
      case 'blog':
        items = blogPosts.filter(post => post.category === 'blog');
        emptyMessage = 'No blog posts found. Click "New Blog Post" to create one.';
        break;
      case 'snippets':
        items = snippets;
        emptyMessage = 'No snippets found. Click "New Snippet" to create one.';
        break;
      case 'officers':
        items = officers;
        emptyMessage = 'No officers found. Click "New Officer" to create one.';
        break;
      case 'testimonials':
        items = testimonials;
        emptyMessage = 'No testimonials found. Click "New Testimonial" to create one.';
        break;
      case 'faq':
        items = faqItems;
        emptyMessage = 'No FAQ items found. Click "New FAQ" to create one.';
        break;
      case 'page_content':
        items = pageContent;
        emptyMessage = 'No page content found. Click "New Content" to create one.';
        break;
      case 'settings':
        items = siteSettings;
        emptyMessage = 'No site settings found.';
        break;
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-neutral-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div className="flex-grow">
              <h3 className="font-semibold text-primary-600">
                {item.title || item.full_name || item.member_name || item.question || item.setting_key || `${item.page_name} - ${item.section_name}`}
              </h3>
              <p className="text-sm text-neutral-600 line-clamp-1">
                {item.description || item.summary || item.position || item.content || item.answer || item.setting_value}
              </p>
              <div className="flex items-center text-xs text-neutral-500 mt-2">
                {item.event_date && <span>{new Date(item.event_date).toLocaleDateString()}</span>}
                {item.publish_date && <span>{new Date(item.publish_date).toLocaleDateString()}</span>}
                {item.meeting_date && <span>{new Date(item.meeting_date).toLocaleDateString()}</span>}
                {(item.is_published !== undefined || item.is_active !== undefined) && (
                  <>
                    <span className="mx-2">•</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      (item.is_published || item.is_active) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(item.is_published || item.is_active) ? 'Published' : 'Draft'}
                    </span>
                  </>
                )}
                {item.is_members_only && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Members Only
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {activeTab !== 'settings' && (
                <Button variant="outline" size="sm" onClick={() => handlePreview(item)} title="Preview">
                  <Eye size={16} />
                </Button>
              )}
              {(item.is_published !== undefined || item.is_active !== undefined) && (
                <Button variant="outline" size="sm" onClick={() => handleTogglePublish(item)} title={item.is_published || item.is_active ? 'Unpublish' : 'Publish'}>
                  {item.is_published || item.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)} title="Edit">
                <Edit size={16} />
              </Button>
              {activeTab !== 'settings' && (
                <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} title="Delete">
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getTabIcon = (tab: ContentType) => {
    switch (tab) {
      case 'events': return Calendar;
      case 'news': return FileText;
      case 'blog': return BookOpen;
      case 'snippets': return Lightbulb;
      case 'officers': return Users;
      case 'testimonials': return MessageSquare;
      case 'faq': return HelpCircle;
      case 'page_content': return BookOpen;
      case 'settings': return Settings;
      default: return FileText;
    }
  };

  const getCreateButtonText = () => {
    switch (activeTab) {
      case 'events': return 'New Event';
      case 'news': return 'New Article';
      case 'blog': return 'New Blog Post';
      case 'snippets': return 'New Snippet';
      case 'officers': return 'New Officer';
      case 'testimonials': return 'New Testimonial';
      case 'faq': return 'New FAQ';
      case 'page_content': return 'New Content';
      case 'settings': return 'Edit Settings';
      default: return 'New Item';
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary-600">Content Management System</h1>
            <p className="text-neutral-600 mt-2">Manage all website content from this central dashboard</p>
          </div>
          
          {/* Top Action Buttons */}
          <div className="flex items-center space-x-3">
            <Link to="/members/cms/blog">
              <Button variant="primary" size="sm" className="flex items-center">
                <Lightbulb size={16} className="mr-2" />
                Manage Blog/Snippets
              </Button>
            </Link>
            <Button variant="primary" size="sm" className="flex items-center" onClick={() => setShowMediaManager(true)}>
              <Image size={16} className="mr-2" />
              Media Library
            </Button>
            <Link to="/members">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        <DashboardCard
          title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('_', ' ')} Management`}
          icon={getTabIcon(activeTab)}
          headerAction={
            !showForm && (
              <Button onClick={handleCreate} size="sm" className="flex items-center">
                <Plus size={16} className="mr-2" />
                {getCreateButtonText()}
              </Button>
            )
          }
        >
          {/* Tab Navigation */}
          <div className="border-b border-neutral-200 mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {[
                { key: 'events', label: 'Events', icon: Calendar },
                { key: 'news', label: 'News', icon: FileText },
                { key: 'blog', label: 'Blog Posts', icon: BookOpen },
                { key: 'snippets', label: 'Snippets', icon: Lightbulb },
                { key: 'officers', label: 'Officers', icon: Users },
                { key: 'testimonials', label: 'Testimonials', icon: MessageSquare },
                { key: 'faq', label: 'FAQ', icon: HelpCircle },
                { key: 'page_content', label: 'Page Content', icon: BookOpen },
                { key: 'settings', label: 'Site Settings', icon: Settings }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key as ContentType);
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-secondary-500 text-secondary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <IconComponent size={16} className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </DashboardCard>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setItemToDelete(null);
          setShowConfirmDialog(false);
        }}
        type="danger"
      />

      <ContentPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        content={previewContent}
        contentType={activeTab === 'news' || activeTab === 'blog' || activeTab === 'snippets' ? 'news' : activeTab === 'events' ? 'event' : activeTab === 'officers' ? 'officer' : activeTab === 'testimonials' ? 'testimonial' : activeTab === 'faq' ? 'faq' : 'page_content'}
      />

      {/* Media Manager Modal */}
      <MediaManager
        isOpen={showMediaManager}
        onClose={() => setShowMediaManager(false)}
        onSelectMedia={handleMediaSelect}
        allowMultiple={false}
      />
    </div>
  );
};

export default CMSAdminPage;