import type { Metadata } from "next";
import AuthCard from "@/components/dashboard/AuthCard";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return <AuthCard mode="login" />;
}
