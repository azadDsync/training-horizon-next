"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { set } from "react-hook-form";

interface ListingData {
  category: string;
  title: string;
  priceMode: string;
  price: string;
  mode: string;
  location: string;
  quantity: string;
  classSize: string;
  startDate: string;
  endDate: string;
  days: string[];
  gender: string;
  startTime: string;
  endTime: string;
  minAge: string;
  maxAge: string;
  preRequistes: string;
  description: string;
}
const initialListingData: ListingData = {
  category: "",
  title: "",
  priceMode: "",
  price: "",
  mode: "",
  location: "",
  quantity: "",
  classSize: "",
  startDate: "",
  endDate: "",
  days: [],
  gender: "",
  startTime: "",
  endTime: "",
  minAge: "",
  maxAge: "",
  preRequistes: "",
  description: "",
};

const Editlisting: React.FC = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingData | null>(null);
  const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ageOptions = [
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18+Adults",
    "55+Seniors",
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3005/api/v1/admin/listing/${id}`
        );
        console.log(res.data.listing);
        if (isMounted) {
          setListing(res.data.listing);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setListing((prevListing) => ({
      ...prevListing!,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setListing((prevListing) => {
      if (!prevListing) return prevListing;

      const updatedDays = checked
        ? [...(prevListing.days || []), value] // Add day if checked
        : prevListing.days.filter((day) => day !== value); // Remove day if unchecked

      return {
        ...prevListing,
        days: updatedDays, // Update the days field
      };
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission, e.g., updating the backend with the new listing details.
    if (listing?.startDate && listing?.endDate) {
      const startDate = new Date(listing.startDate);
      const endDate = new Date(listing.endDate);

      if (startDate >= endDate) {
        window.alert("Start Date must be earlier than End Date");
        return; // Stop the form submission
      }
    }
    if (listing?.startTime && listing?.endTime) {
      const [startHours, startMinutes] = listing.startTime
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = listing.endTime.split(":").map(Number);

      const startTime = new Date();
      startTime.setHours(startHours, startMinutes, 0);

      const endTime = new Date();
      endTime.setHours(endHours, endMinutes, 0);

      if (startTime >= endTime) {
        window.alert("Start Time must be earlier than End Time");
        return; // Stop the form submission
      }
    }
    const updatedListing = {
      ...listing!, // Spread the existing listing details
      days: listing?.days || [], // Ensure days is submitted as an array
    };
    try {
      const response = await axios.put(
        "http://localhost:3005/api/v1/admin/Edit-Listing/" + id.toString(),
        updatedListing,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.statusText);
      if (response.statusText === "OK") {
        setListing(initialListingData);
        window.alert("Listing Updated");
        router.back();
      }
      console.log("Updated Listing:", response.data.listing);
      // Optionally, handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error("Error updating listing:", error);
      // Optionally, handle errors (e.g., show an error message)
    }
  };

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}>
        {/* Category (Dropdown) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <select
            name="category"
            value={listing?.category}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            <option value="Basketball">Basketball</option>
            <option value="Table Tennis">Table Tennis</option>
            <option value="Yoga">Yoga</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={listing?.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* Price Mode (Dropdown) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Price Mode
          </label>
          <select
            name="priceMode"
            value={listing?.priceMode}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            <option value="Per day">Per day</option>
            <option value="Per month">Per month</option>
            <option value="Price course">Price course</option>
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Price
          </label>
          <input
            type="text"
            name="price"
            value={listing?.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* Mode */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Mode
          </label>
          <select
            name="mode"
            value={listing?.mode}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Location / Zoom Link */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {listing?.mode === "Online" ? "Zoom Link" : "Location"}
          </label>
          <input
            type="text"
            name="location"
            value={listing?.location}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Quantity
          </label>
          <input
            type="text"
            name="quantity"
            value={listing?.quantity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* Class Size (Dropdown) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Class Size
          </label>
          <select
            name="classSize"
            value={listing?.classSize}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            <option value="Group">Group</option>
            <option value="1 to 1">1 to 1</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={listing?.startDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={listing?.endDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* Days (Dropdown with Checkboxes) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Days
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={toggleDropdown}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white">
              {listing.days?.length > 0
                ? listing.days.join(", ")
                : "Select Days"}
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 bg-white shadow-md rounded mt-2 w-full">
                {daysOptions.map((day) => (
                  <label
                    key={day}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      value={day}
                      checked={listing.days?.includes(day)} // Check if day is selected
                      onChange={handleCheckboxChange} // Handle checkbox change
                      className="mr-2"
                    />
                    {day}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={listing?.gender}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        {/* Start Time */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Time
          </label>
          <input
            type="time"
            name="startTime"
            value={listing?.startTime}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* End Time */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Time
          </label>
          <input
            type="time"
            name="endTime"
            value={listing?.endTime}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* Age Range */}
        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2">
            Age Group
          </label> */}
          <div className="flex flex-col">
            <div className="flex flex-col mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                MinAge
              </label>
              <select
                name="minAge"
                value={listing?.minAge}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                {ageOptions.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                MaxAge
              </label>
              <select
                name="maxAge"
                value={listing?.maxAge}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                {ageOptions.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* PreRequisites */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            PreRequisites
          </label>
          <textarea
            name="preRequistes"
            value={listing?.preRequistes}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
        </div>

        {/* Description */}
        <div className="mb-4 ">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={listing?.description}
            onChange={handleChange}
            className="shadow appearance-none border h-52  rounded w-full py-2 px-3 text-gray-700"></textarea>
        </div>

        <button
          type="submit"
          className="w-full mt-4  bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Editlisting;
