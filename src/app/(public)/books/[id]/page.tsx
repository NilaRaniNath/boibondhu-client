"use client";

import { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, BookOpen, ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import BookCard from "@/components/books/BookCard";
import OrderModal from "@/components/modals/OrderModal";
import type { Book, Review } from "@/lib/types";

const conditionLabel: Record<string, string> = {
  new: "Brand New",
  like_new: "Like New",
  used: "Pre-owned",
};

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrder, setShowOrder] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const bookData = await api<Book>(`/api/books/${id}`);
      setBook(bookData);

      const [reviewsData, relatedData] = await Promise.all([
        api<Review[]>(`/api/reviews/${id}`).catch(() => []),
        api<{ books: Book[] }>(
          `/api/books?category=${encodeURIComponent(bookData.category)}&limit=4`
        ).catch(() => ({ books: [] })),
      ]);
      setReviews(reviewsData);
      setRelated(relatedData.books.filter((b: Book) => b._id !== id).slice(0, 4));
    } catch {
      router.push("/explore");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const bookData = await api<Book>(`/api/books/${id}`);
        if (cancelled) return;
        setBook(bookData);

        const [reviewsData, relatedData] = await Promise.all([
          api<Review[]>(`/api/reviews/${id}`).catch(() => []),
          api<{ books: Book[] }>(
            `/api/books?category=${encodeURIComponent(bookData.category)}&limit=4`
          ).catch(() => ({ books: [] })),
        ]);
        if (cancelled) return;
        setReviews(reviewsData);
        setRelated(relatedData.books.filter((b: Book) => b._id !== id).slice(0, 4));
      } catch {
        if (!cancelled) router.push("/explore");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, router]);

  function handleBuyNow() {
    if (!user) {
      router.push(`/login?redirect=/books/${id}`);
      return;
    }
    setShowOrder(true);
  }

  if (loading || !book) {
    return (
      <div className="min-h-screen bg-cream-200 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon-800 border-t-transparent" />
      </div>
    );
  }

  const images = [book.coverImage];

  return (
    <div className="bg-cream-200 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-1 text-sm text-cream-600 hover:text-maroon-800">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2 animate-fade-in-up">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-cream-300 bg-white">
              <Image
                src={images[selectedImg]}
                alt={book.title}
                width={400}
                height={533}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`h-16 w-12 overflow-hidden rounded-lg border-2 ${
                      selectedImg === i ? "border-green-500" : "border-cream-300"
                    }`}
                  >
                    <Image src={img} alt="" width={48} height={64} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              {book.category}
            </span>
            <h1 className="mt-3 text-2xl font-bold text-maroon-800 sm:text-3xl">{book.title}</h1>
            <p className="mt-1 text-cream-600">by {book.author}</p>

            <div className="mt-4 flex items-center gap-3">
              {book.rating > 0 && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(book.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-cream-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-cream-600">
                    {book.rating.toFixed(1)} ({book.numReviews} reviews)
                  </span>
                </div>
              )}
            </div>

            <p className="mt-4 text-3xl font-bold text-green-600">&#2547;{book.price.toLocaleString()}</p>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className={`font-medium ${book.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
              </span>
              <span className="text-cream-400">|</span>
              <span className="text-cream-600">{conditionLabel[book.condition] || book.condition}</span>
            </div>

            <p className="mt-5 leading-relaxed text-cream-700">{book.description}</p>

            {/* Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-white border border-cream-200 p-4">
              {[
                ["ISBN", book.isbn],
                ["Pages", String(book.pages)],
                ["Language", book.language],
                ["Year", String(book.publishedYear)],
                ["Sold", `${book.totalSold} copies`],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-cream-500">{label}</p>
                  <p className="text-sm font-medium text-maroon-800">{val}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleBuyNow}
                disabled={book.stock <= 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy Now
              </button>
              <Link
                href="/explore"
                className="flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-6 py-3 text-sm font-medium text-cream-700 hover:bg-cream-50"
              >
                <BookOpen className="h-4 w-4" />
                Browse More
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12 animate-fade-in-up">
          <h2 className="text-xl font-bold text-maroon-800">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-cream-600">No reviews yet for this book.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="rounded-xl border border-cream-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-800 text-sm font-bold text-cream-100">
                      {r.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-maroon-800">{r.user.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-cream-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-cream-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-cream-700">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 animate-fade-in-up">
            <h2 className="text-xl font-bold text-maroon-800">Related Books</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((b, i) => (
                <div key={b._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <BookCard book={b} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {showOrder && book && (
        <OrderModal
          book={book}
          onClose={() => setShowOrder(false)}
          onSuccess={() => { setShowOrder(false); refreshData(); }}
        />
      )}
    </div>
  );
}
