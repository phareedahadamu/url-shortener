"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/app/schema";
import { login } from "@/app/actions/userAuth";
import { useState, useActionState, useEffectEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // States
  const [message, formAction, isPending] = useActionState(login, null);

  const [showMessage, setShowMessage] = useState(false);

  //   Form
  const {
    register,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  // useEffects
  const displayToast = useEffectEvent(() => {
    setShowMessage(true);
  });
  useEffect(() => {
    if (!message) return;
    displayToast();
  }, [message]);

  const navigate = useEffectEvent(() => {
    router.push("/");
  });
  useEffect(() => {
    if (!message || !message.success) return;

    const timer = setTimeout(() => {
      navigate();
    }, 2000);

    return () => clearTimeout(timer);
  }, [message]);
  return (
    <div className="flex  py-6 flex-col gap-6 w-full min-h-screen items-center justify-center font-sans text-neutral-800 relative">
      <div className=" max-w-80 w-[98%] flex flex-col items-center gap-12">
        <div className="flex flex-col w-full items-center">
          <p className="font-serif text-[20px]">Shortly</p>
          <div className="flex flex-col w-full items-center ">
            <p className="text-[36px] text-medium">Login</p>
            <p className="text-neutral-500 text-[14px]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-neutral-800 hover:underline duration-200 transition-colors"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
        <form className="flex flex-col gap-12 w-full" action={formAction}>
          <div className="flex flex-col gap-8 w-full">
            <label className="flex flex-col gap-2 relative">
              <span className="after:content-['*'] after:text-red-500 after:ml-0.5 text-neutral-500 font-medium">
                Email
              </span>
              <input
                {...register("email")}
                type="text"
                name="email"
                className={`p-3 w-full rounded-md border focus:outline-amber-200/25 ${
                  errors.email ? "border-red-500" : " border-neutral-300"
                }`}
              />
              {errors.email && (
                <p className="absolute -bottom-5 text-[14px] text-red-500">
                  {errors.email.message}
                </p>
              )}
            </label>
            <label className="relative flex flex-col gap-2">
              <span className="after:content-['*'] after:text-red-500 after:ml-0.5 text-neutral-500 font-medium">
                Password
              </span>
              <input
                {...register("password")}
                type="text"
                name="password"
                className={`p-3 w-full rounded-md border focus:outline-amber-200/25 ${
                  errors.password ? "border-red-500" : " border-neutral-300"
                }`}
              />
              {errors.password && (
                <p className="absolute -bottom-5 text-[14px] text-red-500">
                  {errors.password.message}
                </p>
              )}
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-neutral-800 text-white rounded-md p-3 disabled:cursor-not-allowed not-disabled:hover:bg-neutral-700 duration-200 transition-colors disabled:opacity-65 cursor-pointer flex items-center justify-center"
            disabled={isPending || !isValid}
          >
            {isPending ?
            <Loader2 size={18} className="animate-spin text-white" /> : "Login"}
          </button>
        </form>
      </div>
      {showMessage && message && (
        <Toast
          type={message.success ? "success" : "error"}
          title={message.success ? "Signin Successful" : "Signin Failed"}
          message={message.message}
          closeToast={() => {
            setShowMessage(false);
          }}
        />
      )}
      <div className=" border-10 border-amber-50/50 size-100 lg:size-200 rounded-full bg-amber-200/50 absolute top-0 -translate-y-[50%] left-0 -translate-x-[50%] -z-10 " />
    </div>
  );
}
