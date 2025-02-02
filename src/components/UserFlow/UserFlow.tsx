"use client"

import Categories from "@/components/UserFlow/Categories";
import Main from "@/components/UserFlow/Main";
import TopNavigationBar from "@/components/UserFlow/TopNavigationBar";
import Testimonials from "@/components/UserFlow/Testimonials";
import Footer from "@/components/UserFlow/Footer";
import Navbar from "./NavBar";
import SearchSection from "./SeachSection";
import TopCourses from "./TopCourses";
// import VacationCourses from "@/components/UserFlow/VacationCourses";

export default function UserFlow() {
  return (
    <div className="min-h-screen ">
      <div className="bg-[url('/img/new/displayBackground.svg')] bg-cover bg-center h-screen w-full">
        <Navbar />
        <Main />
        <SearchSection />
        <Categories />
      {/* <VacationCourses /> */}
      {/* <Testimonials /> */}
      <TopCourses/>
      <Footer />
      </div>
      
    </div>
  );
}
