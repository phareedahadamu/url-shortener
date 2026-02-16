"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/app/schema";
import { CircleCheck, CircleX } from "lucide-react";
import { useState, useActionState, useEffectEvent, useEffect } from "react";
import { signUp } from "@/app/actions/userAuth";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignUpForm() {
  const router = useRouter();
  // States
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [message, formAction, isPending] = useActionState(signUp, null);
  const [showMessage, setShowMessage] = useState(false);

  //   Form
  const {
    register,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });
  const watchedPassword = useWatch({ control, name: "password" });
  const validatePassword = [
    {
      msg: "Must be at least 8 characters",
      status: watchedPassword.split("").length > 7,
    },
    {
      msg: "Must include an uppercase letter",
      status: watchedPassword.split("").find((val) => /[A-Z]/.test(val))
        ? true
        : false,
    },
    {
      msg: "Must include a number",
      status: watchedPassword.split("").find((val) => /\d/.test(val))
        ? true
        : false,
    },
    {
      msg: "Must include a special character",
      status: watchedPassword
        .split("")
        .find((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val))
        ? true
        : false,
    },
  ];
  const validatePasswordComp = validatePassword.map((item, index) => (
    <div key={index} className="flex gap-4 items-center text-[14px]">
      <span>
        {item.status ? (
          <CircleCheck
            size={16}
            className={`text-white ${
              item.status ? "fill-green-500" : "fill-red-500"
            }`}
          />
        ) : (
          <CircleX
            size={16}
            className={`text-white ${
              item.status ? "fill-green-500" : "fill-red-500"
            }`}
          />
        )}
      </span>
      <p className={`${item.status ? "text-green-500" : "text-red-500"}`}>
        {item.msg}
      </p>
    </div>
  ));

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
    <div className="flex  flex-col gap-6 w-full min-h-screen items-center justify-center font-sans text-neutral-800  py-6">
      <div className=" max-w-80 w-[98%] flex flex-col items-center gap-12">
        <div className="flex flex-col w-full items-center">
          <p className="font-serif text-[20px]">Shortly</p>
          <div className="flex flex-col w-full items-center ">
            <p className="text-[36px] text-medium">Signup</p>
            <p className="text-neutral-500 text-[14px]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-neutral-800 hover:underline duration-200 transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
        <form className="flex flex-col gap-12 w-full" action={formAction}>
          <div className="flex flex-col gap-8 w-full">
            <label className="flex flex-col gap-2 relative">
              <span className="after:content-['*'] after:text-red-500 after:ml-0.5 text-neutral-500 font-medium">
                Username
              </span>
              <input
                {...register("username")}
                name="username"
                type="username"
                className={`p-3 w-full rounded-md border focus:outline-amber-200/25 ${
                  errors.username ? "border-red-500" : " border-neutral-300"
                }`}
              />
              {errors.username && (
                <p className="absolute -bottom-5 text-[14px] text-red-500">
                  {errors.username.message}
                </p>
              )}
            </label>
            <label className="flex flex-col gap-2 relative">
              <span className="after:content-['*'] after:text-red-500 after:ml-0.5 text-neutral-500 font-medium">
                Email
              </span>
              <input
                {...register("email")}
                name="email"
                type="text"
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
                name="password"
                type="text"
                className={`p-3 w-full rounded-md border focus:outline-amber-200/25 ${
                  errors.password ? "border-red-500" : " border-neutral-300"
                }`}
                onClick={() => {
                  setShowPasswordValidation(true);
                }}
                onBlur={() => {
                  setShowPasswordValidation(false);
                }}
              />
              {errors.password && (
                <p className="absolute -bottom-5 text-[14px] text-red-500">
                  {errors.password.message}
                </p>
              )}
              {showPasswordValidation && (
                <div className="absolute top-full left-0 right-0 bg-white w-full flex flex-col gap-1 rounded-md p-4 z-50 border border-gray-500">
                  {validatePasswordComp}
                </div>
              )}
            </label>
            <label className="relative flex flex-col gap-2">
              <span className="after:content-['*'] after:text-red-500 after:ml-0.5 text-neutral-500 font-medium">
                Confirm Password
              </span>
              <input
                {...register("confirmPassword")}
                name="confirmPassword"
                type="text"
                className={`p-3 w-full rounded-md border focus:outline-amber-200/25 ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : " border-neutral-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="absolute -bottom-5 text-[14px] text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-neutral-800 text-white rounded-md p-3 disabled:cursor-not-allowed not-disabled:hover:bg-neutral-700 duration-200 transition-colors disabled:opacity-65 cursor-pointer flex justify-center items-center"
            disabled={isPending || !isValid}
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              "Signup"
            )}
          </button>
        </form>
      </div>
      {showMessage && message && (
        <Toast
          type={message.success ? "success" : "error"}
          title={message.success ? "Signup Successful" : "Signup Failed"}
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
