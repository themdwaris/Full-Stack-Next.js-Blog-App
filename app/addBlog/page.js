"use client";

import Loader from "@/components/Loader";
import NavButton from "@/components/NavButton";
import { useBlogContext } from "@/context/BlogContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFileUpload } from "react-icons/fa";

const AddBlogForm = () => {
  const {
    title,
    description,
    category,
    image,
    setTitle,
    setDescription,
    setCategory,
    setImage,
    editId,
    setEditId,
    getAllBlogs,
  } = useBlogContext();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (image) {
      setPreview(image);
    }
    
  }, [image, preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };
  const handleAddForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("editId", editId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("oldImage", image);
    image && formData.append("image", image);

    if (editId) {
      try {
        setLoading(true);
        const res = await axios.put("/api/blogs", formData);
        if (res?.data?.success) {
          toast.success(res.data.message);
          getAllBlogs();
          setEditId("")
          setTitle("");
          setDescription("");
          setCategory("");
          setPreview(null);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(res?.data?.message);
        }
      } catch (error) {
        setLoading(false);
        console.log("Failed to update blog::", error);
      }
    } else {
      try {
        setLoading(true);
        const res = await axios.post("/api/blogs", formData);
        if (res?.data?.success) {
          toast.success(res.data.message);
          setLoading(false);
          getAllBlogs()
          setTitle("");
          setDescription("");
          setCategory("");
          setPreview(null);
        } else {
          toast.error(res?.data?.message || "Error at addBlog at line:47");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log("Failed to add blog::", error);
      }
    }
  };
 

  return (
    <div className="w-full p-5">
      <div className="w-full max-w-6xl mx-auto mb-4 md:mb-10">
        <h1 className="text-2xl font-semibold mt-3 mb-8 md:my-8 bg-gradient-to-r from-slate-200 to-slate-500 inline-block text-transparent bg-clip-text">
          Add your interesting blogs.
        </h1>
        <NavButton />
        <div className="w-full bg-white/10 p-5 md:pl-10 rounded">
          <form
            onSubmit={handleAddForm}
            className="w-full flex flex-col gap-6"
          >
            <div>
              <p className="font-semibold mb-2">Upload blog thumbnail</p>
              <label
                htmlFor="image"
                className="inline-block w-20 h-20 relative rounded"
              >
                <input
                  type="file"
                  name="oldImage"
                  id="image"
                  hidden
                  onChange={handleImageChange}
                />
                {preview ? (
                  <img
                    src={
                      typeof image === "object"
                        ? URL.createObjectURL(image)
                        : preview
                    }
                    alt="upload-icon"
                    className="rounded w-20 h-20 object-contain cursor-pointer transition transform active:scale-90 absolute"
                  />
                ) : (
                  <span className="bg-black text-slate-200 flex items-center justify-center w-16 h-16 rounded-full absolute cursor-pointer transition transform active:scale-90">
                    <FaFileUpload size={30} />
                  </span>
                )}
              </label>
            </div>
            <div>
              <p className="font-semibold mb-2">Blog Title</p>
              <input
                type="text"
                name="title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog Title"
                className="w-full max-w-2xl p-3 rounded border-none outline-slate-200 bg-black "
              />
            </div>
            <div>
              <p className="font-semibold mb-2">Blog Description</p>
              <textarea
                placeholder="Write content here / use HTML tags for formatting"
                name="description"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded border-none outline-slate-200 bg-black "
                rows={8}
              />
            </div>
            <div>
              <p className="font-semibold mb-2">Blog Category</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="px-3 py-2 rounded border-none outline-slate-200 bg-black"
              >
                <option hidden>Select</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Startup">Startup</option>
              </select>
            </div>
            <button
              type="submit"
              className="my-5 px-3 py-2 w-40 flex items-center justify-center gap-3 cursor-pointer rounded bg-slate-200 text-base font-semibold text-black transition transform active:scale-90 hover:bg-slate-300"
            >
              <span>{editId ? "Update Blog" : "Add Blog"}</span>
              {loading && <Loader />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlogForm;
