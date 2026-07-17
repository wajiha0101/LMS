const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Email is invalid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "INSTRUCTOR"], {
    errorMap: () => ({ message: "Role must be STUDENT or INSTRUCTOR" }),
  }),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email is invalid"),
});

const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email is invalid"),
  code: z.string().trim().length(6, "Code must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
