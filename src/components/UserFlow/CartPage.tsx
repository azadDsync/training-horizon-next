"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ListingDetails = {
  _id: string;
  listingId: string;
  trainerId: string;
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
  isApproved: boolean;
};

type MemberDetails = {
  _id: string;
  memberId: string;
  name: string;
  age: number;
  relationship: string;
  gender: string;
};

type CartItem = {
  listing: ListingDetails;
  member: MemberDetails;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/cart`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        // Expected response: { cart: [ { listing: {...}, member: {...} }, ... ] }
        setCartItems(response.data.cart);
        setCartCount(response.data.cart.length);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Error fetching cart. Please try again later.");
      }
    };
    fetchCart();
  }, []);

  const handleDeleteItem = async (itemToDelete: CartItem) => {
    try {
      const token = localStorage.getItem("token");
      await axios.request({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/cart`,
        method: "delete",
        data: {
          listingId: itemToDelete.listing.listingId || itemToDelete.listing._id,
          memberId: itemToDelete.member.memberId || itemToDelete.member._id,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(
              (item.listing.listingId || item.listing._id) ===
                (itemToDelete.listing.listingId || itemToDelete.listing._id) &&
              (item.member.memberId || item.member._id) ===
                (itemToDelete.member.memberId || itemToDelete.member._id)
            )
        )
      );
      setCartCount((prev) => prev - 1);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Error deleting cart item:", error);
      setError("Error deleting cart item. Please try again later.");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.listing.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);
  const tax = subtotal * 0.18;
  const cost = 10;
  const total = subtotal + tax + cost;

  // Create a new order, add the orderID to user's orders array, then clear the cart.
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      alert("User is not signed in.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Cart is empty. Add items before checking out.");
      return;
    }

    // Build order data based on your order schema.
    const orderData = {
      members: cartItems.map((item) => item.member._id || item.member.memberId),
      listings: cartItems.map((item) => item.listing._id || item.listing.listingId),
      price: {
        subtotal,
        tax,
        shipping: cost,
        totalPrice: total,
      },
    };

    try {
      setLoading(true);
      // Create new order
      const orderResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/checkout`,
        orderData,
        { headers: { Authorization: "Bearer " + token } }
      );
      if (orderResponse.status === 201) {
        // Extract the new order's ID.
        const newOrderId = orderResponse.data._id;
        // Update user's orders array
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/orders`,
          { orderId: newOrderId },
          { headers: { Authorization: "Bearer " + token } }
        );
        // Clear the cart on the server.
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/user/cart/clear`, {
          headers: { Authorization: "Bearer " + token },
        });
        // Update local state.
        setCartItems([]);
        setCartCount(0);
        window.dispatchEvent(new Event("cart-updated"));
        // Redirect to the new order details page.
        router.push(`/userflow/orderdetails/${newOrderId}`);
      }
    } catch (error: any) {
      console.error("Error creating order:", error.response?.data || error);
      alert("Error creating order.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">
          Your cart is empty. Add items to proceed to checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-6 mx-auto p-6 max-w-6xl">
      {/* Product Details Section */}
      <div className="w-full lg:w-2/3 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold p-4 border-b">My Cart</h2>
        {cartItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-6 border-b last:border-none"
          >
            {/* <Image
              src={"/img/p1.svg"}
              alt={item.listing.title}
              height={32}
              width={32}
              className="w-32 h-32 p-2 object-cover border rounded-md"
            /> */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.listing.title}</h3>
              <p className="text-gray-600">Size: {item.listing.classSize}</p>
              <p className="hidden lg:block text-gray-600">
                Item No: {item.listing._id}
              </p>
              <p className="text-sm font-semibold text-orange-700 mt-2">
                Price: ${item.listing.price}
              </p>
              <div className="mt-4">
                <p className="text-gray-600">Learner: {item.member.name}</p>
                <p className="text-gray-600">Age: {item.member.age}</p>
                <p className="text-gray-600">
                  Relationship: {item.member.relationship}
                </p>
              </div>
              <button
                onClick={() => handleDeleteItem(item)}
                className="mt-4 px-4 py-2 text-sm border rounded-md text-red-500 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Price Details Section */}
      <div className="w-full lg:w-1/3 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold p-4 border-b">Price Details</h2>
        <div className="p-4 space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between py-2">
              <div>
                <span className="font-semibold">{item.listing.title}</span>
                <br />
                <span className="text-gray-500">
                  Learner: {item.member.name}
                </span>
              </div>
              <span>${item.listing.price}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (18%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${cost.toFixed(2)}</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
