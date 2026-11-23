import { NextRequest, NextResponse } from "next/server";
import { getBlogs, saveBlogs } from "@/lib/cloudStorage";
import defaultBlogs from "@/data/blogs.json";
import { BlogPost } from "@/types/blog";

// GET /api/blog - Fetch all published/draft blogs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let blogs = await getBlogs();

    if (category && category !== "All") {
      blogs = blogs.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      blogs = blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    console.error("Failed to read blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve blog dispatches", blogs: defaultBlogs },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create a new blog post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.excerpt) {
      return NextResponse.json({ error: "Title and excerpt are required" }, { status: 400 });
    }

    const blogs = await getBlogs();

    // Auto-generate slug if not provided
    const baseSlug = body.slug
      ? body.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let count = 1;
    while (blogs.some((b) => b.slug === slug)) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const newPost: BlogPost = {
      id: `dispatch-${Date.now()}`,
      slug,
      title: body.title,
      subtitle: body.subtitle || "",
      excerpt: body.excerpt,
      content: body.content || "",
      coverImage: body.coverImage || "",
      videoUrl: body.videoUrl || "",
      category: body.category || "Architecture",
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(",").map((s: string) => s.trim()) : []),
      author: {
        name: body.author?.name || "Devesh Sharma",
        role: body.author?.role || "Lead Systems Architect & Full-Stack Operative",
        avatar: body.author?.avatar || "https://github.com/imdevesh21.png",
      },
      publishedAt: new Date().toISOString().split("T")[0],
      status: body.status || "published",
      readingTime: body.readingTime || `${Math.max(Math.ceil((body.content || "").split(/\s+/).length / 200), 2)} min read`,
      views: 0,
      likes: 0,
      featured: Boolean(body.featured),
    };

    blogs.unshift(newPost);
    await saveBlogs(blogs);

    return NextResponse.json({ success: true, message: "Blog dispatch published", blog: newPost });
  } catch (error) {
    console.error("Failed to create blog:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}

// PUT /api/blog - Update existing blog post
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Post ID is required for update" }, { status: 400 });
    }

    const blogs = await getBlogs();
    const index = blogs.findIndex((b) => b.id === body.id || b.slug === body.slug);

    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existing = blogs[index];
    const updatedPost: BlogPost = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString().split("T")[0],
      tags: Array.isArray(body.tags) ? body.tags : (typeof body.tags === "string" ? body.tags.split(",").map((s: string) => s.trim()) : existing.tags),
    };

    blogs[index] = updatedPost;
    await saveBlogs(blogs);

    return NextResponse.json({ success: true, message: "Blog dispatch updated", blog: updatedPost });
  } catch (error) {
    console.error("Failed to update blog:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

// DELETE /api/blog - Delete blog post
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID query param" }, { status: 400 });
    }

    const blogs = await getBlogs();
    const filtered = blogs.filter((b) => b.id !== id && b.slug !== id);

    if (filtered.length === blogs.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await saveBlogs(filtered);
    return NextResponse.json({ success: true, message: "Blog dispatch deleted" });
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
