import TeacherProfile from "@/components/trainer-dashboard/TeacherProfile";
import Navbar from "@/components/UserFlow/NavBar";
import React from "react";
interface trainerData {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  qualifcations: string;
  experience: string;
  imageUrl: string;
}
const teacher = () => {
  return (
    <>
      <Navbar />
      <TeacherProfile />
    </>
  );
};

export default teacher;
