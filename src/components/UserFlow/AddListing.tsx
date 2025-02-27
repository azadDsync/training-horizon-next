"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import { useRef } from "react";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/trainer-dashboard/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../trainer-dashboard/ui/dialog";
import { MultiSelect } from "./MultiSelect";
import Popup from "../trainer-dashboard/PopUp";
import SubCategory from "../listing/SubCategory";
import UploadImage from "./UploadImage";

const libs: Library[] = ["places"];

interface Listing {
  _id: string;
  category: string;
  subCategory: string[];
}

export function AddListing() {
  const formSchema = z.object({
    category: z.string(),
    subCategory: z.string(),
    title: z.string(),
    priceMode: z.string(),
    price: z.string(),
    mode: z.string(),
    location: z.string(),
    quantity: z.string().optional(),
    classSize: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    days: z.array(z.string()),
    gender: z.string(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    minAge: z.string(),
    maxAge: z.string(),
    preRequistes: z.string(),
    description: z.string().min(100, {
      message: "Enter atleast 100 characters",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: "",
      startTime: "",
      endTime: "",
    },
  });

  // const categories = ["Basketball", "Table Tennis", "Yoga", "Other"] as const;
  const gender = ["Boys & Girls", "Boys Only", "Girls Only"] as const;
  const agegroup = [
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18+Adults",
    "55+Senior",
  ] as const;
  const mode = ["Offline", "Online"] as const;
  const priceMode = ["Per month", "Per Course"] as const;
  const classSize = ["Group", "1 to 1"] as const;
  const dayOptions = [
    { value: "Mon", label: "Mon" },
    { value: "Tue", label: "Tue" },
    { value: "Wed", label: "Wed" },
    { value: "Thu", label: "Thu" },
    { value: "Fri", label: "Fri" },
    { value: "Sat", label: "Sat" },
    { value: "Sun", label: "Sun" },
  ];

  const inputRef = useRef<google.maps.places.SearchBox | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("listingId");

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedClassSize, setSelectedClassSize] = useState("");
  const [selectedPriceMode, setSelectedPriceMode] = useState("");
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema>>(
    form.getValues()
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries: libs,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) {
      try {
        const updatedValues = {
          ...values,
          imageUrl, // Overwrite or set the imageUrl field
        };
        console.log(updatedValues);
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/add-listing`,
          updatedValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // 'Content-Type': 'application/json',
            },
          }
        );
        if (response) {
          setPopUpMessage("Listing Added SuccessFully");
          setShowPopup(true);
        }
        const listingId = response.data.listingId;
        // console.log("Listing ID is" + listingId);
        // router.push(`/dashboard/teacher/preview?listingId=${listingId}`);
        // router.push('/dashboard/teacher/thankyou')
        return response.data;
      } catch (error) {
        console.log("Error posting data:", error);
      }
    } else {
      try {
        const updatedValues = {
          ...values,
          imageUrl, // Overwrite or set the imageUrl field
        };
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/add-listing/${id}`,
          updatedValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // 'Content-Type': 'application/json',
            },
          }
        );

        console.log(response);
        if (response) {
          setPopUpMessage("Listing Added SuccessFully");
          setShowPopup(true);
        }

        const listingId = response.data.listingId;

        // router.push(`/dashboard/teacher/preview?listingId=${listingId}`);
        // router.push('/dashboard/teacher/thankyou')
        return response.data;
      } catch (error) {
        console.log("Error posting data:", error);
      }
    }
  };

  // end date is always greater than the start date
  const handleDateChange = useCallback(() => {
    const startDate = form.getValues("startDate");
    const endDate = form.getValues("endDate");

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        form.setError("endDate", {
          type: "manual",
          message: "End date must be greater than start date",
        });
      } else {
        form.clearErrors("endDate");
      }
    }
  }, [form]);

  // max age is always greater than the min age
  const handleAgeChange = useCallback(() => {
    const minAge = form.getValues("minAge");
    const maxAge = form.getValues("maxAge");

    if (minAge && maxAge) {
      const min = parseInt(minAge);
      const max = parseInt(maxAge);

      if (max < min) {
        form.setError("maxAge", {
          type: "manual",
          message: "Max age must be greater than min age",
        });
      } else {
        form.clearErrors("maxAge");
      }
    }
  }, [form]);

  // handle date and age change
  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === "startDate" || name === "endDate") {
        handleDateChange();
      }
      if (name === "minAge" || name === "maxAge") {
        handleAgeChange();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, handleAgeChange, handleDateChange]);

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/category`)
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
      });
  }, []);

  // handle category change
  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const selectedCat = categories.find((cat) => cat.category === categoryName);
    setSubCategories(selectedCat ? selectedCat.subCategory : []);
  };

  useEffect(() => {
    // Fetch data if listingId exists
    if (id) {
      const fetchListing = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/listing/listing/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const listingData = response.data.listing;
          console.log(listingData);
          // Pre-fill form with fetched data
          form.reset({
            category: listingData.category || "",
            subCategory: listingData.subCategory || "",
            title: listingData.title || "",
            priceMode: listingData.priceMode || "",
            price: listingData.price || "",
            mode: listingData.mode || "",
            location: listingData.location || "",
            quantity: listingData.quantity || "",
            classSize: listingData.classSize || "",
            startDate: listingData.startDate || "",
            endDate: listingData.endDate || "",
            days: listingData.days || "",
            gender: listingData.gender || "",
            startTime: listingData.startTime || "",
            endTime: listingData.endTime || "",
            minAge: listingData.minAge || "",
            maxAge: listingData.maxAge || "",
            description: listingData.description || "",
          });
        } catch (error) {
          console.log("Error fetching listing data:", error);
        }
      };

      fetchListing();
    }
  }, [id, form]);

  const handlePlaceSelect = () => {
    if (inputRef.current) {
      const places = inputRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        form.setValue("location", place.formatted_address || "");
      }
    }
  };

  const handleReviewClick = () => {
    setFormValues(form.getValues());
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    handleDateChange();

    // Check if there are any validation errors
    const hasErrors =
      form.formState.errors.startDate ||
      form.formState.errors.endDate ||
      form.formState.errors.maxAge;

    if (hasErrors) {
      // If there are errors, do not submit
      console.log("Error");
      return;
    }
    form.handleSubmit(onSubmit)();
    setIsDialogOpen(false);
  };

  return (
    <div className="m-4 flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/2 py-4 space-y-2 border border-gray-600 rounded-lg p-6 ">
          {/* Category Field */}
          <div className="text-3xl flex items-center justify-center font-semibold mb-3">
            <p className="text-blue-600">
              Add <span className=" text-gray-600  ">Listing</span>
            </p>
          </div>
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>CATEGORY</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCategoryChange(value);
                    }}
                    value={field.value ?? ""}>
                    <SelectTrigger className="w-full border-gray-600">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.map((category, index) => (
                          <SelectItem key={index} value={category.category}>
                            {category.category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Subcategory Selection */}
          {
            <FormField
              name="subCategory"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}>
                      <SelectTrigger className="w-full border-gray-600">
                        <SelectValue placeholder="Select a sub category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Subcategories</SelectLabel>
                          {subCategories.map((sub, index) => (
                            <SelectItem key={index} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          }
          {/* Title Field */}
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>TITLE</FormLabel>
                <FormControl>
                  <Input
                    className="border-gray-600"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <UploadImage
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}></UploadImage>

          {/* price mode field */}
          <FormField
            name="priceMode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>PRICE MODE</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedPriceMode(value); // Update state with selected priceMode
                    }}
                    value={field.value ?? ""}>
                    <SelectTrigger className="w-full border-gray-600">
                      <SelectValue placeholder="Select Price Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Price Mode</SelectLabel>
                        {priceMode.map((priceMode) => (
                          <SelectItem key={priceMode} value={priceMode}>
                            {priceMode}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>PRICE</FormLabel>
                <FormControl>
                  <Input
                    className="border-gray-600"
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Mode Field */}
          <FormField
            name="mode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedMode(value); // Update state with selected mode
                    }}
                    value={field.value ?? ""}>
                    <SelectTrigger className="w-full border-gray-600">
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mode</SelectLabel>
                        {mode.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Location Field */}
          {isLoaded && selectedMode === "Offline" && (
            <StandaloneSearchBox
              onLoad={(ref) => (inputRef.current = ref)}
              onPlacesChanged={handlePlaceSelect}>
              <FormField
                name="location"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LOCATION</FormLabel>
                    <FormControl>
                      <Input
                        className="border-gray-600"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter Location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </StandaloneSearchBox>
          )}
          {selectedMode === "Online" && (
            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZOOM LINK</FormLabel>
                  <FormControl>
                    <Input
                      className="border-gray-600"
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Enter zoom link"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Quantity Field */}
          <FormField
            name="quantity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>QUANTITY (OPTIONAL)</FormLabel>
                <FormControl>
                  <Input
                    className="border-gray-600"
                    type="number"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* class size field*/}
          <FormField
            name="classSize"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>CLASS SIZE</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedClassSize(value); // Update state with selected classSize
                    }}
                    value={field.value ?? ""}>
                    <SelectTrigger className="w-full border-gray-600">
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Class Size</SelectLabel>
                        {classSize.map((classSize) => (
                          <SelectItem key={classSize} value={classSize}>
                            {classSize}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date Field */}
          <FormField
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>START DATE</FormLabel>
                <FormControl>
                  <Input
                    className="border-gray-600"
                    type="date"
                    {...field}
                    onChange={field.onChange}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* End Date Field */}
          <FormField
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>END DATE</FormLabel>
                <FormControl>
                  <Input
                    className="border-gray-600"
                    type="date"
                    {...field}
                    onChange={field.onChange}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Days Field */}
          <FormField
            name="days"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>DAYS</FormLabel>
                <FormControl>
                  <MultiSelect
                    className="border-gray-600"
                    options={dayOptions}
                    onValueChange={(newDays) => {
                      setSelectedDays(newDays);
                      field.onChange(newDays);
                    }}
                    defaultValue={selectedDays}
                    placeholder="Select Days"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Gender Field */}
          <FormField
            name="gender"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>GENDER</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}>
                    <SelectTrigger className="w-full border-gray-600">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Gender</SelectLabel>
                        {gender.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Start Time Field */}
          <FormField
            name="startTime"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>START TIME (OPTIONAL)</FormLabel>
                <FormControl>
                  <Input
                    className="border-gray-600"
                    type="time"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* End Time Field */}
          <FormField
            name="endTime"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>END TIME (OPTIONAL)</FormLabel>
                <FormControl>
                  <Input
                    className="border-gray-600"
                    type="time"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Age Group Field */}
          <FormField
            name="minAge"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Age</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}>
                    <SelectTrigger className="w-full border-gray-600">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent className="overflow-y-auto max-h-[15rem]">
                      <SelectGroup>
                        <SelectLabel>Min Age</SelectLabel>
                        {agegroup.map((agegroup) => (
                          <SelectItem key={agegroup} value={agegroup}>
                            {agegroup}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="maxAge"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Age</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}>
                    <SelectTrigger className="w-full border-gray-600">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent className="overflow-y-auto max-h-[15rem]">
                      <SelectGroup>
                        <SelectLabel>Age Group</SelectLabel>
                        {agegroup.map((agegroup) => (
                          <SelectItem key={agegroup} value={agegroup}>
                            {agegroup}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="preRequistes"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pre-Requistes</FormLabel>
                <FormControl>
                  <Input
                    className="border-gray-600"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description Field */}
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>DESCRIPTION</FormLabel>
                <FormControl>
                  <Input
                    className="border-gray-600"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-between">
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => setIsDialogOpen(open)}>
              <DialogTrigger asChild>
                <Button type="button" className="" onClick={handleReviewClick}>
                  Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-sm:w-[425px">
                <DialogHeader>
                  <DialogTitle>Review Details</DialogTitle>
                  <DialogDescription>
                    Click edit to make changes, Click submit when done
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="flex justify-between">
                    <strong>Category:</strong> {formValues.category}
                  </div>
                  <div className="flex justify-between">
                    <strong>Sub Category:</strong> {formValues.subCategory}
                  </div>
                  <div className="flex justify-between">
                    <strong>Title:</strong> {formValues.title}
                  </div>
                  <div className="flex justify-between">
                    <strong>Price:</strong> {formValues.price}
                  </div>
                  <div className="flex justify-between">
                    <strong>Mode:</strong> {formValues.mode}
                  </div>
                  <div className="flex justify-between">
                    <strong>Location:</strong> {formValues.location}
                  </div>
                  <div className="flex justify-between">
                    <strong>Quantity:</strong> {formValues.quantity}
                  </div>
                  <div className="flex justify-between">
                    <strong>Start Date:</strong> {formValues.startDate}
                  </div>
                  <div className="flex justify-between">
                    <strong>End Date:</strong> {formValues.endDate}
                  </div>
                  <div className="flex justify-between">
                    <strong>Days:</strong> {formValues.days}
                  </div>
                  <div className="flex justify-between">
                    <strong>Gender:</strong> {formValues.gender}
                  </div>
                  <div className="flex justify-between">
                    <strong>Start Time:</strong> {formValues.startTime}
                  </div>
                  <div className="flex justify-between">
                    <strong>End Time:</strong> {formValues.endTime}
                  </div>
                  <div className="flex justify-between">
                    <strong>Age Group:</strong> {formValues.minAge}
                  </div>
                  <div className="flex justify-between">
                    <strong>Age Group:</strong> {formValues.maxAge}
                  </div>
                  <div className="flex justify-between">
                    <strong>Pre-Requistes:</strong> {formValues.preRequistes}
                  </div>
                  <div className="flex justify-between">
                    <strong>Description:</strong> {formValues.description}
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button type="button" onClick={() => setIsDialogOpen(false)}>
                    Edit
                  </Button>
                  <Button type="button" onClick={handleSubmit}>
                    Submit Listing
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Popup
            message={popUpMessage}
            isOpen={showPopup}
            onClose={() => setShowPopup(false)}
            redirectTo="/"
          />
        </form>
      </Form>
    </div>
  );
}
