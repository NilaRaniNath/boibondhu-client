"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import { BookPlus, Upload, Image, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Academic", "Novel", "Comics", "QuestionBank", "Bengali Classic", "Fantasy", "Non-Fiction", "Self-Help", "Poetry", "Classic Fiction", "Others"];

async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) throw new Error("ImgBB API key is not configured");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "ImgBB upload failed");

  return json.data.url as string;
}

export default function AddBookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [form, setForm] = useState({
    title: "", author: "", description: "", price: "",
    coverImage: "", category: "Novel", condition: "new" as "new" | "like_new" | "used",
    stock: "", isbn: "", pages: "", language: "English", publishedYear: "",
  });

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/");
  }, [user, router]);

  function handleImageUrlSubmit() {
    const url = imageUrlInput.trim();
    if (!url) return;
    setImagePreview(url);
    setForm((prev) => ({ ...prev, coverImage: url }));
    setImageUrlInput("");
    toast.success("Image URL set successfully");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setImageUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setImagePreview(url);
      setForm((prev) => ({ ...prev, coverImage: url }));
      toast.success("Image uploaded to ImgBB");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(msg);
      setImagePreview("");
      setForm((prev) => ({ ...prev, coverImage: "" }));
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function clearImage() {
    setImagePreview("");
    setForm((prev) => ({ ...prev, coverImage: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!form.coverImage) {
        throw new Error("Please upload or provide a cover image URL");
      }

      const payload = {
        title: form.title,
        author: form.author,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        pages: Number(form.pages),
        publishedYear: Number(form.publishedYear),
        images: [form.coverImage],
        category: form.category,
        condition: form.condition,
        isbn: form.isbn || undefined,
        language: form.language,
      };

      console.log("Submitting book payload:", payload);

      const book = await api<{ _id: string }>("/api/books", {
        method: "POST", json: payload,
      });
      toast.success("Book added to catalog!");
      router.push(`/books/${book._id}`);
    } catch (err: unknown) {
      console.error("Add book error:", err);
      let msg = "Failed to add book";
      if (err instanceof ApiError) {
        msg = err.message;
        if (err.errors) {
          const details = Object.entries(err.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join(" | ");
          console.error("Validation details:", details);
          msg += ` (${details})`;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <BookPlus className="h-7 w-7 text-maroon-800" />
        <h1 className="text-2xl font-bold text-maroon-800">Add New Book</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-cream-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" value={form.title} onChange={(v) => update("title", v)} required />
          <Field label="Author" value={form.author} onChange={(v) => update("author", v)} required />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-cream-600">Description</label>
          <textarea
            rows={4} required value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Price (BDT)" type="number" value={form.price} onChange={(v) => update("price", v)} required />
          <Field label="Stock" type="number" value={form.stock} onChange={(v) => update("stock", v)} required />
          <Field label="Pages" type="number" value={form.pages} onChange={(v) => update("pages", v)} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-cream-600">Category</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-cream-600">Condition</label>
            <select value={form.condition} onChange={(e) => update("condition", e.target.value)}
              className="w-full rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none">
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="used">Used</option>
            </select>
          </div>
          <Field label="Published Year" type="number" value={form.publishedYear} onChange={(v) => update("publishedYear", Number(v))} min={1000} required />
        </div>

        {/* Cover Image */}
        <div>
          <label className="mb-1 block text-xs font-medium text-cream-600">Cover Image</label>

          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Cover preview"
                className="h-48 w-36 rounded-lg border border-cream-300 object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="mt-1 text-xs text-cream-500">Image will be submitted as-is</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* URL Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-400" />
                  <input
                    type="url"
                    placeholder="Paste image URL..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleImageUrlSubmit())}
                    className="w-full rounded-lg border border-cream-300 py-2.5 pl-9 pr-3 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageUrlSubmit}
                  disabled={!imageUrlInput.trim() || imageUploading}
                  className="shrink-0 rounded-lg border border-cream-300 px-4 py-2.5 text-sm font-medium text-cream-700 hover:bg-cream-50 disabled:opacity-50"
                >
                  Use URL
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-cream-300" />
                <span className="text-xs text-cream-500">or upload a file</span>
                <div className="h-px flex-1 bg-cream-300" />
              </div>

              {/* File Upload */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="cover-upload"
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-cream-400 px-4 py-3 text-sm text-cream-600 hover:border-green-500 hover:bg-green-50 hover:text-green-700 ${
                    imageUploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {imageUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {imageUploading ? "Uploading to ImgBB..." : "Choose image (max 5MB)"}
                </label>
                <input
                  ref={fileInputRef}
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={imageUploading}
                  className="hidden"
                />
                {imageUploading && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Uploading to ImgBB...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ISBN (optional)" value={form.isbn} onChange={(v) => update("isbn", v)} />
          <Field label="Language" value={form.language} onChange={(v) => update("language", v)} required />
        </div>

        {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || imageUploading}
          className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required = false }: {
  label: string; type?: string; value: string | number;
  onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-cream-600">{label}</label>
      <input type={type} required value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
    </div>
  );
}
