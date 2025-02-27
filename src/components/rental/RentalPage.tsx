"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchSection from "../UserFlow/SearchSection";
import RentalCard from "./RentalCard";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Availability {
  days: string[];
}

interface Pricing {
  dailyRate: number;
  hourlyRate: number;
}

interface Rentals {
  _id: string;
  name: string;
  email: string;
  address: Address;
  availability: Availability;
  pricing: Pricing;
  ratings: number;
  amenities: string[];
  timeSlots: string[];
  images: string[];
  reviews: string[];
}

const RentalPage: React.FC<{
  categoryName: string;
  subCategoryName: string;
}> = ({ categoryName, subCategoryName }) => {
  const [listings, setListings] = useState<Rentals[]>([]);
  const [keywords, setKeywords] = useState<string>("");
  const [filteredListings, setFilteredListings] = useState<Rentals[]>([]);

  const handleSearch = () => {
    setFilteredListings(
      listings.filter((listing) =>
        listing.name.toLowerCase().includes(keywords.toLowerCase())
      )
    );
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/rentals`
        );
        setListings(data.rentals);
        setFilteredListings(data.rentals);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };

    fetchRentals();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto">
          <SearchSection
            keywords={keywords}
            setKeywords={setKeywords}
            onSearch={handleSearch}
          />
        </div>
      </header>

      <div className="container mx-auto flex flex-1 px-4">
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing, idx) => (
              <RentalCard
                key={idx}
                rentalId={listing._id}
                name={listing.name}
                email={listing.email}
                address={`${listing.address.street}, ${listing.address.city}, ${listing.address.state}`}
                availability={listing.availability.days.join(", ") || "Not Available"}
                pricing={`₹${listing.pricing.dailyRate}/day, ₹${listing.pricing.hourlyRate}/hour`}
                ratings={listing.ratings}
                amenities={listing.amenities.join(", ")}
                timeSlots={listing.timeSlots.join(", ")}
                images={listing.images}
                reviews={listing.reviews}
                subCategoryName={subCategoryName}
                categoryName={categoryName}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No listings found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default RentalPage;
