"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import Popup from "./PopUp";
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { Textarea } from "./ui/textarea";
import Link from "next/link";
import UploadImage from "../UserFlow/UploadImage";

export function TrainerForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const formSchema = z.object({
    fname: z.string().min(3, {
      message: "Enter at least 3 characters",
    }),
    lname: z.string().min(3, {
      message: "Enter at least 3 characters",
    }),
    qualifications: z.string().min(1, {
      message: "Please enter your qualifications",
    }),
    linkedin: z.string().url({
      message: "Please enter a valid LinkedIn profile URL",
    }),
    experience: z.string().min(1, {
      message: "Please enter your experience",
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
    availability: z.array(z.string()).optional(),
    password: z.string().min(1, {
      message: "Please enter a valid password",
    }),
    about: z.string().min(100, {
      message: "Minimum length required is 100",
    }),
    workHistory: z.string().min(100, {
      message: "Minimum length required is 100",
    }),
    educationDetail: z.string().min(50, {
      message: "Minimum length required is 50",
    })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: "",
      lname: "",
      qualifications: "",
      linkedin: "",
      experience: "",
      email: "",
      phone: "",
      address: "",
      availability: [],
      password: "",
      about: "",
      workHistory: "",
      educationDetail: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        email: values.email,
        firstName: values.fname,
        lastName: values.lname,
        password: values.password,
        role: "trainer" // Hardcoding role as 'trainer'
      };
      const userResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/signup`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const userId = userResponse.data._id;
      const trainerPayload = {
        _id: userId, // Set _id to be the same as the user _id
        fname: values.fname,
        lname: values.lname,
        qualifications: values.qualifications,
        linkedin: values.linkedin,
        experience: values.experience,
        email: values.email,
        phone: values.phone,
        address: values.address,
        availability: values.availability,
        password: values.password, // Optional: If you need to store password in Trainer too
        about: values.about,
        workHistory: values.workHistory,
        educationDetail: values.educationDetail,
        imageUrl
      };


      console.log(trainerPayload);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/trainers/signup`, trainerPayload);


      console.log(userResponse.data);
      console.log("Trainer added" + response.data)
      setPopupMessage("Trainer added successfully!");
      setPopupVisible(true);
    }
    catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        setPopupMessage("Trainer already exists!");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="flex gap-4 w-full flex-wrap">
            <div className="flex flex-col w-full gap-4">
              <div className="flex gap-4 w-full max-sm:flex-col">
                <div className="w-1/2 max-sm:w-full">
                  <FormField name="fname" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg" >First Name</FormLabel >
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="w-1/2 max-sm:w-full">
                  <FormField name="lname" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg" >Last Name</FormLabel >
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
              <div className="w-full">
                <UploadImage imageUrl={imageUrl} setImageUrl={setImageUrl} />
              </div>

              <div>
                <FormField name="qualifications" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg" >Qualifications</FormLabel >
                    <FormControl>
                      <Input placeholder="Qualification" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div>
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg" >Email Address</FormLabel >
                    <FormControl>
                      <Input placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div>
                <FormField name="password" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg" >Password</FormLabel >
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div>
                <FormField name="phone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg" >Mobile Number</FormLabel >
                    <FormControl>
                      <Input type="tel" placeholder="Enter your mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">

              <div>
                <FormField name="experience" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg" >Teaching Experience</FormLabel >
                    <FormControl>
                      <Input type="number" placeholder="Enter experience in years" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div>
                <FormField name="linkedin" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg" >LinkedIn Profile</FormLabel >
                    <FormControl>
                      <Input placeholder="Enter LinkedIn profile link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div>
                <FormField name="address" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg" >Address</FormLabel >
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <FormField name="about" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg" >About</FormLabel >
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div>
              <FormField name="workHistory" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg" >Your Work History</FormLabel >
                  <FormControl>
                    <Textarea placeholder="Share your work history..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div>
              <FormField name="educationDetail" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg" >Education Details</FormLabel >
                  <FormControl>
                    <Textarea placeholder="Enter your Education Details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <div className="flex justify-between py-4">
            <Link href="/">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit">Submit Details</Button>
          </div>
        </form>
      </Form>

    </div>
  );
}
