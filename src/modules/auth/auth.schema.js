const { z } = require("zod");

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Email is invalid"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "INSTRUCTOR"], {
    errorMap: () => ({ message: "Role must be STUDENT or INSTRUCTOR" }),
  }),
});

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { RegisterSchema, LoginSchema };
