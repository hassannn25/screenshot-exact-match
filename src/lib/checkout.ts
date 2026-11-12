import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your shipping address").max(200),
  city: z.string().trim().min(2, "Enter your city").max(80),
  postalCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9\s-]{3,10}$/, "Enter a valid postal code"),
  payment: z.enum(["cod", "card"]),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;
