"use server";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/client";
import { prisma } from "@/lib/prisma";

export async function findUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("No account exists with this email");
    }
    return { success: true, user: user, message: "Successful" };
  } catch (err) {
    console.error("GetUserbyEmail Error:", err);
    return {
      success: false,
      user: null,
      message:
        err instanceof PrismaClientKnownRequestError ||
        err instanceof PrismaClientUnknownRequestError
          ? (err.message as string)
          : err instanceof Error
            ? err.message
            : "Couldn't create new user",
    };
  }
}

export async function createNewUser(
  email: string,
  username: string,
  password: string,
) {
  try {
    const user = await prisma.user.create({
      data: { email, password, username },
      select: { id: true },
    });
    if (!user) {
      throw new Error("Couldn't create new user");
    }
    return { success: true, user: user, message: "Successful" };
  } catch (err) {
    console.error("CreateNewUser Error:", err);
    return {
      success: false,
      user: null,
      message:
        err instanceof PrismaClientKnownRequestError
          ? err.code === "P2002"
            ? "An account with this email already exists"
            : err.message
          : err instanceof PrismaClientUnknownRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Couldn't create new user",
    };
  }
}
