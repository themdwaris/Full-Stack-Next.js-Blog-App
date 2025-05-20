import dbConnect from "@/config/db/dbConnect";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import BlogModel from "@/models/blogModel";
import { getUserFromToken } from "@/helpers/getUserFromToken";

//To get all blogs
export async function GET(req) {
  await dbConnect();
  try {
    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ message: "Unauthorized", success: false });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const allBlogs = await BlogModel.find({})
      .populate("author", "name email")
      .sort({ createdAt: -1 }).skip(skip).limit(limit)
    const blogsAddedByYou = await BlogModel.find({ author: user?._id }).sort({
      createdAt: -1,
    });
    const totalBlogs = await BlogModel.countDocuments()

    return NextResponse.json({ allBlogs, blogsAddedByYou,currentPage:page,totalPages: Math.ceil(totalBlogs / limit), success: true });
  } catch (error) {
    return NextResponse.json({
      message: error.message || error,
      success: false,
    });
  }
}

//To add blog
export async function POST(req) {
  await dbConnect();
  try {
    const user = await getUserFromToken(req);
    const formData = await req.formData();
    const timeStapm = Date.now();

    const image = formData.get("image");
    const imageBtyeData = await image?.arrayBuffer();
    const buffer = Buffer?.from(imageBtyeData);
    const path = `./public/${timeStapm}_${image.name}`;
    await fs.writeFile(path, buffer);
    const imageUrl = `/${timeStapm}_${image.name}`;

    const blogData = {
      title: `${formData.get("title")}`,
      description: `${formData.get("description")}`,
      category: `${formData.get("category")}`,
      authorImage: `${formData.get("authorImage")}`,
      author: `${user?._id}`,
      image: `${imageUrl}`,
    };

    await BlogModel.create(blogData);

    return NextResponse.json({
      message: "Blog added successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message || error,
      success: false,
    });
  }
}

// To Update blog
export async function PUT(req) {
  await dbConnect();
  try {
    const formData = await req.formData();
    const timeStapm = Date.now();
    const editId = formData.get("editId");
    const image = formData.get("image");

    const isImageUploaded =
      image && typeof image === "object" && image.size > 0;
    let imageUrl = formData.get("oldImage");

    if (isImageUploaded) {
      const imageBtyeData = await image?.arrayBuffer();
      const buffer = Buffer?.from(imageBtyeData);
      const path = `./public/${timeStapm}_${image.name}`;
      await fs.writeFile(path, buffer);
      imageUrl = `/${timeStapm}_${image.name}`;
    }

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      authorImage: formData.get("authorImage"),
      image: imageUrl,
    };

    const blog = await BlogModel.findByIdAndUpdate(editId, blogData);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found", success: false });
    }

    return NextResponse.json({
      message: "Blog updated successfully!",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || error,
      success: false,
    });
  }
}

// To delete blog
export async function DELETE(req) {
  await dbConnect();
  try {
    const { userId } = await req?.json();
    const deletedBlog = await BlogModel.findByIdAndDelete(userId);
    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found", success: false });
    }
    return NextResponse.json({
      message: "Blog deleted successfully!",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error?.message || error,
      success: false,
    });
  }
}
