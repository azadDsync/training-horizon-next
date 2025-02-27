import Footer from "@/components/UserFlow/Footer";
import Navbar from "@/components/UserFlow/NavBar";
import SignUpcard from "@/components/UserFlow/SignUpcard";
import Image from "next/image";

const Page = () => {
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
      <main className="flex justify-center my-16 items-center h-screen bg-transparent">
        <SignUpcard />
      </main>

      <Footer />
    </div>
  );
};

export default Page;
