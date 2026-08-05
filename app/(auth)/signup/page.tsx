"use client";
import { useState } from "react";
import {
  BookOpen,
  KeyRound,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import FormWrapper from "@/components/ui/FormWrapper";
import Button from "@/components/ui/Button";
import { post } from "@/lib/api";

type Inputs = {
  fullName: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const onCancel = () => {
    return true;
  };

  const { handleSubmit, register } = useForm();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.fullName && !data.email && !data.password) {
      toast.error("Please enter a full name, email and password");
    }
    setIsLoading(true);
    try {
      const result = await post(
        "/api/auth/register",
        {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        },
        {},
      );
      toast.success(result.data.message);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Something Went Wrong!");
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

          {/* Form Body */}
          <FormWrapper
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8275]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  {...register("fullName", {
                    required: true,
                  })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] transition-all"
                />
              </div>
            </div>

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

            {/* Action Buttons */}
            <div className="pt-3 space-y-2">
              <Button
                isLoading={isLoading}
                type="submit"
                loadingText={"Creating account..."}
                activeText={"Complete Registration"}
                customClass={
                  "w-full py-3 px-4 bg-[#2D2A26] hover:bg-[#1A1816] text-[#FBF9F6] rounded-xl font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                }
              />
            </div>
          </FormWrapper>
        </div>
      </div>
    </div>
  );
}
