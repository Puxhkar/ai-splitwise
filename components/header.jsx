"use client";

import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, User, Users, SplitSquareHorizontal, ChevronDown } from "lucide-react";
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
            <div className="relative group hidden md:block">
              <Button
                variant="outline"
                className="inline-flex items-center gap-2 text-xs font-bold border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 transition uppercase tracking-wider"
              >
                <SplitSquareHorizontal className="h-3 w-3" />
                Splitting
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white border border-zinc-200 shadow-xl rounded-xl p-2 flex flex-col gap-1">
                  <Link href="/dashboard?tab=personal" className="px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-black rounded-lg flex items-center gap-3">
                    <User className="h-4 w-4 text-emerald-500" />
                    Self Expense Tracker
                  </Link>
                  <Link href="/expenses/new" className="px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-black rounded-lg flex items-center gap-3">
                    <SplitSquareHorizontal className="h-4 w-4 text-blue-500" />
                    Individual Splitting
                  </Link>
                  <Link href="/dashboard?tab=groups" className="px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-black rounded-lg flex items-center gap-3">
                    <Users className="h-4 w-4 text-purple-500" />
                    Group Splitting
                  </Link>
                </div>
              </div>
            </div>

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
