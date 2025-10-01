// src/components/NewsCard.tsx
import React from 'react'
import { Link } from 'react-router-dom'

interface NewsCardProps {
  news: {
    id: string
    title: string
    date: Date
    summary: string
    content: string
    image?: string
    isMembers?: boolean
  }
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      {news.image && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-5 flex flex-col h-full">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-2">{news.title}</h3>

        {/* Date */}
        <p className="text-sm text-gray-500 mb-3">
          {news.date.toLocaleDateString()}
          {news.isMembers && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-600">
              Members Only
            </span>
          )}
        </p>

        {/* Summary */}
        <p className="text-gray-700 flex-grow">{news.summary}</p>

        {/* Read More */}
        <div className="mt-4">
          <Link
            to={`/news/${news.id}`}
            className="inline-block text-secondary-600 hover:text-secondary-800 font-medium"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
