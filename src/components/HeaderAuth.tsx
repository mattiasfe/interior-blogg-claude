"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

/** Sign-in state in the header. Only rendered when Clerk keys are configured. */
export default function HeaderAuth() {
  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        <Link
          href="/logg-inn"
          className="rounded-full border border-sand px-4 py-1.5 text-sm font-semibold text-ink/80 transition-colors hover:border-sage hover:text-sage-dark"
        >
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/konto"
          className="hidden text-sm font-medium text-ink/80 transition-colors hover:text-sage-dark sm:block"
        >
          Account
        </Link>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
