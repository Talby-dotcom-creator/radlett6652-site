import "dotenv/config";
import { cmsApi } from "./lib/cmsApi";
import { Event, CMSBlogPost } from "./types";

// Test getEvents()
async function testGetEvents() {
  const events = await cmsApi.getEvents();
  // Type assertion: events should be Event[]
  events.forEach((event: Event) => {
    console.log("Event:", event.id, event.title, event.event_date);
  });
}

// Test createBlogPost() (creates a real post!)
async function testCreateBlogPost() {
  const newPost = {
    title: "Test Post",
    category: "General",
    content: "This is a test post.",
    author: "Admin",
    image_url: null,
    featured: false,
    publish_date: new Date().toISOString(),
    is_published: true,
    is_members_only: false,
    summary: "A summary for the test post.",
    view_count: 0,
  };
  const post = await cmsApi.createBlogPost({
    ...newPost,
    category: "news", // or "blog" or "snippet" as needed
  });
  if (post) {
    console.log("BlogPost:", post.id, post.title, post.publish_date);
  } else {
    console.error("BlogPost creation failed.");
  }
}

// Run tests
(async () => {
  await testGetEvents();
  await testCreateBlogPost();
})();
