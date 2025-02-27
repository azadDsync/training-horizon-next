"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserDashboard from "./UserDashboard";
import RoleBasedNav from "./RoleBasedNav";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import HomeNavbar from "./HomeNavbar"; // Create a separate Navbar for Home
import Image from "next/image";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isTrainer, setIsTrainer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOrg, setIsOrg] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
//   const isHomePage = router.pathname === "/"; // Check if the current page is Home

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsOrg(role === "organization");
    setIsTrainer(role === "trainer");
    setLoggedIn(!!token);
    setLoading(false);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

//   if (isHomePage) {
//     return <HomeNavbar />; // Render HomeNavbar for the Home page
//   }

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-white backdrop-blur-sm"
          : "bg-[url('/img/new/displayBackground.svg')] bg-cover bg-center"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl px-5 font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          <Link href="/"><Image className="mt-6" src="/Logo/MMP.png" alt="MMP Logo" width={120} height={50} /></Link>
          </div>

          <div className="flex space-x-6">
          {/* <Link href="/" className="hidden md:flex text-gray-700 hover:underline">
              Home
            </Link> */}
            <Link href="/all/courses" className="hidden md:flex text-gray-700 hover:underline">
              Courses
            </Link>
            <Link href="/rentals" className="hidden md:flex text-gray-700 hover:underline">
              Book a Rental
            </Link>
            <Link href="/about" className="hidden md:flex text-gray-700 hover:underline">
              About Us
            </Link>
            <Link href="/trainer" className="hidden md:flex text-gray-700 hover:underline">
              Our Trainers
            </Link>
          </div>

          {loggedIn ? (
            <>
              {isOrg && (
                <Link className="bg-yellow-600 p-2 rounded-sm text-white" href="/Organization/createRental">
                  Create a Rental
                </Link>
              )}

              {isTrainer && !loading && <RoleBasedNav />}

              {!isTrainer && !isOrg && (
                <Link href="/dashboard/teacher/join_as_teacher" className="hidden sm:block hover:underline">
                  Join as Trainer
                </Link>
              )}

              <UserDashboard />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/dashboard/teacher/join_as_teacher" className="hidden sm:block hover:underline">
                Join As Trainer
              </Link>
              <Button onClick={() => router.push("/userflow/login")} variant="default" className="bg-blue-600 hover:bg-blue-600">
                Sign in
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
