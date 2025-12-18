import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useRouter } from "next/router";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    await api.post("/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h1 className="text-xl font-semibold mb-4">Register</h1>

        <input {...register("name")} placeholder="Name" className="input" />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <input
          {...register("email")}
          placeholder="Email"
          className="input mt-3"
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="input mt-3"
        />

        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          className="input mt-3"
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}

        <button className="btn-primary mt-4">Register</button>
      </form>
    </div>
  );
}
