import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { isAuthConfigured } from "@/lib/access";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  if (!isAuthConfigured()) notFound();

  return (
    <div className="container-content flex justify-center py-12 sm:py-16">
      <SignIn />
    </div>
  );
}
