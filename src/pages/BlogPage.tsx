// src/pages/BlogPage.tsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import NewsCard from '../components/NewsCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import CategoryFilter from '../components/CategoryFilter'
import { optimizedApi as cmsApi, CMSBlogPost } from '../lib/optimizedApi'

const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<CMSBlogPost[]>([])
  const [filteredBlogPosts, setFilteredBlogPosts] = useState<CMSBlogPost[]>([])
  const [featuredArticle, setFeaturedArticle] = useState<CMSBlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        const blogData = await cmsApi.getBlogPosts()
        setBlogPosts(blogData)

        if (blogData.length > 0) {
          // Default featured article = most recent
          const sorted = [...blogData].sort(
            (a, b) =>
              new Date(b.created_at ?? '').getTime() -
              new Date(a.created_at ?? '').getTime()
          )
          setFeaturedArticle(sorted[0])
        }
      } catch (err) {
        console.error('Error loading blog posts:', err)
        setError('Failed to load blog posts. Please try again later.')
        setBlogPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadBlogPosts()
  }, [])

  // Convert CMS blog post to component format for NewsCard
  const convertBlogPostData = (cmsBlogPost: CMSBlogPost) => ({
    id: cmsBlogPost.id,
    title: cmsBlogPost.title,
    date: new Date(cmsBlogPost.created_at ?? ''), // safe conversion
    summary: cmsBlogPost.summary ?? '',
    content: cmsBlogPost.content ?? '',
    image: (cmsBlogPost as any).image_url ?? '',
    isMembers: (cmsBlogPost as any).is_members_only ?? false,
  })

  // Sort filtered results (newest first)
  const sortedBlogPosts = [...filteredBlogPosts].sort(
    (a, b) =>
      new Date(b.created_at ?? '').getTime() -
      new Date(a.created_at ?? '').getTime()
  )

  // Exclude featured from "recent"
  const recentArticles = sortedBlogPosts.filter(
    (a) => a.id !== featuredArticle?.id
  )

  return (
    <>
      {/* Blog Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="pt-32 pb-20 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4">
              Lodge <span className="block text-secondary-500">Chronicles</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-100 max-w-2xl mx-auto">
              Stories, insights, and reflections from the heart of Radlett Lodge
              No. 6652
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <CategoryFilter items={blogPosts} onFilter={setFilteredBlogPosts} />
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <SectionHeading
                title="Featured Article"
                subtitle="Our latest highlight from the blog"
              />
              <div className="bg-neutral-50 rounded-xl overflow-hidden shadow-lg grid md:grid-cols-2">
                {(featuredArticle as any).image_url && (
                  <img
                    src={(featuredArticle as any).image_url}
                    alt={featuredArticle.title}
                    className="object-cover w-full h-64 md:h-auto"
                  />
                )}
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-sm text-gray-500 mb-2">
                    {featuredArticle.created_at
                      ? new Date(featuredArticle.created_at).toLocaleDateString(
                          'en-GB'
                        )
                      : ''}
                  </p>
                  <h2 className="text-2xl font-bold text-primary-600 mb-4">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-700 mb-6">
                    {featuredArticle.summary}
                  </p>
                  <Link to={`/blog/${featuredArticle.id}`}>
                    <Button>Read Full Article →</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Articles */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Recent Articles"
            subtitle="More posts from our lodge blog"
            centered
          />

          {loading ? (
            <LoadingSpinner subtle={true} className="py-8" />
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.map((post) => (
                <NewsCard key={post.id} news={convertBlogPostData(post)} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No blog posts available yet.
            </p>
          )}
        </div>
      </section>
    </>
  )
}

export default BlogPage
