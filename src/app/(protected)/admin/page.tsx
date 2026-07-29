"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DollarSign, ShoppingCart, BookOpen, Users, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { AdminStats, AdminUser, Order, OrderStatus } from "@/lib/types";

const PIE_COLORS = ["#8B4513", "#2D5F3E", "#D4B38D", "#b92c2c", "#4eb36e", "#A67D55", "#6b340f"];

const statusOptions: OrderStatus[] = ["pending", "confirmed", "delivered", "cancelled"];
const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/");
  }, [user, router]);

  useEffect(() => {
    async function load() {
      try {
        const [s, u, o] = await Promise.all([
          api<AdminStats>("/api/admin/stats"),
          api<AdminUser[]>("/api/admin/users"),
          api<Order[]>("/api/orders"),
        ]);
        setStats(s);
        setUsers(u);
        setOrders(o);
      } catch { /* empty */ } finally { setLoading(false); }
    }
    load();
  }, []);

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      await api(`/api/orders/${orderId}/status`, { method: "PATCH", json: { status } });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
      toast.success(`Order status updated to ${status}`);
    } catch { toast.error("Failed to update status"); }
  }

  if (!user || user.role !== "admin") return null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon-800 border-t-transparent" />
      </div>
    );
  }

  const statCards = stats
      ? [
        { label: "Total Revenue", value: stats.totalRevenue, prefix: true, icon: DollarSign, color: "bg-green-600" },
        { label: "Total Orders", value: stats.totalOrders, prefix: false, icon: ShoppingCart, color: "bg-blue-600" },
        { label: "Total Books", value: stats.totalBooks, prefix: false, icon: BookOpen, color: "bg-maroon-800" },
        { label: "Total Users", value: stats.totalUsers, prefix: false, icon: Users, color: "bg-purple-600" },
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-maroon-800">Admin Dashboard</h1>
        <Link href="/explore" className="flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-4 py-2 text-sm font-medium text-cream-700 hover:bg-cream-50">
          <ExternalLink className="h-4 w-4" /> Browse Books
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-cream-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color} text-white`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-cream-500">{s.label}</p>
                <p className="text-lg font-bold text-maroon-800">
                  {s.prefix && <span>&#2547;</span>}{typeof s.value === "number" ? s.value.toLocaleString() : s.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Monthly Sales */}
        {stats && stats.monthlySales.length > 0 && (
          <div className="rounded-xl border border-cream-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-maroon-800">Monthly Sales Trend</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDD5BB" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" name="Revenue (&#2547;)" fill="#8B4513" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" name="Orders" fill="#2D5F3E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Pie */}
        {stats && stats.categoryDistribution.length > 0 && (
          <div className="rounded-xl border border-cream-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-maroon-800">Category Distribution</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats.categoryDistribution.map((c) => ({ name: c._id, value: c.count }))}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={3} dataKey="value"
                >
                  {stats.categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="mt-8 rounded-xl border border-cream-200 bg-white">
        <div className="border-b border-cream-200 px-5 py-4">
          <h2 className="font-semibold text-maroon-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-50">
              <tr>
                <th className="px-5 py-3 font-medium text-cream-600">Order ID</th>
                <th className="px-5 py-3 font-medium text-cream-600">Customer</th>
                <th className="px-5 py-3 font-medium text-cream-600">Items</th>
                <th className="px-5 py-3 font-medium text-cream-600">Total</th>
                <th className="px-5 py-3 font-medium text-cream-600">Date</th>
                <th className="px-5 py-3 font-medium text-cream-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 20).map((order) => (
                <tr key={order._id} className="border-b border-cream-100 hover:bg-cream-50">
                  <td className="px-5 py-3 font-mono text-xs text-cream-600">
                    {order._id.slice(0, 8)}...
                  </td>
                  <td className="px-5 py-3 text-maroon-800">
                    {order.user?.name || "N/A"}
                  </td>
                  <td className="px-5 py-3 text-cream-600">{order.items.length}</td>
                  <td className="px-5 py-3 font-medium text-green-600">
                    &#2547;{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-cream-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value as OrderStatus)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status]} border-0 focus:outline-none focus:ring-2 focus:ring-green-500/30`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-8 rounded-xl border border-cream-200 bg-white">
        <div className="border-b border-cream-200 px-5 py-4">
          <h2 className="font-semibold text-maroon-800">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-50">
              <tr>
                <th className="px-5 py-3 font-medium text-cream-600">Name</th>
                <th className="px-5 py-3 font-medium text-cream-600">Email</th>
                <th className="px-5 py-3 font-medium text-cream-600">Role</th>
                <th className="px-5 py-3 font-medium text-cream-600">Orders</th>
                <th className="px-5 py-3 font-medium text-cream-600">Spent</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-cream-100 hover:bg-cream-50">
                  <td className="px-5 py-3 font-medium text-maroon-800">{u.name}</td>
                  <td className="px-5 py-3 text-cream-600">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.role === "admin" ? "bg-maroon-100 text-maroon-800" : "bg-cream-100 text-cream-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-cream-600">{u.totalOrders}</td>
                  <td className="px-5 py-3 font-medium text-green-600">
                    &#2547;{(u.totalSpent || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
