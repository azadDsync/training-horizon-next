"use client";

import { Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Listing {
  _id: string;
  category: string;
  subCategory: string;
  title: string;
  imageUrl: string;
  priceMode: string;
  price: string;
  mode: string;
  location: string;
  quantity: string;
  classSize: string;
  startDate: string;
  endDate: string;
  days: string;
  gender: string;
  startTime: string;
  endTime: string;
  minAge: string;
  maxAge: string;
  description: string;
  trainerId: string;
  listingId: string;
  isFavorite: boolean;
  avgRating: number;
}
// const handleonClick = () => {};

export default function TopCourses() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [getImageUrl, setImageUrl] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/listing/`
        );
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };
    fetchCourses();
  }, []);

  // console.log("Categories are:", getCategories);

  useEffect(() => {
    const fetchImages = async () => {
      const newImageUrls: { [key: string]: string } = {};

      await Promise.all(
        listings.map(async (listing) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/upload?imageUrl=${listing.imageUrl}`
            );
            if (!response.ok) throw new Error("Failed to fetch signed URL");

            const data = await response.json();
            newImageUrls[listing._id] = data.signedUrl;
          } catch (error) {
            console.error("Error fetching image for:", listing._id, error);
          }
        })
      );

      setImageUrl(newImageUrls);
    };

    if (listings.length > 0) {
      fetchImages();
    }
  }, [listings]);

  const sortedListings = [...listings]
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 6);

  return (
    <section className="bg-white/40 container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-5">
        Top <span className="text-blue-600">Courses</span>
      </h2>
      <p className="text-center text-gray-500 mt-2 mb-12">
        Explore our top-rated courses designed to enhance your skills and
        knowledge across various domains. <br /> Learn from industry experts and
        stay ahead in your career.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {sortedListings.map((listing, i) => {
          return (
            <div
              key={listing._id}
              onClick={() => {
                router.push(
                  `/${listing.category}/${listing.subCategory}/${listing._id}`
                );
              }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:-translate-y-2"
            >
              <div className="aspect-video relative rounded-t-xl overflow-hidden">
                <Image
                  src={getImageUrl[listing._id] || "/img/tempListingImg.jpg"}
                  alt={listing.title}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full"
                />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                  {listing.title}
                </h3>
                <p className="text-blue-500 font-bold text-sm sm:text-base mb-2 sm:mb-3">
                  $ {listing.price}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>{" "}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {listing.startTime} {listing.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    ratings:
                    <span>{listing.avgRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <img
                      src="/img/new/user.jpg" // this should come from s3
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{listing.trainerId}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => {
            router.push(`/all/courses`);
          }}
          variant="outline"
          className="px-8 bg-blue-600 hover:bg-blue-600 text-black"
        >
          Load more listing
        </Button>
      </div>
    </section>
  );
}
