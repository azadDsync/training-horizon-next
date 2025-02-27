"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Listing {
  _id: string;
  category: string;
  subCategory: string[];
}

const Categories = () => {
  const [getCategories, setCategories] = useState<Listing[]>([]);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/category`)
      .then((res) => {
        const categoriesData = Array.isArray(res.data) ? res.data : [];
        setCategories(categoriesData);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setCategories([]);
      });
  }, []);

  // const scrollAmount = 300; // Adjust scroll distance

  // const handleScroll = (direction: "left" | "right") => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollBy({
  //       left: direction === "left" ? -scrollAmount : scrollAmount,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  return (
    <section className="bg-white/30 container mx-auto py-12">
      {/* <div className="flex justify-center"> */}
      <h2 className="text-4xl font-bold text-center mb-5">
        Browse <span className="text-blue-600">Categories</span>
      </h2>
      {/* </div> */}

      <div className="relative max-w-6xl mx-auto ">
        {/* Left Arrow
        <button
          onClick={() => handleScroll("left")}
          className="absolute -left-5 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-300 px-2 py-1 rounded-full shadow-md"
          aria-label="Previous"
        >
          ←
        </button> */}

        {/* Scrollable Categories Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scroll-smooth no-scrollbar p-4"
        >
          {Array.isArray(getCategories) && getCategories.map((category, i) => (
            <div
              onClick={() => router.push(`/${category.category}`)}
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl hover: transition-transform duration-300 transform hover:scale-105 hover:-translate-y-2 min-w-[250px] flex-grow">
              <div className="aspect-square relative">
                <Image
                  src={`/img/new/${category.category}.jpg`} // Make dynamic when AWS work is done
                  alt={category.category}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{category.category}</h3>
                <p></p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow
        <button
          onClick={() => handleScroll("right")}
          className="absolute -right-5 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-300 px-2 py-1 rounded-full shadow-md"
          aria-label="Next"
        >
          →
        </button> */}
      </div>
    </section>
  );
};

export default Categories;
