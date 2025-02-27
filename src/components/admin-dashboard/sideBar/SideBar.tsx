"use client";

import Image from "next/image";
import { useState } from "react";

interface ChildComponentProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}
const Sidebar: React.FC<ChildComponentProps> = ({ value, setValue }) => {
  const [activeButton, setActiveButton] = useState<string | null>("Dashboard");
  const [isListingOpen, setIsListingOpen] = useState(false);

  const handleClick = (button: string) => {
    setActiveButton(button);
    if (button === "Listing") {
      setIsListingOpen(!isListingOpen);
    } else {
      setIsListingOpen(false);
    }
  };

  return (
    <aside className="bg-blue-50 p-4 w-64">
      <div className="mb-12 flex justify-center">
        <Image
          src="/Logo/MMP.png"
          alt="Logo"
          width={150}
          height={50}
        />
      </div>

      <nav>
        <ul>
          {/* <li className="mb-2">
            <button
              onClick={() => {
                handleClick("Profile");
              }}
              className={`flex flex-row rounded-lg w-full p-2 ${
                activeButton === "Profile"
                  ? "bg-[#17A8FC] text-white"
                  : " text-black"
              }`}
            >
              <Image
                className="mx-2"
                src="/img/dashboard/profile.svg"
                alt="dashboardlogo"
                width={50} height={50}
              />
              Profile
            </button>
          </li> */}
          <li className="mb-2">
            <button
              onClick={() => {
                handleClick("Dashboard");
                setValue("dashboard");
              }}
              className={`flex flex-row rounded-lg w-full p-2 ${
                activeButton === "Dashboard"
                  ? "bg-[#17A8FC] text-white"
                  : " text-black"
              }`}>
              <Image
                className="mx-2"
                src="/img/dashboard/setting.svg"
                alt="dashboardlogo"
                width={30}
                height={50}
              />
              Dashboard
            </button>
          </li>
          <li className="mb-2">
            <div className="relative text-left">
              <button
                onClick={() => {
                  handleClick("Listing");
                }}
                className={`flex flex-row rounded-lg w-full p-2 ${
                  activeButton === "Listing"
                    ? "bg-[#17A8FC] text-white"
                    : " text-black"
                }`}>
                <Image
                  className="mx-2"
                  src="/img/dashboard/setting.svg"
                  alt="dashboardlogo"
                  width={30}
                  height={50}
                />
                Listings
              </button>

              {isListingOpen && (
                <div className="absolute left-full top-0 ml-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setValue("listings")}>
                    Listings
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setValue("trainers")}>
                    Trainers
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>

      <nav>
        <ul>
          <li className="mb-2 mt-2 w-48">
            {/* <button
              onClick={() => handleClick("Account Setting")}
              className={`flex flex-row rounded-lg w-full p-2 ${
                activeButton === "Account Setting"
                  ? "bg-[#17A8FC] text-white"
                  : " text-black"
              }`}>
              <Image
                className="mx-2"
                src="/img/dashboard/setting.svg"
                alt="dashboardlogo"
                width={30}
                height={50}
              />
              Account Setting
            </button> */}
          </li>
          <li className="mb-2 mt-2 w-48">
            {/* <button
              onClick={() => {
                handleClick("Order Status");
                setValue("orderStatus");
              }}
              className={`flex flex-row rounded-lg w-full p-2 ${
                activeButton === "Order Status"
                  ? "bg-[#17A8FC] text-white"
                  : " text-black"
              }`}>
              <Image
                className="mx-2"
                src="/img/dashboard/setting.svg"
                alt="dashboardlogo"
                width={30}
                height={50}
              />
              Order Status
            </button> */}
          </li>
          {/* <li className="mb-2">
            <button
              onClick={() => handleClick("Order Status")}
              className={`flex flex-row rounded-lg w-full p-2 ${
                activeButton === "Order Status"
                  ? "bg-[#17A8FC] text-white"
                  : " text-black"
              }`}>
              <img
                className="mx-2"
                src="/img/dashboard/setting.svg"
                alt="dashboardlogo"
              />
              Order Status
            </button>
          </li> */}
          <li className="mb-2">
            {/* <button
              onClick={() => handleClick("Log Out")}
              className={`flex flex-row rounded-lg w-full p-2 ${
                activeButton === "Log Out"
                  ? "bg-[#17A8FC] text-white"
                  : " text-black"
              }`}>
              <Image
                className="mx-2"
                src="/img/dashboard/logout.svg"
                alt="dashboardlogo"
                width={30}
                height={50}
              />
              Log Out
            </button> */}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
