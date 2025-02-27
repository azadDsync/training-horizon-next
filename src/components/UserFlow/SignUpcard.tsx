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
import { z } from "zod";
import GoogleAuth from "./GoogleAuth";
import Image from "next/image"; // Importing Image from next/image

// Zod validation schema with password confirmation
const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Attach the error to the confirmation field
    message: "Passwords must match",
  });

function SignUpCard() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateInputs = () => {
    try {
      signUpSchema.parse({
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
      });
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        // Map errors to a key-value object
        const fieldErrors: Record<string, string> = {};
        e.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const submitForm = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/signup`,
        { email, firstName, lastName, password }
      );
      window.localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrors({ submit: error.response?.data?.message || 'Signup failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center p-4 md:p-10 w-full">
      <div className="flex w-full max-w-4xl">
        {/* Image Div */}
        <div className="w-1/2 hidden mr-1 lg:block">
          <Image
            src="/img/new/image.png"
            alt="Signup Image"
            width={600}
            height={600}
            className="w-full h-full object-cover shadow-lg rounded-l-lg"
          />
        </div>

        {/* Form Section */}
        <Card className="w-full lg:w-1/2 rounded-l-none max-w-[600px] h-auto p-6 shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-600 text-center">
              Create your <span className="text-blue-600">account</span>
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="First Name" className="text-sm">
                  First Name
                </Label>
                <Input
                  type="text"
                  id="First Name"
                  placeholder="ex. Narendra"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Last Name" className="text-sm">
                  Last Name
                </Label>
                <Input
                  type="text"
                  id="Last Name"
                  placeholder="ex. Modi"
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <div className="flex justify-center">
            <Button
              className="mt-4 w-full max-w-[500px] bg-blue-600 text-white hover:bg-blue-900"
              onClick={() => {
                setIsLoading(true);
                submitForm();
              }}
              disabled={isLoading}>
              {isLoading ? "Creating Account...." : "Create Account"}
            </Button>
          </div>
          <CardFooter className="text-center mt-4">
            <div className="text-sm">
              Already have an account?{" "}
              <Link href="/userflow/login">
                <span className="text-blue-600 cursor-pointer hover:underline">
                  Login here!
                </span>
              </Link>
            </div>
          </CardFooter>
          <GoogleAuth />
        </Card>
      </div>
    </main>
  );
}

export default SignUpCard;
