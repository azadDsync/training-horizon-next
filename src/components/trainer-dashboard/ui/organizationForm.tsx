"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Popup from "../PopUp";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/trainer-dashboard/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/trainer-dashboard/ui/form";
import { Input } from "@/components/trainer-dashboard/ui/input";
import Link from "next/link";
import UploadImage from "@/components/UserFlow/UploadImage";

// Schema definition with custom password confirmation validation
const formSchema = z
  .object({
    orgname: z.string().min(3, {
      message: "Enter at least 3 characters",
    }),
    linkedin: z.string().url({
      message: "Please enter a valid LinkedIn profile URL",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    phone: z.string().min(10, {
      message: "Please enter a valid phone number",
    }),
    address: z.string().min(1, {
      message: "Please enter your address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Field to apply the error
  });

export function OrganizationForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgname: "",
      linkedin: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/organizations/signup`, values);
      console.log("Organization added" + JSON.stringify(response.data));
      setPopupMessage("Organization added successfully!");
      setPopupVisible(true);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        setPopupMessage("Organization already exists!");
      } else {
        setPopupMessage("An error occurred. Please try again.");
      }
      setPopupVisible(true);
    }
  }

  return (
    <div>
      <Popup
        message={popupMessage}
        isOpen={popupVisible}
        onClose={() => setPopupVisible(false)}
        redirectTo="/"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-1">
          <div className="grid grid-cols-1 w-full gap-2 max-[769px]:grid-cols-1">

            <div>
              <FormField
                name="orgname"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-lg">Name of the Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name of the organization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full">
              <UploadImage imageUrl={imageUrl} setImageUrl={setImageUrl} />
            </div>

            <div>
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password again"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Mobile Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter your mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                name="linkedin"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your LinkedIn profile link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between py-4">
            <Link href="/">
              <Button variant={"outline"} type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Submit Details</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
