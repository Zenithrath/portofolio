import type { Metadata } from "next";
import AuthCard from "@/components/dashboard/AuthCard";

export const metadata: Metadata = { title: "Daftar" };

export default function RegisterPage() {
  return <AuthCard mode="register" />;
}
