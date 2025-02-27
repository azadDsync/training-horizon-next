"use client";

import MyListingContent from "@/components/user-dashboard/MyListingContent";
import Footer from "@/components/UserFlow/Footer";
import NavBar from "@/components/UserFlow/NavBar";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MyOrders from "../orders/page";

interface UserData {
  _id: string;
  user: string;
  userLastName: string;
  role: string;
  password: string;
  email: string;
}

type Order = {
  _id: number;
  createdAt: string;
  status: "ON HOLD" | "FAILED" | "COMPLETED";
  coursePrice: string;
  items: number;
  courseTitle: string;
};

const UserProfilePage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedTab, setSelectedTab] = useState("Profile");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/username`,
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex min-h-screen bg-gray-100 p-8 rounded-xl shadow-lg space-y-6">
        <Sidebar
          user={user}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
        <ContentArea selectedTab={selectedTab} user={user} />
      </div>
      <Footer />
    </>
  );
};

const Sidebar = ({
  user,
  selectedTab,
  onSelectTab,
}: {
  user: UserData | null;
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}) => (
  <div className="w-1/5 min-w-[220px] bg-white p-6 border-r shadow-md">
    <div className="flex flex-col items-center space-y-6">
      <Image
        src="/img/new/user.jpg"
        alt="Profile Avatar"
        width={150} 
        height={150} 
        className="rounded-full border-2 border-blue-300 object-cover aspect-square overflow-hidden"
      />

      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          {user?.user} {user?.userLastName}
        </h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      <div className="w-full">
        {[
          "Profile",
          "My Listings",
          "Purchases and Subscriptions",
          "Family Members",
          "Search Alert",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`p-3 w-full text-left rounded-md transition-colors duration-200 ${
              selectedTab === tab
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// function ProfileContent() {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold">Profile</h2>
//       <p className="text-gray-600">
//         Manage your profile details and additional information
//       </p>

//       {/* Avatar */}
//       <div className="flex items-center space-x-4">
//         <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded-full text-2xl">
//           GT
//         </div>
//         <div>
//           <p>The minimum suggested image dimension is 400x400px</p>
//           <p>The maximum file size is 4MB</p>
//           <button className="mt-2 px-4 py-2 border rounded text-sm bg-gray-200 hover:bg-gray-300">
//             Select Image
//           </button>
//         </div>
//       </div>

//       {/* Details */}
//       <div>
//         <h3 className="text-xl font-medium">Details</h3>
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           <div>
//             <label className="block text-gray-700">First Name</label>
//             <input
//               type="text"
//               value="Gaurang"
//               className="w-full p-2 border rounded"
//               readOnly
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700">Last Name</label>
//             <input
//               type="text"
//               value="Tiwari"
//               className="w-full p-2 border rounded"
//               readOnly
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700">Email</label>
//             <input
//               type="text"
//               value="heygaurang.02@gmail.com"
//               className="w-full p-2 border rounded"
//               readOnly
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700">User Level</label>
//             <input
//               type="text"
//               value="User"
//               className="w-full p-2 border rounded bg-gray-100"
//               readOnly
//             />
//           </div>
//         </div>
//       </div>

//       {/* Additional Fields */}
//       <div>
//         <h3 className="text-xl font-medium">Additional Fields</h3>
//         {/* Additional fields can be added here */}
//       </div>
//     </div>
//   );
// }

const ContentArea = ({ selectedTab, user }: { selectedTab: string; user: UserData | null }) => (
  <div className="w-3/4 p-8">
    {selectedTab === "Profile" && <EditProfileContent />}
    {selectedTab === "Purchases and Subscriptions" && <MyOrders />}
    {selectedTab === "Family Members" && <FamilyMembersContent />}
    {selectedTab === "My Listings"&& <MyListingContent />}

  </div>
);
const EditProfileContent = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [getFirstName, setFirstName] = useState("firstName");
  const [getLastName, setLastName] = useState("lastName");
  const [getPassword, setPassword] = useState("password");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/username`,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // const handleSaveChanges = async () => {
    
  //   try {
  //     const response = await axios.put(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/user/`,
  //       {
  //         firstName: getFirstName,
  //         lastName: getLastName,
  //         password: getPassword,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       setIsEditing(false);
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //   }
  // };

  const handleSaveChanges = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const userId = user?._id; 
  
      if (!userId) {
        console.error("User ID not found");
        return;
      }
  
      const updatedData = {
        fname: getFirstName,
        lname: getLastName,
        password: getPassword,
      };
  
      console.log("Sending update request:", updatedData);
      const response1 = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/`,
        {
          firstName: getFirstName,
          lastName: getLastName,
          password: getPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      );
  
      const response2 = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/trainers/${userId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("User update successful:", response1.data);
      console.log("Trainer update successful:", response2.data);
  
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating trainer:", error);
      // if (error.response) {
      //   console.error("Backend Response:", error.response.data);
      // }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Profile Content */}
      <div className="flex-1 p-10">
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6 w-full">
          <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>

          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <DisplayField label="First Name" value={user?.user} />
                <DisplayField label="Last Name" value={user?.userLastName} />
                <DisplayField label="Email" value={user?.email} />
              </div>
              <div className="flex justify-end w-full space-x-4 mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-300 text-black font-semibold rounded-md hover:bg-blue-400 transition"
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/4 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Profile
            </h2>

            <input
              type="text"
              placeholder="First Name"
              // value={getFirstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 mb-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <input
              type="text"
              placeholder="Last Name"
              // value={getLastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 mb-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <input
              type="password"
              placeholder="Password"
              // value={getPassword}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 mb-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="flex justify-end mt-4 space-x-3">
              <button
                className="bg-blue-500 text-white py-2 px-5 rounded-md hover:bg-blue-600 transition"
                onClick={handleSaveChanges}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white py-2 px-5 rounded-md hover:bg-red-600 transition"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock DisplayField component
const DisplayField = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div>
    <label className="block text-gray-600">{label}</label>
    <div className="text-gray-900">{value || "N/A"}</div>
  </div>
);

const FamilyMembersContent = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/allmembers`,
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        );
        setFamilyMembers(res.data.familyMembers);
      } catch (error) {
        console.error("Error fetching family members:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFamilyMembers();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Family Members Content */}
      <div className="flex-1 p-10">
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6 w-full">
          <h2 className="text-2xl font-semibold text-gray-800">
            Family Members
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center h-60">
              <div className="loader"></div>
            </div>
          ) : familyMembers.length === 0 ? (
            <EmptyState
              message="No members available!"
              actionLink="/userflow/registerMember"
              actionText="Register New Member"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {familyMembers.slice(0, 4).map((member: any, index: any) => (
                <FamilyMemberCard
                  key={member._id}
                  member={member}
                  index={index}
                />
              ))}
            </div>
          )}

          <div className="flex justify-end w-full mt-6">
            <Link
              href="/userflow/familyMembers"
              className="text-blue-500 hover:underline"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({
  message,
  actionLink,
  actionText,
}: {
  message: string;
  actionLink: string;
  actionText: string;
}) => (
  <div className="bg-white w-full p-6 mx-6 my-6 flex flex-col justify-center items-center gap-3">
    <h2 className="text-2xl font-semibold text-gray-800">{message}</h2>
    <Link
      href={actionLink}
      className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium border border-gray-200 bg-blue-300"
    >
      {actionText}
    </Link>
  </div>
);

