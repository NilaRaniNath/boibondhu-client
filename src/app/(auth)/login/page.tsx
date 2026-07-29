"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { LogIn, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register: registerUser } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  const loginForm = useForm<LoginForm>({ defaultValues: { email: "", password: "" } });
  const registerForm = useForm<RegisterForm>({ defaultValues: { name: "", email: "", password: "" } });

  async function handleLogin(data: LoginForm) {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      router.push(redirect);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(data: RegisterForm) {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success("Account created! Welcome to BoiBondhu.");
      router.push("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-8 shadow-lg animate-fade-in-up">
      {/* Tabs */}
      <div className="flex rounded-xl bg-cream-100 p-1">
        <button
          onClick={() => setTab("login")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            tab === "login" ? "bg-white text-maroon-800 shadow-sm" : "text-cream-600 hover:text-maroon-800"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab("register")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            tab === "register" ? "bg-white text-maroon-800 shadow-sm" : "text-cream-600 hover:text-maroon-800"
          }`}
        >
          Create Account
        </button>
      </div>

      {tab === "login" ? (
        <>
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-cream-600">Email</label>
              <input
                type="email"
                {...loginForm.register("email", { required: "Email is required" })}
                className="w-full rounded-xl border border-cream-300 px-4 py-2.5 text-sm text-foreground placeholder:text-cream-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                placeholder="you@example.com"
              />
              {loginForm.formState.errors.email && <p className="mt-1 text-xs text-red-500">{loginForm.formState.errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-cream-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...loginForm.register("password", { required: "Password is required" })}
                  className="w-full rounded-xl border border-cream-300 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-cream-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-500 hover:text-cream-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {loginForm.formState.errors.password && <p className="mt-1 text-xs text-red-500">{loginForm.formState.errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Sign In
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-cream-600">Full Name</label>
            <input
              {...registerForm.register("name", { required: "Name is required" })}
              className="w-full rounded-xl border border-cream-300 px-4 py-2.5 text-sm text-foreground placeholder:text-cream-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              placeholder="Rahim Uddin"
            />
            {registerForm.formState.errors.name && <p className="mt-1 text-xs text-red-500">{registerForm.formState.errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-cream-600">Email</label>
            <input
              type="email"
              {...registerForm.register("email", { required: "Email is required" })}
              className="w-full rounded-xl border border-cream-300 px-4 py-2.5 text-sm text-foreground placeholder:text-cream-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              placeholder="you@example.com"
            />
            {registerForm.formState.errors.email && <p className="mt-1 text-xs text-red-500">{registerForm.formState.errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-cream-600">Password</label>
            <input
              type="password"
              {...registerForm.register("password", { required: "Password is required" })}
              className="w-full rounded-xl border border-cream-300 px-4 py-2.5 text-sm text-foreground placeholder:text-cream-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              placeholder="At least 6 characters"
            />
            {registerForm.formState.errors.password && <p className="mt-1 text-xs text-red-500">{registerForm.formState.errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Create Account
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-xs text-cream-500">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-maroon-800" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
