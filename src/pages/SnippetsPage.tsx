// src/pages/SnippetsPage.tsx
import React, { useState, useEffect } from 'react'
import {
  Clock,
  Calendar,
  ArrowRight,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import SectionHeading from '../components/SectionHeading'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import { optimizedApi as api } from '../lib/optimizedApi'
import { CMSBlogPost } from '../types'

const SnippetsPage: React.FC = () => {
  const [snippets, setSnippets] = useState<CMSBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)

  useEffect(() => {
    const loadSnippets = async () => {
      try {
        setLoading(true)
        setError(null)
        const snippetsData = await api.getSnippets()
        const publishedSnippets = snippetsData.filter(
          (snippet) => snippet.is_published
        )
        // ✅ Safe date handling
        publishedSnippets.sort(
          (a, b) =>
            new Date(b.publish_date ?? '').getTime() -
            new Date(a.publish_date ?? '').getTime()
        )
        setSnippets(publishedSnippets as CMSBlogPost[])
      } catch (err) {
        console.error('Error loading snippets:', err)
        setError('Failed to load snippets. Please try again later.')
        setSnippets([])
      } finally {
        setLoading(false)
      }
    }

    loadSnippets()
  }, [])

  // Get unique years and tags for filters
  const availableYears = [
    ...new Set(
      snippets
        .map((snippet) =>
          snippet.publish_date
            ? new Date(snippet.publish_date).getFullYear().toString()
            : undefined
        )
        .filter((y): y is string => Boolean(y))
    ),
  ].sort((a, b) => parseInt(b) - parseInt(a))

  const availableTags = [
    ...new Set(
      snippets.flatMap((snippet) =>
        Array.isArray(snippet.tags) ? snippet.tags : []
      )
    ),
  ]
    .filter((tag): tag is string => Boolean(tag))
    .sort()

  // Filter snippets based on search and filters
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      searchTerm === '' ||
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesYear =
      selectedYear === 'all' ||
      (snippet.publish_date &&
        new Date(snippet.publish_date).getFullYear().toString() ===
          selectedYear)

    const matchesTags =
      selectedTag === 'all' ||
      (Array.isArray(snippet.tags) && snippet.tags.includes(selectedTag))

    return matchesSearch && matchesYear && matchesTags
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredSnippets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSnippets = filteredSnippets.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedYear, selectedTag])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document
      .getElementById('snippets-section')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedYear('all')
    setSelectedTag('all')
    setCurrentPage(1)
  }

  return (
    <>
      <HeroSection
        title="Weekly Snippets"
        subtitle="Thought-provoking insights into Freemasonry and personal development"
        backgroundImage="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/thought-provoking_1757586636339_m2yyqy.png"
      />

      <section id="snippets-section" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Masonic Reflections"
            subtitle={`${filteredSnippets.length} thought-provoking insights to guide your Masonic journey`}
            centered
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {/* Filters */}
            <div className="bg-neutral-50 rounded-lg p-6 mb-8 shadow-soft">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Bar */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-primary-600 mb-2"
                  >
                    Search Snippets
                  </label>
                  <div className="relative">
                    <input
                      id="search"
                      type="text"
                      placeholder="Search by title or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    />
                    <Search
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                      size={20}
                    />
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <label
                    htmlFor="year-filter"
                    className="block text-sm font-medium text-primary-600 mb-2"
                  >
                    Year
                  </label>
                  <select
                    id="year-filter"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  >
                    <option value="all">All Years ({snippets.length})</option>
                    {availableYears.map((year) => {
                      const yearCount = snippets.filter(
                        (s) =>
                          s.publish_date &&
                          new Date(s.publish_date)
                            .getFullYear()
                            .toString() === year
                      ).length
                      return (
                        <option key={year} value={year}>
                          {year} ({yearCount})
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Tag Filter */}
                <div>
                  <label
                    htmlFor="tag-filter"
                    className="block text-sm font-medium text-primary-600 mb-2"
                  >
                    Topic
                  </label>
                  <select
                    id="tag-filter"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  >
                    <option value="all">All Topics</option>
                    {availableTags.map((tag) => {
                      const tagCount = snippets.filter(
                        (s) =>
                          Array.isArray(s.tags) && s.tags.includes(tag)
                      ).length
                      return (
                        <option key={tag} value={tag}>
                          {tag} ({tagCount})
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedYear !== 'all' || selectedTag !== 'all') && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Filter size={16} className="text-secondary-500" />
                      <span className="text-neutral-600">Active filters:</span>
                      {searchTerm && (
                        <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded text-xs">
                          Search: "{searchTerm}"
                        </span>
                      )}
                      {selectedYear !== 'all' && (
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                          Year: {selectedYear}
                        </span>
                      )}
                      {selectedTag !== 'all' && (
                        <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                          Topic: {selectedTag}
                        </span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            {loading ? (
              <LoadingSpinner subtle={true} className="py-8" />
            ) : currentSnippets.length > 0 ? (
              <>
                {/* Results Summary */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-neutral-600">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredSnippets.length)} of{' '}
                    {filteredSnippets.length} snippets
                    {totalPages > 1 &&
                      ` (Page ${currentPage} of ${totalPages})`}
                  </p>
                  <div className="text-xs text-neutral-500">
                    {itemsPerPage} per page
                  </div>
                </div>

                {/* Snippets List */}
                <div className="space-y-4">
                  {currentSnippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className="bg-white rounded-lg p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <h3 className="text-lg font-heading font-semibold text-primary-600 mb-2">
                            {snippet.title}
                          </h3>

                          <div className="flex items-center text-sm text-neutral-500 mb-3">
                            <Calendar size={16} className="mr-2" />
                            <span>
                              {snippet.publish_date
                                ? new Date(
                                    snippet.publish_date
                                  ).toLocaleDateString('en-GB')
                                : '—'}
                            </span>
                            <Clock size={16} className="ml-4 mr-2" />
                            <span>~20 second read</span>
                          </div>

                          {/* Content Preview */}
                          <div className="text-neutral-600 mb-4">
                            <div
                              className="line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html:
                                  snippet.content
                                    .replace(/<[^>]*>/g, '')
                                    .substring(0, 150) + '...',
                              }}
                            />
                          </div>

                          {/* Tags */}
                          {snippet.tags && Array.isArray(snippet.tags) && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {snippet.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {snippet.tags.length > 3 && (
                                <span className="text-xs text-neutral-500">
                                  +{snippet.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex-shrink-0">
                          <img
                            src="/LODGE PIC copy copy.png"
                            alt="Radlett Lodge Logo"
                            className="w-10 h-10 object-contain opacity-60"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      </div>

                      {/* Expandable Content */}
                      <details className="group">
                        <summary className="cursor-pointer list-none">
                          <div className="flex items-center justify-center w-full py-3 mt-4 border-t border-neutral-200 text-secondary-600 hover:text-secondary-700 transition-colors">
                            <span className="text-sm font-medium mr-2">
                              Read Full Snippet
                            </span>
                            <ArrowRight
                              size={16}
                              className="group-open:rotate-90 transition-transform duration-200"
                            />
                          </div>
                        </summary>
                        <div className="mt-4 pt-4 border-t border-neutral-100">
                          <div
                            className="prose prose-sm max-w-none text-neutral-700"
                            dangerouslySetInnerHTML={{ __html: snippet.content }}
                          />
                        </div>
                      </details>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between">
                    <div className="text-sm text-neutral-600">
                      Page {currentPage} of {totalPages}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center"
                      >
                        <ChevronLeft size={16} className="mr-1" />
                        Previous
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                              pageNum = i + 1
                            } else if (currentPage <= 3) {
                              pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i
                            } else {
                              pageNum = currentPage - 2 + i
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum ? 'primary' : 'outline'
                                }
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className="w-8 h-8 p-0 text-xs"
                              >
                                {pageNum}
                              </Button>
                            )
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center"
                      >
                        Next
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                {searchTerm || selectedYear !== 'all' || selectedTag !== 'all' ? (
                  <>
                    <Search className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                    <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                      No Snippets Found
                    </h3>
                    <p className="text-neutral-500 max-w-md mx-auto mb-4">
                      No snippets match your current search and filter criteria.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </>
                ) : (
                  <>
                    <img
                      src="/LODGE PIC copy copy.png"
                      alt="Radlett Lodge Logo"
                      className="w-16 h-16 mx-auto mb-4 object-contain opacity-30"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                      No Snippets Available
                    </h3>
                    <p className="text-neutral-500 max-w-md mx-auto">
                      Check back soon for new weekly snippets with
                      thought-provoking insights into Freemasonry.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

            {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <img
              src="/LODGE PIC copy copy.png"
              alt="Radlett Lodge Logo"
              className="w-16 h-16 mx-auto mb-6 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Explore More Content
            </h2>
            <p className="text-xl text-neutral-100 mb-8 max-w-2xl mx-auto">
              Discover our full collection of articles, news, and insights about
              Lodge life and Freemasonry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog">
                <Button variant="primary" size="lg" className="min-w-[160px]">
                  Read Blog Posts
                </Button>
              </Link>
              <Link to="/news">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[160px] border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Latest News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SnippetsPage
