"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Package } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await api<Order[]>("/api/orders/me");
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-maroon-800">My Orders</h1>

      {loading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-20 text-center">
          <Package className="mx-auto h-12 w-12 text-cream-400" />
          <p className="mt-4 text-lg font-semibold text-maroon-800">No orders yet</p>
          <p className="text-sm text-cream-600">Start browsing and place your first order!</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border border-cream-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  {order.items.slice(0, 1).map((item) => (
                    <div key={item.bookId} className="h-14 w-10 overflow-hidden rounded-lg bg-cream-100">
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-cream-500">
                        <Package className="h-5 w-5" />
                      </div>
                    </div>
                  ))}
                  <div>
                    <p className="text-sm font-semibold text-maroon-800">
                      {order.items.map((i) => i.title).join(", ")}
                    </p>
                    <p className="text-xs text-cream-500">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""} &middot;{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-BD")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">&#2547;{order.totalAmount.toLocaleString()}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
