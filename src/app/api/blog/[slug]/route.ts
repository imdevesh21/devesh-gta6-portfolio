import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import defaultBlogs from "@/data/blogs.json";
import { BlogPost } from "@/types/blog";

const BLOGS_FILE_PATH = path.join(process.cwd(), "src", "data", "blogs.json");

async function readBlogs(): Promise<BlogPost[]> {
  try {
    const fileContent = await fs.readFile(BLOGS_FILE_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch {
    return defaultBlogs as unknown as BlogPost[];
  }
}

async function writeBlogs(blogs: BlogPost[]): Promise<void> {
  await fs.writeFile(BLOGS_FILE_PATH, JSON.stringify(blogs, null, 2), "utf-8");
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const blogs = await readBlogs();
    const post = blogs.find((b) => b.slug === slug || b.id === slug);

    if (!post) {
      return NextResponse.json({ error: "Dispatch not found in Weazel archives" }, { status: 404 });
    }

    // Increment views silently in background
    post.views = (post.views || 0) + 1;
    writeBlogs(blogs).catch(() => {});

    return NextResponse.json({ success: true, blog: post });
  } catch (error) {
    console.error("Error retrieving slug blog:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const { action } = await req.json();

    const blogs = await readBlogs();
    const post = blogs.find((b) => b.slug === slug || b.id === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (action === "like") {
      post.likes = (post.likes || 0) + 1;
      await writeBlogs(blogs);
      return NextResponse.json({ success: true, likes: post.likes });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Action handler error:", error);
    return NextResponse.json({ error: "Failed to process post action" }, { status: 500 });
  }
}
