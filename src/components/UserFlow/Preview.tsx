"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pill from "@/components/listing/Pill";
import { Button } from "../trainer-dashboard/ui/button";

const PreviewPage = () => {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const router = useRouter();

  const [listing, setListing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async (id: string) => {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/v1/listing/listing/${id}`
        );
        const fetchedListing = response.data.listing;
        setListing(fetchedListing);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError("Error fetching listing");
      }
    };

    fetchListing(listingId);
  }, [listingId]);

  const handlePost = () => {
    if (!listingId) return;
    console.log(listingId);
  };

  const handleClick = () => {
    router.push(`/userflow/addListing?listingId=${listingId}`);
  }

  if (!listingId) {
    return <div>No data provided</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Your Listing</h1>
        <Pill text={`${!listing.isApproved ? `Pending for approval` : `Approved`}`} color={`${!listing.isApproved ? `bg-yellow-200` : `bg-green-400`}`} />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2"> {listing.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <span className="font-semibold">Category:</span> {listing.category}
            </p>
            <p >
              <span className="font-semibold">Price:</span> ${listing.price} {listing.priceMode}
            </p>
            <p>
              <span className="font-semibold">Mode:</span> {listing.mode}
            </p>
            <p>
              <span className="font-semibold">{listing.mode === "Offline" ? "Location" : "Zoom Link"}:</span> {listing.location}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {listing.quantity}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {listing.startDate}
            </p>
            <p>
              <span className="font-semibold">End Date:</span> {listing.endDate}
            </p>
            <p className="flex gap-2">
              <span className="font-semibold">Days:</span><div className="flex gap-2">{listing.days.map((day: string) => (
                <div className="flex " key={day}> {day}</div>
              ))}
              </div>
            </p>
            <p>
              <span className="font-semibold">Gender:</span> {listing.gender}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <span className="font-semibold">Start Time:</span>{" "}
              {listing.startTime}
            </p>
            <p>
              <span className="font-semibold">End Time:</span> {listing.endTime}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Min Age:</span>{" "}
              {listing.minAge}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Max Age</span>{" "}
              {listing.maxAge}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Pre-Requistes</span>{" "}
              {listing.preRequistes}
            </p>
          </div>
        </div>

        <div>
          <p>
            <span className="font-semibold">Description:</span>
          </p>
          <p className="whitespace-pre-line">{listing.description}</p>
        </div>
      </div>
      <Button onClick={handleClick}>Edit</Button>

    </div>
  );
};

export default PreviewPage;
