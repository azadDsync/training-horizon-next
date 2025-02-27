"use client"

import React, { useEffect, useState } from "react";
import SideLayout from "./SideLayout";
import MainDetailPage from "./MainDetailPage";
import InstructorsPage from "../UserFlow/Instructor";
import Reviews from "./Reviews";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setForm } from "@/lib/store/formSlice";
import NewDetailPage from "./NewDetailPage";



interface TrainerData {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  experience: string;
  qualifications: string;
  phone: string;
  avgRating: number;
  [key: string]: any;
  imageUrl: string;
}

interface ListingDetailPageProps {
  id: string;
}

interface ListingCard {
  category: string;
  title: string;
  priceMode: string;
  price: string;
  mode: string;
  imageUrl: string;
  location: string;
  preRequistes: string;
  quantity: string;
  classSize: string;
  startDate: string;
  endDate: string;
  days: [string];
  gender: string;
  startTime: string;
  endTime: string;
  minAge: string;
  maxAge: string;
  description: string;
  trainerId: string;
  listingId: string;
  isFavorite: boolean;
}

const ListingDetail: React.FC<ListingDetailPageProps> = ({ id }) => {
  const [data, setData] = useState<TrainerData | null>(null);
  const [getListing, setListing] = useState<ListingCard>({} as ListingCard);
  const form = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  // Fetch listing details
  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/listing/${id}`
        );
        const listing = response.data.listing;
        setListing(listing);
        dispatch(setForm(listing))
      } catch (error) {
        console.log("Error fetching listing data:", error);
      }
    };

    fetchListingData();
  }, [id, dispatch]);

  // Fetch trainer details if trainerId is available
  useEffect(() => {
    if (form.trainerId) {
      const fetchTrainerData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/trainers/${form.trainerId}`
          );
          setData(response.data.trainer);
        } catch (error) {
          console.log("Error fetching trainer data:", error);
        }
      };

      fetchTrainerData();
    }
  }, [form.trainerId]);
  const extractAge = (value, isMaxAge = false) => {
    if (typeof value !== "string") return 0; // Ensure value is a string before processing

    if (value.includes("18+Adults")) return isMaxAge ? 55 : 18;
    if (value.includes("55+Senior")) return isMaxAge ? 100 : 55;

    const match = value.match(/\d+/); // Extracts the first number found in the string
    return match ? Number(match[0]) : 0; // Defaults to 0 if no valid number found
  };

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 bg-gray-50">
      {/* Main Content and Sidebar Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Main Content */}
        <div className="w-full md:w-2/3">
          {/* <MainDetailPage listingId={id} listingData={getListing} /> */}
          {data && <NewDetailPage listingId={id} listingData={getListing} instructorData={data} />}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3">

          <SideLayout
            minAgeLimit={extractAge(form.minAge)}
            maxAgeLimit={extractAge(form.maxAge, true)}
            listingId={id}
            trainerPhone={data?.phone ?? ""}
            listingPrice={getListing.price}
            priceMode={getListing.priceMode}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reviews</h2>
        <Reviews listingId={id} />
      </div>
    </div>
  );
};

export default ListingDetail;
