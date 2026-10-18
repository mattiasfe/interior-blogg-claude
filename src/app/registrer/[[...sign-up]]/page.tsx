import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { isAuthConfigured } from "@/lib/access";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  if (!isAuthConfigured()) notFound();

  return (
    <div className="container-content flex justify-center py-12 sm:py-16">
      <SignUp />
    </div>
  );
}