const FamilyMemberCard = ({
  member,
  index,
}: {
  member: any;
  index: number;
}) => (
  <div className="bg-white border grid grid-cols-2 gap-2 p-2 w-full rounded-lg border-gray-300">
    <h2 className="text-xl font-semibold text-gray-800 mb-2">
      {index + 1}. {member.name}
    </h2>
    <p className="text-gray-700">
      <strong>Age:</strong> {member.age}
    </p>
    <p className="text-gray-700">
      <strong>Date of Birth:</strong> {member.dob.split("T")[0]}
    </p>
    <p className="text-gray-700">
      <strong>Relationship:</strong> {member.relationship}
    </p>
    <p className="text-gray-700">
      <strong>Gender:</strong> {member.gender}
    </p>
    <p className="text-gray-700">
      <strong>Address:</strong> {member.address}
    </p>
    <p className="text-gray-700">
      <strong>City:</strong> {member.city}
    </p>
    <p className="text-gray-700">
      <strong>Postal Code:</strong> {member.postalCode}
    </p>
  </div>
);

const SubscriptionsContent = () => {
  const id = window.localStorage.getItem("userId");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/order/getOrdersDetailsByUserId/${id}`
        );
        // Filter orders to only show completed ones
        const completedOrders = response.data.orders.filter(
          (order: Order) => order.status === "COMPLETED"
        );
        setOrders(completedOrders);
      } catch (err) {
        console.log("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [id]);

  return (
    <div className="flex h-screen">
      {/* Subscriptions Content */}
      <div className="flex-1 p-10">
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6 w-full">
          <h1 className="text-3xl font-bold text-gray-800">
            Purchases and Subscriptions
          </h1>

          {orders.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {orders.map((order, index) => (
                <OrderCard key={order._id} order={order} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No completed orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, index }: { order: Order; index: number }) => (
  <div className="bg-white border p-4 w-full max-w-md rounded-lg shadow-md border-gray-300">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-lg font-semibold text-gray-800">
        {index + 1}. {order.courseTitle}
      </h2>
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          order.status === "COMPLETED"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {order.status}
      </span>
    </div>

    <div className="space-y-2">
      <p className="text-gray-700">
        <strong>Items:</strong> {order.items}
      </p>
      <p className="text-gray-700">
        <strong>Price:</strong> ${order.coursePrice}
      </p>
      <p className="text-gray-700">
        <strong>Created At:</strong>{" "}
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

export default UserProfilePage;
