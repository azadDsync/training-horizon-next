"use client"

import { useState } from "react";
import Categories from "@/components/UserFlow/Categories";
import Main from "@/components/UserFlow/Main";
import TopNavigationBar from "@/components/UserFlow/TopNavigationBar";
import Testimonials from "@/components/UserFlow/Testimonials";
import Footer from "@/components/UserFlow/Footer";
import Navbar from "./NavBar";
import SearchSection from "./SearchSection";
import TopCourses from "./TopCourses";
import SearchWord from "./SearchWord";

export default function UserFlow() {
  const [keywords, setKeywords] = useState<string>("");

  const handleSearch = () => {
    console.log("Searching for:", keywords);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-[url('/img/new/displayBackground.svg')] bg-cover bg-center h-screen w-full">
        <Navbar />
        <Main />
        <SearchWord keywords={keywords} setKeywords={setKeywords} onSearch={handleSearch} />
        <Categories />
        <TopCourses />
        <Footer />
      </div>
    </div>
  );
}