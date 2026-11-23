import fs from "fs/promises";
import path from "path";
import defaultBlogs from "@/data/blogs.json";
import defaultPortfolio from "@/data/portfolioData.json";
import { BlogPost } from "@/types/blog";
import { PortfolioData } from "@/types/portfolio";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis or Vercel KV environment variables are present
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let redisClient: Redis | null = null;
if (redisUrl && redisToken) {
  try {
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  } catch (err) {
    console.warn("Could not initialize Redis client, using filesystem fallback:", err);
  }
}

// In-Memory Runtime Caches (Used when deployed on serverless with read-only filesystem)
let memBlogs: BlogPost[] | null = null;
let memPortfolio: PortfolioData | null = null;

const BLOGS_FILE_PATH = path.join(process.cwd(), "src", "data", "blogs.json");
const TMP_BLOGS_PATH = path.join("/tmp", "blogs.json");

const PORTFOLIO_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolioData.json");
const TMP_PORTFOLIO_PATH = path.join("/tmp", "portfolioData.json");

/* =========================================================================
   1. BLOG STORAGE ENGINE
   ========================================================================= */

export async function getBlogs(): Promise<BlogPost[]> {
  // 1. Try Redis if connected
  if (redisClient) {
    try {
      const data = await redisClient.get<BlogPost[]>("leonida_blogs");
      if (data && Array.isArray(data) && data.length > 0) {
        return data;
      }
      // If Redis is empty on first boot, seed it with defaultBlogs
      await redisClient.set("leonida_blogs", defaultBlogs);
      return defaultBlogs as unknown as BlogPost[];
    } catch (err) {
      console.warn("Redis get error, falling back to local files:", err);
    }
  }

  // 2. Try in-memory cache
  if (memBlogs) {
    return memBlogs;
  }

  // 3. Try /tmp file (Vercel serverless writable layer)
  try {
    const tmpContent = await fs.readFile(TMP_BLOGS_PATH, "utf-8");
    const parsed = JSON.parse(tmpContent);
    if (Array.isArray(parsed)) {
      memBlogs = parsed;
      return parsed;
    }
  } catch {
    // /tmp does not exist yet, continue
  }

  // 4. Try src/data/blogs.json file
  try {
    const fileContent = await fs.readFile(BLOGS_FILE_PATH, "utf-8");
    const parsed = JSON.parse(fileContent);
    memBlogs = parsed;
    return parsed;
  } catch {
    memBlogs = defaultBlogs as unknown as BlogPost[];
    return defaultBlogs as unknown as BlogPost[];
  }
}

export async function saveBlogs(blogs: BlogPost[]): Promise<{ success: boolean; storage: string }> {
  memBlogs = blogs;

  // 1. Save to Redis if available
  if (redisClient) {
    try {
      await redisClient.set("leonida_blogs", blogs);
      return { success: true, storage: "upstash_redis" };
    } catch (err) {
      console.warn("Redis set error, falling back to local filesystem:", err);
    }
  }

  // 2. Try saving to src/data/blogs.json (Local Dev environment)
  try {
    await fs.writeFile(BLOGS_FILE_PATH, JSON.stringify(blogs, null, 2), "utf-8");
    return { success: true, storage: "local_disk" };
  } catch (fsErr: unknown) {
    // 3. Handle EROFS (Read-only filesystem on Vercel)
    const errCode = (fsErr as { code?: string })?.code;
    if (errCode === "EROFS" || errCode === "ENOENT") {
      try {
        await fs.writeFile(TMP_BLOGS_PATH, JSON.stringify(blogs, null, 2), "utf-8");
        return { success: true, storage: "serverless_tmp" };
      } catch (tmpErr) {
        console.warn("Could not write to /tmp, keeping in memory:", tmpErr);
        return { success: true, storage: "in_memory" };
      }
    }
    throw fsErr;
  }
}

/* =========================================================================
   2. PORTFOLIO DATA STORAGE ENGINE
   ========================================================================= */

export async function getPortfolioData(): Promise<PortfolioData> {
  if (redisClient) {
    try {
      const data = await redisClient.get<PortfolioData>("leonida_portfolio");
      if (data && data.profile) {
        return data;
      }
      await redisClient.set("leonida_portfolio", defaultPortfolio);
      return defaultPortfolio as unknown as PortfolioData;
    } catch (err) {
      console.warn("Redis get portfolio error:", err);
    }
  }

  if (memPortfolio) return memPortfolio;

  try {
    const tmpContent = await fs.readFile(TMP_PORTFOLIO_PATH, "utf-8");
    const parsed = JSON.parse(tmpContent);
    if (parsed && parsed.profile) {
      memPortfolio = parsed;
      return parsed;
    }
  } catch {}

  try {
    const fileContent = await fs.readFile(PORTFOLIO_FILE_PATH, "utf-8");
    const parsed = JSON.parse(fileContent);
    memPortfolio = parsed;
    return parsed;
  } catch {
    memPortfolio = defaultPortfolio as unknown as PortfolioData;
    return defaultPortfolio as unknown as PortfolioData;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<{ success: boolean; storage: string }> {
  memPortfolio = data;

  if (redisClient) {
    try {
      await redisClient.set("leonida_portfolio", data);
      return { success: true, storage: "upstash_redis" };
    } catch (err) {
      console.warn("Redis set portfolio error:", err);
    }
  }

  try {
    await fs.writeFile(PORTFOLIO_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return { success: true, storage: "local_disk" };
  } catch (fsErr: unknown) {
    const errCode = (fsErr as { code?: string })?.code;
    if (errCode === "EROFS" || errCode === "ENOENT") {
      try {
        await fs.writeFile(TMP_PORTFOLIO_PATH, JSON.stringify(data, null, 2), "utf-8");
        return { success: true, storage: "serverless_tmp" };
      } catch {
        return { success: true, storage: "in_memory" };
      }
    }
    throw fsErr;
  }
}

export function isCloudRedisConfigured(): boolean {
  return Boolean(redisClient);
}
