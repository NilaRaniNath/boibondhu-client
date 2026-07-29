export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage: string;
  category: string;
  condition: "new" | "like_new" | "used";
  stock: number;
  totalSold: number;
  rating: number;
  numReviews: number;
  isbn: string;
  pages: number;
  language: string;
  publishedYear: number;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  _id: string;
  userId: string;
  user?: { name: string; email: string };
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  user: { name: string; email: string };
  bookId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalBooks: number;
  totalUsers: number;
  categoryDistribution: { _id: string; count: number }[];
  monthlySales: { month: string; revenue: number; orders: number }[];
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}
