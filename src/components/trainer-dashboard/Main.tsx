"use client";

import { TrainerForm } from "@/components/trainer-dashboard/form";
import React, { useState } from "react";
import { OrganizationForm } from "./ui/organizationForm";

const Main = () => {
  const [role, setRole] = useState<"trainer" | "organization">("trainer");
  console.log(role);
  return (
    <div className="flex justify-center w-full py-5">
      <div className="flex-col w-4/5 justify-center">
        <div className="flex justify-between">
          <div className="max-sm:text-xs py-2 font-bold text-xl">
            Submit your details to get verified
          </div>
          <div className="flex justify-center space-x-4 mb-6 ml-5">
            <button
              onClick={() => setRole("trainer")}
              className={`px-4 rounded ${role === "trainer" ? "bg-sky-500 text-white font-bold" : "bg-gray-200"
                }`}
            >
              Sign up as a Trainer
            </button>
            <button
              onClick={() => setRole("organization")}
              className={`py-2 px-4 rounded ${role === "organization"
                ? "bg-sky-500 text-white font-bold"
                : "bg-gray-200"
                }`}
            >
              Sign up as a Organization
            </button>
          </div>
        </div>

        <div className="flex  w-full justify-center ">
          <div className="w-3/4 rounded-sm bg-white ring-1 ring-gray-300 z-10 py-10 px-10 gap-4 shadow-3xl">
            <div className="px-2 w-full">
              <h1 className="font-bold text-3xl pb-4">Become Instructors</h1>
              {role === "trainer" ? (
                <TrainerForm />
              ) : (
                <OrganizationForm />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Main;
