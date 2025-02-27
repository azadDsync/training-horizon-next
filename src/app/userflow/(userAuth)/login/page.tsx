// import Footer from "@/components/UserFlow/Footer";
// import LoginCard from "@/components/UserFlow/LoginCard";
// import Navbar from "@/components/UserFlow/NavBar";
// import Image from "next/image";

// export default function page() {
//   return (
//     <>
//       <Navbar />
//       <Image
//         src="/img/new/displayBackground.svg"
//         alt="Decorative elements"
//         fill
//         className="hidden lg:block absolute top-0 right-56 -z-2"
//       />
//       <div className="flex justify-center  items-center h-screen bg-transparent">
//         <LoginCard />
//       </div>
//       <Footer />
//     </>
//   );
// }
import Footer from "@/components/UserFlow/Footer";
import LoginCard from "@/components/UserFlow/LoginCard";
import Navbar from "@/components/UserFlow/NavBar";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/new/displayBackground.svg"
          alt="Decorative elements"
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex justify-center items-center h-screen bg-transparent">
        <LoginCard />
      </div>

      <Footer />
    </div>
  );
}
