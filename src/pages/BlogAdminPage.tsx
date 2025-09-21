import React, { useState, useEffect } from "react"
import { optimizedApi } from "../lib/optimizedApi"
import BlogForm, { BlogFormValues } from "../components/cms/BlogForm"
import Button from "../components/Button"
import { supabase } from "../lib/supabase"
import { CMSBlogPost } from "../types"

const BlogAdminPage: React.FC = () => {
  const [posts, setPosts] = useState<CMSBlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<CMSBlogPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const data = await optimizedApi.getBlogPosts()
        setPosts(data)
      } catch (err) {
        console.error("Error loading blog posts:", err)
        setError("Failed to load posts")
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  const handleSave = async (values: BlogFormValues) => {
    try {
      setLoading(true)
      setError(null)

      if (selectedPost) {
        // Update
        const { error } = await supabase
          .from("blog_posts")
          .update(values)
          .eq("id", selectedPost.id)

        if (error) throw error
      } else {
        // Create
        const { error } = await supabase.from("blog_posts").insert(values)
        if (error) throw error
      }

      // Refresh list
      const data = await optimizedApi.getBlogPosts()
      setPosts(data)
      setSelectedPost(null)
    } catch (err: any) {
      console.error("Error saving blog post:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.from("blog_posts").delete().eq("id", postId)
      if (error) throw error

      // Refresh list
      const data = await optimizedApi.getBlogPosts()
      setPosts(data)

      // Reset selection if deleted post was being edited
      if (selectedPost?.id === postId) {
        setSelectedPost(null)
      }
    } catch (err: any) {
      console.error("Error deleting blog post:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post: CMSBlogPost) => {
    setSelectedPost(post)
  }

  const handleNew = () => {
    setSelectedPost(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Blog Admin</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Form for create/edit */}
      <div className="mb-8">
        <BlogForm
          initialValues={
            selectedPost
              ? { ...selectedPost, summary: selectedPost.summary ?? "" }
              : undefined
          }
          onSubmit={handleSave}
        />
      </div>

      {/* Posts list */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Existing Posts</h2>
          <Button onClick={handleNew}>New Post</Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : posts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li
                key={post.id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-gray-500">{post.category}</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(post)}>Edit</Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No posts found.</p>
        )}
      </div>
    </div>
  )
}

export default BlogAdminPage
