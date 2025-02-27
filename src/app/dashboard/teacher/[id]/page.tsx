"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
// import Card from "@/components/trainer-dashboard/Card";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/UserFlow/NavBar";

interface TrainerData {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  id: string;
  address: string;
  experience: string;
  qualifications: string;
  linkedin: string;
  about: string;
  workHistory: string;
  educationDetail: string;
  imageUrl: string;
}

const TeacherPf: React.FC = ({
}: any) => {
  const { id } = useParams<{ id: string }>();
  const [getImageUrl, setImageUrl] = useState("/img/loading.gif");
  const [trainer, setTrainer] = useState<TrainerData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/trainers/` + id.toString()
        );
        // console.log(response.data.trainer);
        setTrainer(response.data.trainer);
        fetchImage(response.data.trainer.imageUrl)

      } catch (error) {
        console.log("error");
      }
    };

    const fetchImage = async (imageUrl: string) => {
      try {
        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/upload?imageUrl=${imageUrl}`
        );
        if (!response2.ok) throw new Error("Failed to fetch signed URL");

        const data = await response2.json();
        setImageUrl(data.signedUrl);
      } catch (error) { }


    }
    fetchData();
  }, [id]);

  if (!trainer) {
    return (
      <>
        <Navbar />
        <p className="my-52 mx-auto text-center ">
          LOADING TRAINER DETAILS ...
        </p>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <div className="absolute bg-white w-full max-w-[1650px] h-auto top-[90px] left-[50%] transform -translate-x-1/2 rounded-[10px]  border-gray-300 shadow-md z-20 p-6">
        <div className="flex flex-col md:flex-row mx-5 md:mx-10 mt-5 space-y-10 md:space-y-0 md:space-x-10 lg:space-x-28">
          <div className="md:w-[500px] relative">
            <p className="flex justify-center mb-2 text-blue-400 text-xl md:text-xl">
              #Ranked in Top 10 Teachers
            </p>
            <Image
              alt="Teacher"
              className="rounded-full h-[180px] w-[180px] md:h-[230px] md:w-[230px] mx-auto mb-5 object-cover"
              src={getImageUrl}
              width={230}
              height={230}
            />

            <h1 className="font-bold text-[24px] md:text-[32px] text-center text-[#292929]">
              {trainer.fname} {trainer.lname}
            </h1>
            <h3 className="text-center text-gray-400">Professional</h3>
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="gray"
                className="size-5 mt-1">
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-center text-gray-400 mt-1">
                {trainer.address}
              </h3>
            </div>

            <h2 className="mt-10 font-bold">Teacher Details</h2>
            <hr className="h-px my-3 bg-gray-200 border-0" />
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#BDBDBD"
                    className="size-5 mt-0.5 mr-1">
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>Name</p>
                </div>
                <p>
                  {trainer.fname} {trainer.lname}
                </p>
              </div>
              <div className="flex justify-between">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#BDBDBD"
                    className="size-5 mt-0.5 mr-1">
                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                  </svg>
                  <p>Mail Address</p>
                </div>
                <p>{trainer.email}</p>
              </div>
              <div className="flex justify-between">
                <div className="flex">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 13 12"
                    fill="#BDBDBD"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 mt-0.5 mr-1">
                    <path
                      d="M9.03725 7.60403L8.73392 7.90603C8.73392 7.90603 8.01192 8.62336 6.04192 6.66469C4.07192 4.70603 4.79392 3.98869 4.79392 3.98869L4.98459 3.79803C5.45592 3.33003 5.50059 2.57803 5.08925 2.02869L4.24925 0.906694C3.73992 0.226694 2.75659 0.136694 2.17325 0.716694L1.12659 1.75669C0.83792 2.04469 0.644586 2.41669 0.66792 2.83003C0.72792 3.88803 1.20659 6.16336 3.87592 8.81803C6.70725 11.6327 9.36392 11.7447 10.4499 11.6434C10.7939 11.6114 11.0926 11.4367 11.3333 11.1967L12.2799 10.2554C12.9199 9.62003 12.7399 8.53003 11.9213 8.08536L10.6479 7.39269C10.1106 7.10069 9.45725 7.18669 9.03725 7.60403Z"
                      fill="#BDBDBD"
                    />
                  </svg>
                  <p>Mobile No.</p>
                </div>
                <p>{trainer.phone}</p>
              </div>
              <div className="flex justify-between">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                    className="size-5 mt-0.5 mr-1">
                    <path
                      fill="#0288D1"
                      d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path>
                    <path
                      fill="#FFF"
                      d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
                  </svg>
                  <p>LinkedIn</p>
                </div>
                {trainer.linkedin ? (
                  <a
                    href={trainer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline">
                    View LinkedIn Profile
                  </a>
                ) : (
                  <p>N/A</p>
                )}
              </div>

              <button className="bg-[#17A8FC] text-white font-bold py-2 px-4 rounded hover:bg-blue-700 w-full md:w-[373px] mt-10 mx-auto block">
                <div className="flex justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 mx-1">
                    <path
                      d="M9.99967 1.66669C9.11562 1.66669 8.26777 2.01788 7.64265 2.643C7.01753 3.26812 6.66634 4.11597 6.66634 5.00002C6.66634 5.88408 7.01753 6.73192 7.64265 7.35704C8.26777 7.98216 9.11562 8.33335 9.99967 8.33335C10.8837 8.33335 11.7316 7.98216 12.3567 7.35704C12.9818 6.73192 13.333 5.88408 13.333 5.00002C13.333 4.11597 12.9818 3.26812 12.3567 2.643C11.7316 2.01788 10.8837 1.66669 9.99967 1.66669ZM14.1663 10H5.83301C5.16997 10 4.53408 10.2634 4.06524 10.7323C3.5964 11.2011 3.33301 11.837 3.33301 12.5C3.33301 14.36 4.09801 15.85 5.35301 16.8584C6.58801 17.85 8.24467 18.3334 9.99967 18.3334C11.7547 18.3334 13.4113 17.85 14.6463 16.8584C15.8997 15.85 16.6663 14.36 16.6663 12.5C16.6663 11.837 16.403 11.2011 15.9341 10.7323C15.4653 10.2634 14.8294 10 14.1663 10Z"
                      fill="white"
                    />
                  </svg>
                  <p>Contact Teacher</p>
                </div>
              </button>
            </div>
          </div>

          <div className="md:w-[1116px]">
            <p className="text-lg md:text-xl font-semibold">
              About {trainer.fname}
            </p>
            <p className="text-gray-600 mt-2 w-full break-words break-all hyphens-auto">{trainer.about}</p>
            <div className="mt-3">
              <p className="text-lg md:text-xl font-semibold">Work History</p>
              <p className="text-gray-600 whitespace-pre-line mt-2 break-words break-all hyphens-auto">
                {trainer.workHistory}
              </p>
            </div>
            <div className="mt-3">
              <p className="text-lg md:text-xl font-semibold">Education</p>
              <p className="text-gray-600 mt-2 break-words break-all hyphens-auto">{trainer.educationDetail}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherPf;
