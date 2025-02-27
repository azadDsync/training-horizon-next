"use client";

import React from "react";
import { useForm, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/UserFlow/NavBar";

const amenitiesList = [
  "WiFi",
  "Parking",
  "Air Conditioning",
  "Swimming Pool",
  "Gym",
  "Pet Friendly",
  "TV",
  "Kitchen",
  "Laundry",
];

const rentalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip Code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  amenities: z.array(z.string()).optional(), // Stores selected amenities
  pricing: z.object({
    dailyRate: z.number().min(1, "Daily rate is required"),
    hourlyRate: z.number().min(1, "Hourly rate is required"),
  }),
  email: z.string().email("Enter a valid email"),
});

interface FormValues {
  name: string;
  category: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  amenities: string[];
  pricing: {
    dailyRate: number;
    hourlyRate: number;
  };
  email: string;
}

const RentalForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      name: "",
      category: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      amenities: [],
      pricing: { dailyRate: 0, hourlyRate: 0 },
      email: "",
    },
  });

  const selectedAmenities = watch("amenities", []);

  // Handle checkbox selection
  const handleAmenityToggle = (amenity: string, setValue: UseFormSetValue<FormValues>) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((item: string) => item !== amenity)
      : [...selectedAmenities, amenity];

    setValue("amenities", updatedAmenities);
  };

  // Form submission
  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/create-rental`,
        data
      );
      console.log("rental Data: ", data);
      alert("Rental submitted successfully!");
    } catch (error) {
      console.error("Error submitting rental:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Rental</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label>Rental Name</Label>
            <Input {...register("name")} placeholder="Enter rental name" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Input {...register("category")} placeholder="Enter category" />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Street</Label>
              <Input {...register("address.street")} placeholder="Enter Street" />
              {errors.address?.street && (
                <p className="text-red-500 text-sm">{errors.address.street.message}</p>
              )}
            </div>

            <div>
              <Label>City</Label>
              <Input {...register("address.city")} placeholder="Enter City" />
              {errors.address?.city && (
                <p className="text-red-500 text-sm">{errors.address.city.message}</p>
              )}
            </div>

            <div>
              <Label>State</Label>
              <Input {...register("address.state")} placeholder="Enter State" />
              {errors.address?.state && (
                <p className="text-red-500 text-sm">{errors.address.state.message}</p>
              )}
            </div>

            <div>
              <Label>Zip Code</Label>
              <Input {...register("address.zipCode")} placeholder="Enter Zip Code" />
              {errors.address?.zipCode && (
                <p className="text-red-500 text-sm">{errors.address.zipCode.message}</p>
              )}
            </div>

            <div>
              <Label>Country</Label>
              <Input {...register("address.country")} placeholder="Enter Country" />
              {errors.address?.country && (
                <p className="text-red-500 text-sm">{errors.address.country.message}</p>
              )}
            </div>
          </div>

          {/* Amenities Checkboxes */}
          <div>
            <Label>Select Amenities</Label>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity, setValue)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Daily Rate</Label>
              <Input
                type="number"
                {...register("pricing.dailyRate", { valueAsNumber: true })}
              />
              {errors.pricing?.dailyRate && (
                <p className="text-red-500 text-sm">{errors.pricing.dailyRate.message}</p>
              )}
            </div>
            <div>
              <Label>Hourly Rate</Label>
              <Input
                type="number"
                {...register("pricing.hourlyRate", { valueAsNumber: true })}
              />
              {errors.pricing?.hourlyRate && (
                <p className="text-red-500 text-sm">{errors.pricing.hourlyRate.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input {...register("email")} placeholder="Enter email" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Submit Rental
          </Button>
        </form>
      </div>
    </>
  );
};

export default RentalForm;
