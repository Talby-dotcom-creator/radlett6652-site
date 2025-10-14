// __mocks__/supabase.ts
export const supabase = {
  from: () => ({
    select: () => ({
      limit: () =>
        Promise.resolve({
          data: [
            {
              id: 1,
              title: "Test Post",
              category: "General",
              publish_date: "2025-10-01",
            },
            {
              id: 2,
              title: "Another Post",
              category: "News",
              publish_date: "2025-10-02",
            },
          ],
          error: null,
        }),
    }),
  }),
};
