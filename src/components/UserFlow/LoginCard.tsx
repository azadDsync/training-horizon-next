"use client";
import { useState } from "react";
import { Button } from "@/components/Shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/Shared/ui/card";
import { Input } from "@/components/Shared/ui/input";
import { Label } from "@/components/Shared/ui/label";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import GoogleAuth from "./GoogleAuth";
import Popup from "../trainer-dashboard/PopUp";
import Image from "next/image";

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const fetchUserRole = async (userID: any) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/getUserById/${userID}`
    );
    localStorage.setItem("role", response.data.user.role);
  };

  async function submitForm(endpoint: any) {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
        {
          email,
          password,
        }
      );

      fetchUserRole(res.data._id);
      window.localStorage.setItem("userId", res.data._id);
      window.localStorage.setItem("token", res.data.token);
      window.localStorage.setItem("role", res.data.role);
      router.push("/");
    } catch (err: any) {
      setIsLoading(false);
      if (
        (err.response && err.response.status === 401) ||
        err.response.status === 400
      ) {
        setIsPopUpOpen(true);
        setPopupMessage("Invalid Credentials");
      } else {
        setPopupMessage("Something went wrong!!");
      }
    }
  }

  return (
    <main className="h-screen flex items-center justify-center p-5 sm:p-10 w-full overflow-hidden">
      <div className="flex w-full gap-6 max-w-4xl">
        {/* Image Section */}
        <div className="w-1/3 hidden lg:block">
          <Image
            src="/Logo/MMP.png"
            alt="Login Image"
            width={600}
            height={600}
            className="w-full h-full rounded-l-lg shadow-lg object-cover "
          />
          {/* Welcome Back */}
        </div>

        {/* Form Section */}
        <div>
          <Card className="w-full rounded-l-none sm:w-[480px] h-[600px] mx-auto pt-10 shadow-lg ">
            <CardHeader className="text-center">
              <h2 className="text-2xl text-gray-600 font-bold">Login</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-lg">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>

            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-800"
                onClick={() => submitForm("/user/signin")}
                disabled={isLoading} // Disable the button when loading
              >
                {isLoading ? "Logging in..." : "Login"}{" "}
                {/* Show loading text */}
              </Button>
              <Popup
                message={popupMessage}
                isOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
                redirectTo="/userflow/login"
              />
              <Button
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-800"
                onClick={() => submitForm("/organizations/login")}
                disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login as Organization"}
              </Button>
            </div>

            <CardFooter className="text-center mt-4">
              <div className="flex flex-col justify- w-full sm:w-[350px] mx-auto">
                <div className="text-sm">
                  Don't have an account?{" "}
                  <Link href="/userflow/signup">
                    <span className="text-blue-600 cursor-pointer hover:underline">
                      Sign up!
                    </span>
                  </Link>
                </div>
              </div>
              <div className="text-sm mt-2 sm:mt-0">
                <Link href="/login">
                  <span className="text-blue-600 cursor-pointer hover:underline">
                    Forgot Password?
                  </span>
                </Link>
              </div>
            </CardFooter>
            <div className="flex justify-center">
            <GoogleAuth />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default LoginCard;
