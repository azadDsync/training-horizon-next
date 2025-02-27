"use client";

import CartIcon from "@/app/icons/CartIcon";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const UserDashboard = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [isOrg, setIsOrg] = useState(false);
  // const [istrainers, setIsTrainers] = useState(false);
  const router = useRouter();
  const userId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("userId")
      : null;

  // Check if user is organization
  useEffect(() => {
    if (typeof window === "undefined") return;
    const role = localStorage.getItem("role");
    setIsOrg(role === "organization");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found, skipping fetchUserName.");
      return;
    }
  
    const fetchUserName = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/username`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setUserName(response.data.user);
      } catch (err: any) {
        if (err.response && err.response.status === 403) {
          console.error("Access forbidden (403). Token may be invalid or expired.");
          // Optionally, sign the user out:
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          // Redirect to login page if needed:
          // router.push('/userflow/login');
        } else {
          console.error("Error fetching username:", err);
        }
      }
    };
  
    fetchUserName();
  }, []);
  

  // useEffect(() => {
  //   if (!userId) return; // Prevents unnecessary API call if userId is null

  //   const fetchTrainers = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_BASE_URL}/trainers/${userId}`
  //       );
  //       const data = await response.json();
  //       // console.log(data);
  //       // console.log("hey ");
  //       if(data.success){
  //         setIsTrainers(true);
  //       } // Update state based on API response
  //     } catch (error) {
  //       console.error("Error fetching trainers:", error);
  //     }
  //   };

  //   fetchTrainers();
  // }, [userId]);

  // Organization ID from localStorage
  const orgId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("userId")
      : null;

  // Fetch organization name on component mount
  useEffect(() => {
    const fetchOrgName = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/organizations/${userId}`
        );
        setUserName(response.data.orgname);

      } catch (error) {
        console.log("Error finding OrgId");
      }
    };
    if (isOrg) fetchOrgName();
  }, [isOrg, userId]);

// Fetch cart items from the backend
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found, skipping cart fetch.");
    return;
  }

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/cart`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      // Assuming response.data.cart is an array of paired cart items.
      setCartItems(response.data.cart.length);
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        console.error("Access forbidden (403). Token may be invalid or expired.");
        // Optionally, sign the user out or redirect to login.
      } else {
        console.error("Error fetching cart:", error);
      }
    }
  };

  fetchCart();

  const handleCartUpdated = () => {
    fetchCart();
  };

  window.addEventListener("cart-updated", handleCartUpdated);
  return () => {
    window.removeEventListener("cart-updated", handleCartUpdated);
  };
}, []);


  const goToFavorites = () => {
    router.push("/favorites");
  };

  const handleSignOut = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload();
    router.push("/");
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="relative inline-block text-left flex flex-row items-center space-x-4">
        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              {userName || "Loading..."}
            </span>
            <img
              src="/img/new/user.jpg" // this should come from s3 
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {!isOrg ? (
              <>
                <DropdownMenuItem asChild className="py-3">
                  <Link href="/userflow/yourProfile">DashBoard</Link>
                </DropdownMenuItem>
                {/* {istrainers && (
                  <DropdownMenuItem asChild className="py-3">
                    <Link href={`/trainer/show_my_listings/${userId}`}>Listing</Link>
                  </DropdownMenuItem>
                )} */}
                <DropdownMenuItem className="py-3" onClick={goToFavorites}>
                  Favorites
                </DropdownMenuItem>
                {/* Removed orders dropdown */}
                {/* <DropdownMenuItem asChild className="py-3">
                  <Link href={`/userflow/orders`}>Orders</Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild className="py-3">
                  <Link href="/userflow/registerMember">Register Member</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-3">
                  <Link href="/userflow/familyMembers">Family Members</Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild className="py-3">
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem> */}
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/trainer/show_my_listings/${userId}`}>
                    My Listings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create-gym">Create a Gym</Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={handleSignOut}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cart Icon */}
        <Link className="relative hidden sm:block" href="/userflow/cart">
          <ShoppingCart className="h-6 w-6 text-gray-700" />
          {cartItems > 0 && (
            <span className="absolute -top-2 -right-4 bg-blue-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems}
            </span>
          )}
        </Link>
      </div>
    </>
  );
};

export default UserDashboard;
