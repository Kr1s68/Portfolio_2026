// Blog post data structure:
// const blogPosts: {
//     id: string;
//     title: string;
//     author: string;
//     date: string;
//     tags: string[];
//     excerpt: string;
//     subposts: {
//         id: string;
//         title: string;
//         readTime: string;
//     }[];
// }[]

export const blogPosts = [
  {
    id: "2025-a-year-full-of-lessons-blog",
    title: "2025: A Year Full of Lessons",
    author: "Kristiyan Boyanov",
    date: "2026-02-18",
    tags: ["personal", "reflections"],
    excerpt:
      "This year has been me trying to learn as many hard lessons as possible, having zero intention to do so.",
    subposts: [
      { id: "introduction", title: "Introduction", readTime: "7 min" },
      {
        id: "lesson-1-you're-worth-loving",
        title: "Lesson 1: You're Worth Loving",
        readTime: "5 min",
      },
    ],
  },
];
