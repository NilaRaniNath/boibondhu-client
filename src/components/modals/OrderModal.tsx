"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Book } from "@/lib/types";

interface Props {
  book: Book;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderModal({ book, onClose, onSuccess }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"details" | "shipping" | "done">("details");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const total = book.price * quantity;

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      await api("/api/orders", {
        method: "POST",
        json: {
          items: [{ bookId: book._id, quantity }],
          shippingAddress: address,
          paymentMethod,
        },
      });
      toast.success("Order placed successfully!", { description: `Total: ৳${total.toLocaleString()}` });
      setStep("done");
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 px-6 py-4">
          <h2 className="text-lg font-bold text-maroon-800">
            {step === "done" ? "Order Placed!" : "Place Order"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-cream-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "done" ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-semibold text-maroon-800">
              Your order has been placed!
            </p>
            <p className="mt-1 text-sm text-cream-600">
              Total: &#2547;{total.toLocaleString()}
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-maroon-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-maroon-900"
            >
              Continue Shopping
            </button>
          </div>
        ) : step === "details" ? (
          <div className="px-6 py-4">
            <div className="flex gap-4 rounded-xl bg-cream-50 p-4">
              <Image
                src={book.coverImage}
                alt={book.title}
                width={64}
                height={80}
                className="h-20 w-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold text-maroon-800">{book.title}</p>
                <p className="text-sm text-cream-600">{book.author}</p>
                <p className="mt-1 font-bold text-green-600">&#2547;{book.price}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-cream-700">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-cream-300 hover:bg-cream-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-cream-300 hover:bg-cream-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-cream-200 pt-4">
              <span className="font-semibold text-maroon-800">Total</span>
              <span className="text-xl font-bold text-green-600">
                &#2547;{total.toLocaleString()}
              </span>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>
            )}

            <button
              onClick={() => setStep("shipping")}
              className="mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Continue to Shipping
            </button>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-3">
            <input
              placeholder="Street address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-full rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
              <input
                placeholder="State / Division"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Zip Code"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                className="rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="rounded-lg border border-cream-300 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="card">Credit Card</option>
              </select>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("details")}
                className="rounded-xl border border-cream-300 px-4 py-2.5 text-sm font-medium text-cream-700 hover:bg-cream-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Placing Order..." : `Pay &#2547;${total.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
