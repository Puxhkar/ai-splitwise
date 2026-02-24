"use client";

import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useStoreUser } from "@/hooks/use-store-user";
import { BarLoader } from "react-spinners";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isLoading } = useStoreUser();
  const path = usePathname();

  return (
    <header className="fixed top-0 w-full border-b bg-white/95 backdrop-blur z-50 supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logos/logo.png"}
            alt="Vehiql Logo"
            width={120}
            height={40}
            className="h-8 w-auto object-contain brightness-0"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 mx-auto">
          <Link
            href="/features"
            className="text-xs font-semibold text-zinc-600 hover:text-black transition uppercase tracking-wider"
          >
            Features
          </Link>
          <Link
            id="tour-how-it-works"
            href="/how-it-works"
            className="text-xs font-semibold text-zinc-600 hover:text-black transition uppercase tracking-wider"
          >
            How It Works
          </Link>
          <Link
            href="/help"
            className="text-xs font-semibold text-zinc-600 hover:text-black transition uppercase tracking-wider"
          >
            Help & Guides
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Authenticated>
            <Link href="/dashboard" id="tour-dashboard-link">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2 text-xs font-bold border-green-200 bg-green-100 text-green-700 hover:bg-green-200 transition uppercase tracking-wider"
              >
                <LayoutDashboard className="h-3 w-3" />
                Dashboard
              </Button>
            </Link>

            <Link href="/settings">
              <Button
                variant="ghost"
                className="hidden md:inline-flex text-xs font-bold text-zinc-600 hover:text-black transition uppercase tracking-wider px-2"
              >
                Profile
              </Button>
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </Authenticated>

          <Unauthenticated>
            <SignInButton fallbackRedirectUrl="/dashboard">
              <Button variant="ghost" id="tour-sign-in">Sign In</Button>
            </SignInButton>

            <SignUpButton fallbackRedirectUrl="/dashboard">
              <Button className="bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-bold uppercase tracking-wider border-none px-5">
                Get Started
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
      </nav>
      {isLoading && <BarLoader width={"100%"} color="#36d7b7" />}
    </header>
  );
}
