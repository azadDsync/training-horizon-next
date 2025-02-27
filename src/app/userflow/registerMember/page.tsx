"use client";

import React, { useState } from "react";
import Navbar from "@/components/UserFlow/NavBar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Popup from "@/components/trainer-dashboard/PopUp";

// Schema
const registerMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.string().refine(
    (date) => {
      const dob = new Date(date);
      const today = new Date();
      return !isNaN(dob.getTime()) && dob <= today;
    },
    { message: "Invalid date of birth" }
  ),
  age: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().int().min(0, "Age must be greater than 0")
  ),
  relationship: z.enum(["brother", "sister", "child", "father", "mother"], {
    errorMap: () => ({ message: "Select a valid relationship" }),
  }),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Select a valid gender" }),
  }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  doctorName: z.string().optional(),
  doctorNumber: z.string().optional(),
  bloodGroup: z.string().optional(),
});

const RegisterMemberForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(registerMemberSchema),
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [age, setAge] = useState<number | null>(null);

  const calculateAge = (dob: string) => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }

    setAge(calculatedAge >= 0 ? calculatedAge : null);
    setValue("age", calculatedAge, { shouldValidate: true });
  };

  const onSubmit = async (data: any) => {
    console.log("Form submitted! Data:", data);

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (!token) {
      setPopUpMessage("User is not authenticated.");
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/registerMember`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);
      setPopUpMessage("Member registered successfully");
      setShowPopup(true);
      reset();
    } catch (error: any) {
      console.error(
        "Error registering member:",
        error.response ? error.response.data : error.message
      );
      setPopUpMessage(
        error.response?.data?.message || "Error registering member"
      );
      setShowPopup(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 border border-gray-600 my-10 rounded-lg">
        <h2 className="text-3xl p-1.5 font-bold text-blue-600 text-center">
          Register <span className="text-gray-600">Family Member</span>
        </h2>
        <form
          onSubmit={handleSubmit(
            (data) => {
              console.log("handleSubmit triggered, form data:", data);
              onSubmit(data);
            },
            (errors) => {
              console.log("Validation failed:", errors);
            }
          )}
          className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name")}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter member's name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name?.message as string}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              {...register("dob")}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
                errors.dob ? "border-red-500" : "border-gray-600"
              }`}
              onChange={(e) => {
                const dobValue = e.target.value;
                setValue("dob", dobValue);
                calculateAge(dobValue);
              }}
            />
            {errors.dob && (
              <p className="text-red-500 text-sm">
                {errors.dob?.message as string}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              value={age !== null ? age : ""}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-100"
              readOnly
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              {...register("gender")}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
                errors.gender ? "border-red-500" : "border-gray-600"
              }`}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">
                {errors.gender?.message as string}
              </p>
            )}
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Relationship
            </label>
            <select
              {...register("relationship")}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
                errors.relationship ? "border-red-500" : "border-gray-600"
              }`}>
              <option value="">Select relationship</option>
              <option value="brother">Brother</option>
              <option value="brother">Sister</option>
              <option value="child">Child</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
            </select>
            {errors.relationship && (
              <p className="text-red-500 text-sm">
                {errors.relationship?.message as string}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              {...register("address")}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
                errors.address ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">
                {errors.address?.message as string}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              {...register("city")}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
                errors.city ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">
                {errors.city?.message as string}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              {...register("postalCode")}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg ${
                errors.postalCode ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter postal code"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm">
                {errors.postalCode?.message as string}
              </p>
            )}
          </div>

          {/* Doctor's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Doctor's Name (Optional)
            </label>
            <input
              {...register("doctorName")}
              className="mt-1 block w-full px-4 py-2 rounded-lg  shadow-sm border border-gray-600"
              placeholder="Enter doctor's name"
            />
          </div>

          {/* Doctor's Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Doctor's Number (Optional)
            </label>
            <input
              type="tel"
              {...register("doctorNumber")}
              className="mt-1 block w-full px-4 py-2  rounded-lg shadow-sm border border-gray-600"
              placeholder="Enter doctor's number"
            />
          </div>

          {/* Agree to Terms */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("agreeToTerms")}
                className="mr-2"
              />
              I agree to the terms and conditions
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm">
                {errors.agreeToTerms?.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-2 px-4 transition duration-150 rounded-lg ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          <Popup
            message={popUpMessage}
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            redirectTo="/"
          />
        </form>
      </div>
    </div>
  );
};

export default RegisterMemberForm;
