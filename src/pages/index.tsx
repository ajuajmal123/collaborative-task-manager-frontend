import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import api from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);

    try {
      await api.post("/auth/login", data);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded w-80 space-y-3"
      >
        <h1 className="text-lg font-semibold">Login</h1>

        {serverError && (
          <p className="text-red-600 text-sm">{serverError}</p>
        )}

        <input
          {...register("email")}
          placeholder="Email"
          className="input"
        />
        {errors.email && (
          <p className="error">{errors.email.message}</p>
        )}

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="input"
        />
        {errors.password && (
          <p className="error">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
