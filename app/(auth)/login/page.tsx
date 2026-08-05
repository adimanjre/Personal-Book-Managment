"use client";
import { useState } from "react";
import { BookOpen, KeyRound, Mail } from "lucide-react";
import FormWrapper from "@/components/ui/FormWrapper";
import Button from "@/components/ui/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { post } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/userSlice";

type Inputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, register } = useForm<Inputs>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      const response = await post(
        "/api/auth/login",
        {
          email: data.email,
          password: data.password,
        },
        {},
      );
      dispatch(setUser(response.data.user));
      router.push("/");
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
      }
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className={"w-full max-w-md mx-auto py-10 px-4"}>
        <div className="bg-[#FAF8F5] border border-[#EBE5DA] rounded-2xl shadow-sm p-6 sm:p-8 relative overflow-hidden">
          {/* Soft paper texture background accent */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F0EAE1] rounded-full blur-2xl opacity-60 pointer-events-none" />

          {/* Brand Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#2D2A26] text-[#FBF9F6] mb-3 shadow-sm">
              <BookOpen className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2D2A26] tracking-tight">
              The Reader's Shelf
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#8C8275] font-medium mt-1">
              Personal Reading Manager
            </p>
          </div>

          {/* Tab Switcher */}

          {/* Form Body */}
          <FormWrapper
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8275]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: true,
                  })}
                  placeholder="reader@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8275]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...register("password", {
                    required: true,
                  })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Demo mode: Password reset endpoint will connect to your backend service.",
                  );
                }}
                className="text-[#8C8275] hover:text-[#2D2A26] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 space-y-2">
              <Button
                isLoading={isLoading}
                type="submit"
                loadingText={"Signing in..."}
                activeText={"Continue to Shelf"}
                customClass={
                  "w-full py-3 px-4 bg-[#2D2A26] hover:bg-[#1A1816] text-[#FBF9F6] rounded-xl font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                }
              />
            </div>
          </FormWrapper>

          <p className="text-center text-xs text-[#8C8275] mt-6 relative z-10">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#2D2A26] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
