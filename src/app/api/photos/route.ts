import { NextRequest, NextResponse } from "next/server";
import { getPhotos, savePhotos } from "@/lib/cloudStorage";
import defaultPhotos from "@/data/photos.json";
import { PhotoItem } from "@/types/photo";

// GET /api/photos - Fetch all Pinterest gallery photos (optional ?category= filter)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let photos = await getPhotos();

    if (category && category !== "All") {
      photos = photos.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({ success: true, count: photos.length, photos });
  } catch (error) {
    console.error("Failed to load photos:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load photo gallery", photos: defaultPhotos },
      { status: 500 }
    );
  }
}

// POST /api/photos - Pin a new photo to the Photoholic board
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.imageUrl || !body.title) {
      return NextResponse.json(
        { error: "Image URL and title are required" },
        { status: 400 }
      );
    }

    const photos = await getPhotos();

    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      title: body.title,
      caption: body.caption || "",
      imageUrl: body.imageUrl,
      category: body.category || "Street",
      location: body.location || "Leonida",
      camera: body.camera || "",
      aspectRatio: body.aspectRatio || "portrait",
      likes: 0,
      featured: Boolean(body.featured),
      createdAt: new Date().toISOString().split("T")[0],
    };

    photos.unshift(newPhoto);
    const result = await savePhotos(photos);

    return NextResponse.json({
      success: true,
      photo: newPhoto,
      storage: result.storage,
    });
  } catch (error) {
    console.error("Failed to create photo:", error);
    return NextResponse.json(
      { error: "Failed to pin photo to board" },
      { status: 500 }
    );
  }
}

// PUT /api/photos - Update photo metadata or toggle/increment likes
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
    }

    const photos = await getPhotos();
    const idx = photos.findIndex((p) => p.id === body.id);

    if (idx === -1) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    if (body.action === "like") {
      photos[idx] = { ...photos[idx], likes: (photos[idx].likes || 0) + 1 };
    } else {
      photos[idx] = {
        ...photos[idx],
        title: body.title ?? photos[idx].title,
        caption: body.caption ?? photos[idx].caption,
        imageUrl: body.imageUrl ?? photos[idx].imageUrl,
        category: body.category ?? photos[idx].category,
        location: body.location ?? photos[idx].location,
        camera: body.camera ?? photos[idx].camera,
        aspectRatio: body.aspectRatio ?? photos[idx].aspectRatio,
        featured: body.featured ?? photos[idx].featured,
      };
    }

    await savePhotos(photos);
    return NextResponse.json({ success: true, photo: photos[idx] });
  } catch (error) {
    console.error("Failed to update photo:", error);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}

// DELETE /api/photos?id=... - Remove photo from board
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
    }

    const photos = await getPhotos();
    const filtered = photos.filter((p) => p.id !== id);

    if (filtered.length === photos.length) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    await savePhotos(filtered);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Failed to delete photo:", error);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
