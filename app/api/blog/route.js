import { ConnectDB } from '@/lib/config/db';
import BlogModel from '@/lib/models/BlogModel';
import { writeFile } from 'fs/promises';

const { NextResponse } = require('next/server');

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();


// API Endpoint to get all blogs
export async function GET(req, res) {
  const blogId = req.nextUrl.searchParams.get('id');
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  } else {
    const blogs = await BlogModel.find({});
    return NextResponse.json(blogs);
  }
}


// API Endpoint to upload a blog
export async function POST(req, res) {
  const formData = await req.formData();
  const timestamp = Date.now();
  
  const image = formData.get('image');
  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  const path = `./public/${timestamp}_${image.name}`;

  await writeFile(path, buffer);
  const imgUrl = `/${timestamp}_${image.name}`;

  const blogData = {
    title: `${formData.get('title')}`,
    description: `${formData.get('description')}`,
    category: `${formData.get('category')}`,
    author: `${formData.get('author')}`,
    image: `${imgUrl}`,
    authorImg: `${formData.get('authorImg')}`,
  }

  await BlogModel.create(blogData);

  return NextResponse.json({ success: true, msg: 'Blog Added' });
}
