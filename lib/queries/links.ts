"use server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@/generated/prisma/internal/prismaNamespace";
import { configOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { User } from "@/generated/prisma/client";

export async function createShortUrl(
  _prevState: {
    success: boolean;
    urlData: { shortUrl: string; longUrl: string } | null;
    message: string;
  } | null,
  formData: FormData,
) {
  const session = await getServerSession(configOptions);

  if (!session || !session.user) {
    return { success: false, urlData: null, message: "User not authenticated" };
  }
  const user = session.user as User;
  const userId = user.id as string;
  const longUrl = formData.get("url") as string;
  const existingUrlData = await prisma.link.findFirst({
    where: { longUrl, userId },
    select: { longUrl: true, shortUrl: true },
  });
  if (existingUrlData) {
    return {
      success: true,
      urlData: existingUrlData,
      message: "Short link already exist for the url",
    };
  }
  while (true) {
    const shortUrl = nanoid(7);
    try {
      const urlData = await prisma.link.create({
        data: { shortUrl, longUrl, userId },
        select: { longUrl: true, shortUrl: true },
      });
      return {
        success: true,
        urlData: urlData,
        message: "Short link created successfully",
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        continue;
      const message =
        error instanceof PrismaClientKnownRequestError ||
        error instanceof PrismaClientUnknownRequestError ||
        error instanceof PrismaClientValidationError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Couldnt generate short url";
      return { success: false, urlData: null, message: message };
    }
  }
}

export async function getLinks(userId: string) {
  try {
    const links = await prisma.link.findMany({ where: { userId } });
    return { success: true, links: links, message: "Successful" };
  } catch (error) {
    const message =
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientUnknownRequestError ||
      error instanceof PrismaClientValidationError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Couldnt fetch links";
    console.error(message);
    return { success: false, links: null, message: message };
  }
}
export async function getSingleLink(shortUrl: string) {
  try {
    const link = await prisma.link.update({
      where: { shortUrl },
      data: { clickCount: { increment: 1 } },
      select: { longUrl: true },
    });
    return { success: true, longUrl: link.longUrl, message: "Successful" };
  } catch (error) {
    const message =
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientUnknownRequestError ||
      error instanceof PrismaClientValidationError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Link not found";
    console.log(message);
    return { success: false, longUrl: null, message: message };
  }
}

export async function getMetrics(userId: string) {
  try {
    const [totalLinks, totalClicksResult, topLink] = await Promise.all([
      prisma.link.count({
        where: { userId },
      }),

      prisma.link.aggregate({
        where: { userId },
        _sum: { clickCount: true },
      }),

      prisma.link.findFirst({
        where: { userId },
        orderBy: { clickCount: "desc" },
        select: { clickCount: true },
      }),
    ]);

    const totalClicks = totalClicksResult._sum.clickCount ?? 0;
    const highestClickCount = topLink?.clickCount ?? 0;

    return { totalLinks, totalClicks, highestClickCount };
  } catch (error) {
    console.log(error);
    return null;
  }
}
