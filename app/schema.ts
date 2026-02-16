import * as z from "zod";

export const SignUpSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, "Username must be at least two characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/\d/, "Password must include at least one number.")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must include at least one special character.",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string("Password must be a string"),
});

const isValidWebUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};
export const urlSchema = z.object({
  url: z.string().refine(isValidWebUrl, {
    message: "Must be a valid web URL (http or https)",
  }),
});
