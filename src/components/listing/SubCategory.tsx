"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import FilterSidebar from "./FilterSideBar";
import ListingCard from "./ListingCard";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchSection from "../UserFlow/SearchSection";
import { Card, CardContent } from "../ui/card";

const SubCategory: React.FC<{ categoryName: string }> = ({ categoryName }) => {
  const router = useRouter();
  const [getCategory, setCategory] = useState([]);
  const [keywords, setKeywords] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  //   const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/category/${categoryName}`)
      .then((res) => {
        setCategory(res.data);
      });
  }, [categoryName]);

  //   const handleSearch = () => {
  //     const filtered = listings.filter((listing) => {
  //       const matchesKeywords =
  //         keywords === "" ||
  //         listing.title.toLowerCase().includes(keywords.toLowerCase());
  //       // const matchesLocation = location === '' || listing.location.toLowerCase().includes(location.toLowerCase());
  //       // return matchesKeywords && matchesLocation;
  //       return matchesKeywords;
  //     });

  //     setFilteredListings(filtered);
  //   };

  //   const handleFilter = () => {
  //     const filtered = listings.filter((listing) => {
  //       const matchesCategory =
  //         selectedCategories.length === 0 ||
  //         selectedCategories.includes(listing.category);
  //       return matchesCategory;
  //     });

  //     setFilteredListings(filtered);
  //   };
  // console.log(listings[0].trainerId);



  const handleSearch = () => {

  }

  return (
    <>
      <div>{/* <h1>{listings[0].trainerId}</h1> */}</div>
      <div className="flex flex-col items-center min-h-screen bg-background">
        <div className="w-full max-w-[1296px] px-4  space-y-6">
          <SearchSection
            keywords={keywords}
            setKeywords={setKeywords}
            onSearch={handleSearch}
          />

          <h2 className="text-5xl font-bold text-center">
            Sub <span className="text-blue-500">Category</span>
          </h2>

          {/* Filters
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Select>
              <SelectTrigger className="w-full h-[32px]">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <SelectValue placeholder="Music" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Music</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="classical">Classical</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className=" w-full h-[32px]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <SelectValue placeholder="Chicago" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chicago">Chicago</SelectItem>
                <SelectItem value="newyork">New York</SelectItem>
                <SelectItem value="losangeles">Los Angeles</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className=" w-full h-[32px]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <SelectValue placeholder="Date" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="thisweek">This Week</SelectItem>
                <SelectItem value="thismonth">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className=" w-full h-[32px]">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <SelectValue placeholder="Price" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="under50">Under $50</SelectItem>
                <SelectItem value="under100">Under $100</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getCategory.length > 0 ? (
              getCategory.map((subCategory, idx) => (
                <Card
                  key={idx}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:-translate-y-2"
                  onClick={() => {
                    router.push(`/${categoryName}/${subCategory}`);
                  }}
                >
                  <img
                    src={`/img/new/${subCategory}.jpg`}
                    alt={"abc"}
                    className="w-full h-[300px] object-cover rounded-t-lg"
                  />
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold">{subCategory}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No listings found.</p>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default SubCategory;
