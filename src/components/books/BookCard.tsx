"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Book } from "@/lib/types";

const conditionBadge: Record<string, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-green-100 text-green-700" },
  like_new: { label: "Like New", cls: "bg-blue-100 text-blue-700" },
  used: { label: "Used", cls: "bg-yellow-100 text-yellow-700" },
};

export default function BookCard({ book }: { book: Book }) {
  const badge = conditionBadge[book.condition] || conditionBadge.new;

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition-shadow duration-300 hover:border-green-300 hover:shadow-lg"
    >
      <Link
        href={`/books/${book._id}`}
        className="flex flex-1 flex-col"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
          <motion.img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}
          >
            {badge.label}
          </span>
          {book.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold text-maroon-800 line-clamp-1">
            {book.title}
          </h3>
          <p className="mt-0.5 text-sm text-cream-600">{book.author}</p>

          <div className="mt-2 flex items-center gap-2">
            {book.rating > 0 && (
              <span className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="h-3.5 w-3.5 fill-yellow-400" />
                {book.rating.toFixed(1)}
                <span className="text-cream-500">({book.numReviews})</span>
              </span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between pt-3">
            <span className="text-xl font-bold text-green-600">
              &#2547;{book.price}
            </span>
            <span
              className={`text-xs font-medium ${
                book.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {book.stock > 0 ? `${book.stock} in stock` : "Unavailable"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
