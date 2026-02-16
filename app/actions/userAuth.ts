"use client";
import { signIn } from "next-auth/react";
import { createNewUser } from "@/lib/queries/user";
import AuthError from "next-auth";
import { hashPassword } from "./password-encrypt";

export async function login(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    return { success: true, message: "Login successful!" };
  } catch (error) {
    const message =
      error instanceof AuthError
        ? "Invalid email or password"
        : error instanceof Error
          ? error.message
          : "Sign in Error";
    console.error("Error", message);
    return { success: false, message: message };
  }
}

export async function signUp(
  prevState: { success: boolean; message: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const hashedPassword = await hashPassword(password);

  try {
    const user = await createNewUser(email, username, hashedPassword);
    if (!user.success) {
      throw new Error(user.message);
    }
    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    return { success: true, message: "SignUp successful!" };
  } catch (error) {
    const message =
      error instanceof AuthError
        ? "Couldnt sign in"
        : error instanceof Error
          ? error.message
          : "Sign in Error";
    console.error("Error", message);
    return { success: false, message: message };
  }
}
