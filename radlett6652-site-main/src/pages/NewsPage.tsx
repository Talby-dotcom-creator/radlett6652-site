// src/pages/NewsPage.tsx
import React, { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import SectionHeading from '../components/SectionHeading'
import NewsCard from '../components/NewsCard'
import LoadingSpinner from '../components/LoadingSpinner'
import CategoryFilter from '../components/CategoryFilter'
import { optimizedApi as cmsApi } from '../lib/optimizedApi'
import { CMSBlogPost } from '../types'

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<CMSBlogPost[]>([])
  const [filteredNews, setFilteredNews] = useState<CMSBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        setError(null)
        const newsData = await cmsApi.getNews()
        setNews(newsData as CMSBlogPost[])
      } catch (err) {
        console.error('Error loading news:', err)
        setError('Failed to load news articles. Please try again later.')
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  // Convert CMS data to NewsCard props
  const convertNewsData = (cmsNews: CMSBlogPost) => ({
    id: cmsNews.id,
    title: cmsNews.title,
    date: cmsNews.publish_date
      ? new Date(cmsNews.publish_date)
      : new Date(cmsNews.created_at ?? ''),
    summary: cmsNews.summary ?? '',
    content: cmsNews.content ?? '',
    image: cmsNews.image_url ?? '',
    isMembers: cmsNews.is_members_only ?? false,
  })

  // Sort results (newest first)
  const sortedNews = [...filteredNews].sort(
    (a, b) =>
      new Date(b.publish_date ?? b.created_at ?? '').getTime() -
      new Date(a.publish_date ?? a.created_at ?? '').getTime()
  )

  return (
    <>
      <HeroSection
        title="News & Updates"
        subtitle="Stay informed about the latest activities and announcements from Radlett Lodge"
        backgroundImage="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/Radlett%20news%20and%20events_1753695345519_vp0q3d.webp"
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Latest News"
            subtitle="Keeping you updated with the activities and achievements of our Lodge."
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Filters */}
          <CategoryFilter items={news} onFilter={setFilteredNews} />

          {/* News Grid */}
          {loading ? (
            <LoadingSpinner subtle={true} className="py-4" />
          ) : sortedNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedNews.map((newsItem) => (
                <NewsCard key={newsItem.id} news={convertNewsData(newsItem)} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 p-8 rounded-lg text-center">
              <p className="text-neutral-600">
                No news articles available at this time.
              </p>
              <p className="text-sm text-neutral-500 mt-2">
                Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default NewsPage
