import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TestSupabasePage() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, title, category, publish_date")
      .limit(5)
      .then(({ data, error }: { data: any; error: any }) => {
        setData(data || []);
        setError(error ? error.message : null);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Supabase Blog Posts</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Publish Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.title}</td>
              <td>{row.category}</td>
              <td>{row.publish_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
