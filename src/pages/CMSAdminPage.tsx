// src/pages/CMSAdminPage.tsx
import React, { useEffect, useState } from "react";
import { cmsApi } from "../lib/cmsApi";
import {
  CMSBlogPost,
  Event,
  Officer,
  FAQItem,
  PageContent,
  SiteSetting,
} from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

const CMSAdminPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [newsArticles, setNewsArticles] = useState<CMSBlogPost[]>([]);
  const [snippets, setSnippets] = useState<CMSBlogPost[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  /* -------------------------------------------------------
   *  Load All CMS Data
   * ----------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          news,
          snippetsData,
          eventsData,
          officersData,
          faqData,
          siteSettings,
          content,
        ] = await Promise.all([
          cmsApi.getBlogPosts("news"),
          cmsApi.getBlogPosts("snippet"),
          cmsApi.getEvents(),
          cmsApi.getOfficers(),
          cmsApi.getFAQItems(),
          cmsApi.getSiteSettings(),
          cmsApi.getPageContent("about"),
        ]);

        setNewsArticles(
          (news ?? []).map((post: any) => ({
            id: post.id ?? "",
            title: post.title ?? "",
            content: post.content ?? "",
            summary: post.summary ?? "",
            category: post.category ?? "news",
            author: post.author ?? "",
            image_url: post.image_url ?? null,
            featured: post.featured ?? false,
            publish_date: post.publish_date ?? "",
            is_published: post.is_published ?? false,
            is_members_only: post.is_members_only ?? false,
            view_count: post.view_count ?? 0,
            created_at: post.created_at ?? "",
            updated_at: post.updated_at ?? "",
          }))
        );
        setSnippets(
          (snippetsData ?? []).map((post: any) => ({
            id: post.id ?? "",
            title: post.title ?? "",
            content: post.content ?? "",
            summary: post.summary ?? "",
            category: post.category ?? "snippet",
            author: post.author ?? "",
            image_url: post.image_url ?? null,
            featured: post.featured ?? false,
            publish_date: post.publish_date ?? "",
            is_published: post.is_published ?? false,
            is_members_only: post.is_members_only ?? false,
            view_count: post.view_count ?? 0,
            created_at: post.created_at ?? "",
            updated_at: post.updated_at ?? "",
          }))
        );
        setEvents(
          (eventsData ?? []).map((ev: any) => ({
            id: ev.id ?? "",
            title: ev.title ?? "",
            description: ev.description ?? "",
            event_date: ev.event_date ?? "",
            location: ev.location ?? "",
            image_url: ev.image_url ?? null,
            is_members_only: ev.is_members_only ?? false,
            is_past_event: ev.is_past_event ?? false,
            created_at: ev.created_at ?? "",
            updated_at: ev.updated_at ?? "",
          }))
        );
        setOfficers(officersData);
        setFaqs(faqData);
        setSettings(
          siteSettings.reduce(
            (acc, row) => ({ ...acc, [row.setting_key]: row.setting_value }),
            {}
          )
        );
        setPageContent(content);
      } catch (error) {
        console.error("❌ Error loading CMS data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* -------------------------------------------------------
   *  Refresh Utility
   * ----------------------------------------------------- */
  const refreshData = async () => {
    try {
      const [news, snippetsData] = await Promise.all([
        cmsApi.getBlogPosts("news"),
        cmsApi.getBlogPosts("snippet"),
      ]);
      setNewsArticles(
        (news ?? []).map((post: any) => ({
          id: post.id ?? "",
          title: post.title ?? "",
          content: post.content ?? "",
          summary: post.summary ?? "",
          category: post.category ?? "news",
          author: post.author ?? "",
          image_url: post.image_url ?? null,
          featured: post.featured ?? false,
          publish_date: post.publish_date ?? "",
          is_published: post.is_published ?? false,
          is_members_only: post.is_members_only ?? false,
          view_count: post.view_count ?? 0,
          created_at: post.created_at ?? "",
          updated_at: post.updated_at ?? "",
        }))
      );
      setSnippets(
        (snippetsData ?? []).map((post: any) => ({
          id: post.id ?? "",
          title: post.title ?? "",
          content: post.content ?? "",
          summary: post.summary ?? "",
          category: post.category ?? "snippet",
          author: post.author ?? "",
          image_url: post.image_url ?? null,
          featured: post.featured ?? false,
          publish_date: post.publish_date ?? "",
          is_published: post.is_published ?? false,
          is_members_only: post.is_members_only ?? false,
          view_count: post.view_count ?? 0,
          created_at: post.created_at ?? "",
          updated_at: post.updated_at ?? "",
        }))
      );
    } catch (error) {
      console.error("Error refreshing CMS data:", error);
    }
  };

  /* -------------------------------------------------------
   *  CRUD HANDLERS – NEWS
   * ----------------------------------------------------- */
  const handleCreateNews = async (article: Partial<CMSBlogPost>) => {
    await cmsApi.createBlogPost({
      title: article.title ?? "Untitled News Article",
      content: article.content ?? "",
      summary: article.summary ?? "",
      category: "news",
      // Only pass allowed fields for create
      image_url: article.image_url ?? null,
      // featured is not allowed in API create
      publish_date: article.publish_date ?? new Date().toISOString(),
      is_published: article.is_published ?? true,
      is_members_only: article.is_members_only ?? false,
      // view_count is not allowed in API create
    });
    await refreshData();
  };

  const handleUpdateNews = async (
    id: string,
    article: Partial<CMSBlogPost>
  ) => {
    await cmsApi.updateBlogPost(id, {
      title: article.title ?? "Untitled News Article",
      content: article.content ?? "",
      summary: article.summary ?? "",
      category: "news",
      image_url: article.image_url ?? null,
      // featured is not allowed in API update
      publish_date: article.publish_date ?? new Date().toISOString(),
      is_published: article.is_published ?? true,
      is_members_only: article.is_members_only ?? false,
      // view_count is not allowed in API update
    });
    await refreshData();
  };

  const handleDeleteNews = async (id: string) => {
    await cmsApi.deleteBlogPost(id);
    await refreshData();
  };

  /* -------------------------------------------------------
   *  CRUD HANDLERS – SNIPPETS
   * ----------------------------------------------------- */
  const handleCreateSnippet = async (snippet: Partial<CMSBlogPost>) => {
    await cmsApi.createBlogPost({
      title: snippet.title ?? "Untitled Snippet",
      content: snippet.content ?? "",
      summary: snippet.summary ?? "",
      category: "snippet",
      image_url: snippet.image_url ?? null,
      // featured is not allowed in API create
      publish_date: snippet.publish_date ?? new Date().toISOString(),
      is_published: snippet.is_published ?? true,
      is_members_only: snippet.is_members_only ?? false,
      // view_count is not allowed in API create
    });
    await refreshData();
  };

  const handleUpdateSnippet = async (
    id: string,
    snippet: Partial<CMSBlogPost>
  ) => {
    await cmsApi.updateBlogPost(id, {
      title: snippet.title ?? "Untitled Snippet",
      content: snippet.content ?? "",
      summary: snippet.summary ?? "",
      category: "snippet",
      image_url: snippet.image_url ?? null,
      // featured is not allowed in API update
      publish_date: snippet.publish_date ?? new Date().toISOString(),
      is_published: snippet.is_published ?? true,
      is_members_only: snippet.is_members_only ?? false,
      // view_count is not allowed in API update
    });
    await refreshData();
  };

  const handleDeleteSnippet = async (id: string) => {
    await cmsApi.deleteBlogPost(id);
    await refreshData();
  };

  /* -------------------------------------------------------
   *  EVENTS CRUD
   * ----------------------------------------------------- */
  const handleCreateEvent = async (event: Partial<Event>) => {
    await cmsApi.createEvent({
      title: event.title ?? "Untitled Event",
      description: event.description ?? "",
      event_date: event.event_date ?? new Date().toISOString(),
      location: event.location ?? "TBC",
      image_url: event.image_url ?? null,
      is_members_only: event.is_members_only ?? false,
      is_past_event: event.is_past_event ?? false,
      updated_at: event.updated_at ?? new Date().toISOString(),
    });
    await refreshData();
  };

  const handleUpdateEvent = async (id: string, event: Partial<Event>) => {
    await cmsApi.updateEvent(id, {
      title: event.title ?? "Untitled Event",
      description: event.description ?? "",
      event_date: event.event_date ?? new Date().toISOString(),
      location: event.location ?? "TBC",
      image_url: event.image_url ?? null,
      is_members_only: event.is_members_only ?? false,
      is_past_event: event.is_past_event ?? false,
      updated_at: event.updated_at ?? new Date().toISOString(),
    });
    await refreshData();
  };

  const handleDeleteEvent = async (id: string) => {
    await cmsApi.deleteEvent(id);
    await refreshData();
  };

  /* -------------------------------------------------------
   *  SITE SETTINGS
   * ----------------------------------------------------- */
  const handleUpdateSetting = async (key: string, value: string) => {
    await cmsApi.updateSiteSetting(key, value);
    const updated = await cmsApi.getSiteSettings();
    setSettings(
      updated.reduce(
        (acc, row) => ({ ...acc, [row.setting_key]: row.setting_value }),
        {}
      )
    );
  };

  /* -------------------------------------------------------
   *  PAGE CONTENT
   * ----------------------------------------------------- */
  const handleUpdatePageContent = async (newContent: string) => {
    if (!pageContent) return;
    await cmsApi.updateSiteSetting(pageContent.id, { content: newContent });
    const refreshed = await cmsApi.getPageContent("about");
    setPageContent(refreshed);
  };

  /* -------------------------------------------------------
   *  RENDER
   * ----------------------------------------------------- */
  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold mb-4">CMS Administration</h1>

      {/* -------------------- NEWS SECTION -------------------- */}
      <section>
        <h2 className="text-xl font-medium mb-2">News Articles</h2>
        <Button onClick={() => handleCreateNews({ title: "New Article" })}>
          + New Article
        </Button>
        <ul className="mt-2">
          {newsArticles.map((post) => (
            <li
              key={post.id}
              className="py-1 flex justify-between items-center"
            >
              <span>{post.title}</span>
              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdateNews(post.id, post)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteNews(post.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------- SNIPPETS SECTION -------------------- */}
      <section>
        <h2 className="text-xl font-medium mb-2">Snippets</h2>
        <Button onClick={() => handleCreateSnippet({ title: "New Snippet" })}>
          + New Snippet
        </Button>
        <ul className="mt-2">
          {snippets.map((snip) => (
            <li
              key={snip.id}
              className="py-1 flex justify-between items-center"
            >
              <span>{snip.title}</span>
              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdateSnippet(snip.id, snip)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteSnippet(snip.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------- EVENTS SECTION -------------------- */}
      <section>
        <h2 className="text-xl font-medium mb-2">Events</h2>
        <Button onClick={() => handleCreateEvent({ title: "New Event" })}>
          + New Event
        </Button>
        <ul className="mt-2">
          {events.map((ev) => (
            <li key={ev.id} className="py-1 flex justify-between items-center">
              <span>{ev.title}</span>
              <div className="space-x-2">
                <Button size="sm" onClick={() => handleUpdateEvent(ev.id, ev)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteEvent(ev.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CMSAdminPage;
