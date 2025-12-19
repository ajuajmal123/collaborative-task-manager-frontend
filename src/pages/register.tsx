import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null);
    try {
      await api.post("/auth/register", data);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-6 rounded w-80 space-y-3"
        onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-lg font-semibold text-center">Register</h1>

        {serverError && (
          <p className="text-red-600 text-sm text-center">
            {serverError}
          </p>
        )}

        <input {...register("name")} placeholder="Name" className="input" />
        <p className="error">{errors.name?.message}</p>

        <input {...register("email")} placeholder="Email" className="input" />
        <p className="error">{errors.email?.message}</p>

        <input type="password" {...register("password")} placeholder="Password" className="input" />
        <p className="error">{errors.password?.message}</p>

        <input type="password" {...register("confirmPassword")} placeholder="Confirm Password" className="input" />
        <p className="error">{errors.confirmPassword?.message}</p>

        <button className="btn-primary w-full" disabled={isSubmitting}>
          Register
        </button>
      </form>
    </div>
  );
}
