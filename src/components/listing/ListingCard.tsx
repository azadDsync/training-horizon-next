"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setForm } from "@/lib/store/formSlice";
import Image from "next/image";
import { Calendar, MapPin, Sun, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface ListingCardProps {
  category: string;
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
  categoryName: string;
  subCategoryName: string;
  avgRating: number;
}

const ListingCard: React.FC<ListingCardProps> = ({
  category,
  title,
  imageUrl,
  priceMode,
  price,
  mode,
  location,
  quantity,
  classSize,
  startDate,
  endDate,
  days,
  gender,
  startTime,
  endTime,
  minAge,
  maxAge,
  description,
  trainerId,
  listingId,
  isFavorite,
  categoryName,
  subCategoryName,
  avgRating,
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(isFavorite);
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const sendData = () => {
    dispatch(
      setForm({
        category,
        title,
        priceMode,
        price,
        mode,
        location,
        quantity,
        classSize,
        startDate,
        endDate,
        days,
        gender,
        startTime,
        endTime,
        minAge,
        maxAge,
        description,
        trainerId,
        isFavorite,
      })
    );
  };
  const [getImageUrl, setImageUrl] = useState<string>(
    "/img/loading.gif"
  );

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = window.localStorage.getItem("userId");
      if (!userId) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/favorites/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const { favorites } = await response.json();
          setFavorites(favorites);
          setIsSelected(favorites.includes(listingId));
        } else {
          console.error("Error fetching user favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    const fetchImage = async() => {
      try {
        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/upload?imageUrl=${imageUrl}`
        );
        if (!response2.ok) throw new Error("Failed to fetch signed URL");

        const data = await response2.json();
        setImageUrl(data.signedUrl);
      } catch (error) {}

      
    }

    fetchImage();
    fetchFavorites();
  }, [listingId, imageUrl]);

  const handleOnClick = async (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const newIsSelected = !isSelected;
    setIsSelected(newIsSelected);

    const userId = window.localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to use this feature");
      router.push("/userflow/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/favorites`,
        {
          method: newIsSelected ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId, listingId }),
        }
      );

      if (response.ok) {
        if (newIsSelected) {
          setFavorites((prevFavorites) => [...prevFavorites, listingId]);
        } else {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((id) => id !== listingId)
          );
        }
      } else {
        setIsSelected(!newIsSelected);
        console.error("Error processing favorite");
      }
    } catch (error) {
      setIsSelected(!newIsSelected);
      console.error("Error processing favorite:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-background">
      <div className="w-full h-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:-translate-y-2">
            <div className="relative">
              <img
                src={getImageUrl || "/img/new/cricket.svg"}
                alt={title}
                className="w-full h-[250px] object-cover rounded-t-lg"
              />
              <Image
                src={`${
                  isSelected ? "/icons/filled_fav.png" : "/icons/fav.png"
                }`}
                alt="fav"
                width={25}
                height={25}
                onClick={handleOnClick}
                className="absolute top-4 right-4 bg-gray-100 p-1 rounded-full shadow-md cursor-pointer"
              />
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-6 h-6 opacity-30" />
                    <span className="text-sm sm:text-base">{mode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Users className="w-6 h-6 opacity-30" />
                    <span className="text-sm sm:text-base">{classSize}</span> */}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Sun className="w-6 h-6 opacity-30" /> */}
                    <Users className="w-6 h-6 opacity-30" />
                    <span className="text-sm sm:text-base">{gender}</span>
                    {/* <span className="text-sm sm:text-base">{maxAge}</span> */}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {title.length > 20 ? title.slice(0, 20) + "..." : title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{startTime}</span>
                  <span>-</span>
                  <span>{endTime}</span>
                  <span>•</span>
                  <span>{category}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg sm:text-xl font-semibold text-[#3D7A81]">
                  ${price}
                  <span className="text-sm font-normal text-gray-400">
                    {priceMode === "Per day"
                      ? "/day"
                      : priceMode === "Per month"
                      ? "/month"
                      : "/course"}
                  </span>
                </span>
                <Button
                  variant="outline"
                  className="border-[#1D2735] text-[#1D2735] text-sm sm:text-base"
                  onClick={() => {
                    sendData();
                    router.push(
                      `/${categoryName}/${subCategoryName}/${listingId}`
                    );
                  }}
                >
                  Enroll Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
