import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Popup from "../trainer-dashboard/PopUp";

const RoleBasedNav = () => {
  const [role, setRole] = useState("");
  const [trainerId, setTrainerId] = useState();
  const [isApproved, setIsApproved] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const handleSignOut = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userId");
    // window.localStorage.removeItem('role');
    window.location.reload();
  };

  const handleClick = () => {
    console.log(isApproved);
    setPopupMessage("Pending Approval");
    setPopupVisible(true);
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/user/username`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setRole(res.data.role);
        setTrainerId(res.data._id);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, []);

  // Fetch trainer data when trainerId is available
  useEffect(() => {
    if (trainerId) {
      // Ensure trainerId is set before making the API call
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/trainers/${trainerId}`)
        .then((res) => {
          setIsApproved(res.data.trainer.isApproved);
          console.log(res.data.trainer.isApproved);
        })
        .catch((err) => {
          console.error("Error fetching trainer data:", err);
        });
    }
  }, [trainerId]); // This effect will run whenever trainerId is updated
  return (
    <div>
      {!isApproved && (
        <Popup
          message={popupMessage}
          isOpen={popupVisible}
          onClose={() => setPopupVisible(false)}
          redirectTo="/"
        />
      )}
      {role === "trainer" && (
        <div>
          {" "}
          <Link
            href={isApproved ? "/userflow/addListing" : "/"}
            onClick={handleClick}
            className="hidden sm:block bg-blue-300 text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-200">
            {" "}
            Add Listing
          </Link>
        </div>
      )}
    </div>
  );
};

export default RoleBasedNav;
