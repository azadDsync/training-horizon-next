// pages/order.tsx
"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/UserFlow/NavBar";
import Footer from "@/components/UserFlow/Footer";
import Link from "next/link";

type OrderDetails = {
  _id: number;
  createdAt: string;
  status: "ON HOLD" | "FAILED" | "COMPLETED";
  title: string;
  price: string;
  total: string;
  listingId: string;
  memberId: string;
  paymentMethod: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
};

interface Root {
  message: string;
  order: Order;
}

interface Order {
  price: Price;
  _id: string;
  user: User;
  members: Member[];
  listings: Listing[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Price {
  subtotal: number;
  tax: number;
  shipping: number;
  totalPrice: number;
}

interface User {
  cart: Cart;
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  familyMembers: string[];
  __v: number;
  favorites: string[];
  orders: string[];
}

interface Cart {
  listings: any[];
  members: any[];
}

interface Member {
  _id: string;
  name: string;
  age: number;
  dob: string;
  relationship: string;
  gender: string;
  address: string;
  city: string;
  postalCode: string;
  agreeToTerms: boolean;
  doctorName: string;
  doctorNumber: string;
  __v: number;
}

interface Listing {
  _id: string;
  trainerId: string;
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
  days: string[];
  gender: string;
  startTime: string;
  endTime: string;
  minAge: string;
  maxAge: string;
  preRequistes: string;
  description: string;
  avgRating: number;
  isApproved: boolean;
  reviews: any[];
  __v: number;
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrders = async (id: string) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/order/getOrderDetailsByOrderId/` +
            id.toString()
        );

        setOrder(response.data.order);
      } catch (err: any) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(id);
  }, [id]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        {/* Order Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Order #{order?._id}</h1>
          <p className="text-gray-500">
            Placed on{" "}
            {order?.createdAt ? formatDate(order.createdAt) : "Unknown date"}
          </p>
        </div>

        {/* Listings Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <table className="min-w-full text-left table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Listing Title</th>
                <th className="py-2 px-4 border">Member</th>
                <th className="py-2 px-4 border">Price</th>
              </tr>
            </thead>
            <tbody>
              {order?.listings.map((listing, index) => (
                <tr key={`${listing._id}-${index}`} className="border-t">
                  <td className="py-2 px-4 border">{listing.title}</td>
                  <td className="py-2 px-4 border">
                    {order.members[index]?.name || "N/A"}
                  </td>
                  <td className="py-2 px-4 border">${listing.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <table className="min-w-full text-left table-auto">
            <tbody>
              <tr>
                <td className="py-2 px-4 font-bold">Subtotal:</td>
                <td className="py-2 px-4">
                  $
                  {order?.price?.subtotal !== undefined
                    ? `${order.price.subtotal.toFixed(2)}`
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-bold">Service Fee</td>
                <td className="py-2 px-4">
                  {order?.price?.shipping !== undefined
                    ? `$${order.price.shipping.toFixed(2)}`
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-bold">Tax:</td>
                <td className="py-2 px-4">
                  {order?.price?.tax !== undefined
                    ? `$${order.price.tax.toFixed(2)}`
                    : "N/A"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4 font-bold">Total:</td>
                <td className="py-2 px-4 font-bold">
                  {order?.price?.totalPrice !== undefined
                    ? `$${order.price.totalPrice.toFixed(2)}`
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetailPage;
