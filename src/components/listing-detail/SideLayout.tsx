"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import React, { useEffect, useState } from "react";
import ReplyToListing from "./ReplyToListing";
import MapWidget from "./MapWidget";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Flag, MessageCircle, ShoppingCart } from "lucide-react";

function SideLayout({
  minAgeLimit,
  maxAgeLimit, 
  listingId,
  trainerPhone,
  listingPrice,
  priceMode
}: {
  minAgeLimit: number;
  maxAgeLimit: number;
  listingId: string;
  trainerPhone: string;
  listingPrice: string;
  priceMode: string;
}) {
  const [name, setName] = useState("user");
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useSelector((state: RootState) => state.form);
  const tabs = ["Overview", "Instructors", "Curriculum", "Reviews", "FAQs"];

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/username`,
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        );
        setName(res.data.user);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/allmembers`,
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        );
        setMembers(res.data.familyMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    const fetchListing = async () => {

    }

    fetchUserName();
    fetchMembers();
  }, []);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    const userId = window.localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to use this feature");
      router.push("/userflow/login");
      return;
    }
    e.preventDefault();
    closePopup();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/review/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listingId, name, review, rating, date: new Date() }),
    });
    
    if (response.ok) {
      alert("Review submitted!");
      setName("");
      setReview("");
      setRating(5);
      router.refresh();
    } else {
      alert("Error submitting review.");
    }
  };

  // Function to handle Add to Cart using the backend API
  const handleAddToCart = async () => {
    if (selectedMembers.length > 0) {
      // Build arrays for the new cart pairs. Since listingId is constant, repeat it for each selected member.
      const listings = selectedMembers.map(() => listingId);
      const membersArr = selectedMembers;
      
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/cart`,
          { listings, members: membersArr },
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        );
        // Optionally, you can trigger a cart-updated event if other components rely on it
        window.dispatchEvent(new Event("cart-updated"));
        router.push(`/userflow/cart`);
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Error adding to cart.");
      }
    }
  };

  const handleCheckboxChange = (memberId: string) => {
    setSelectedMembers((prevSelectedMembers) => {
      if (prevSelectedMembers.includes(memberId)) {
        return prevSelectedMembers.filter((id) => id !== memberId);
      } else {
        return [...prevSelectedMembers, memberId];
      }
    });
  };

  console.log(JSON.stringify(members[0]));

  return (
    <>
      {/* Right Section: Class Details */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 mx-auto border border-gray-200">
      {/* <ReplyToListing /> */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Price : ${listingPrice} {priceMode}</h3>
        </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Members:</h3>
      
        {members
          .filter((member) => member.age >= minAgeLimit && member.age <= maxAgeLimit)
          .map((member) => (
            <label key={member._id} className="flex items-center space-x-3 mb-2">
              <input
                type="checkbox"
                value={member._id}
                checked={selectedMembers.includes(member._id)}
                onChange={() =>
                  setSelectedMembers((prev) =>
                    prev.includes(member._id)
                      ? prev.filter((id) => id !== member._id)
                      : [...prev, member._id]
                  )
                }
                className="rounded text-blue-500 focus:ring focus:ring-blue-300"
              />
              <span className="text-gray-700">{member.name}</span>
            </label>
          ))}
            <p className="text-sm text-gray-600 mb-2">
  Note: Only eligible members within the age range of {minAgeLimit} to {maxAgeLimit} can enroll in this listing
</p>

      </div>

      <button
        onClick={handleAddToCart}
        disabled={selectedMembers.length === 0}
        className={`w-full py-2 flex items-center justify-center rounded-lg text-white transition ${
          selectedMembers.length > 0 ? "bg-blue-600 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <ShoppingCart size={20} className="mr-2" /> Add To Cart
      </button>

      {trainerPhone && (
        <Link
          href={`https://wa.me/${trainerPhone}`}
          className=" bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 mt-4 text-center flex items-center justify-center space-x-2"
        >
          <MessageCircle size={20} />
          <span>Chat on WhatsApp</span>
        </Link>
      )}

      <div className="mt-4 bg-gray-100 p-3 rounded-lg flex flex-col space-y-2">
        <button onClick={() => setIsOpen(true)} className="flex items-center text-gray-600 hover:text-gray-800">
          <Star size={18} className="mr-2" /> Write a Review
        </button>
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          <Flag size={18} className="mr-2" /> Report Listing
        </button>
      </div>

      <MapWidget />

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">Send a Feedback</h2>
            <textarea
              onChange={(e) => setReview(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              rows={6}
              placeholder="Type your message here..."
              required
            ></textarea>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} Star{star > 1 && "s"}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 hover:bg-blue-600 text-white rounded-md">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default SideLayout;
