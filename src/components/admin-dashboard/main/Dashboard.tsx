import { Divide } from "lucide-react";
import AdminListings from "../listing/AdminListings";
import PendingDetails from "../pendings/PendingDetails";
import Trainers from "../trainers/Trainers";
import OrderStatus from "../OrderStatus";
import Image from "next/image";

interface ChildComponentProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}
const Dashboard: React.FC<ChildComponentProps> = ({ value, setValue }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 w-full ">
      <div className=" mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image
            src="/img/dashboard/admin.svg"
            width={50}
            height={30}
            alt="admin"
          />
          <div>
            <h2 className="text-xl font-semibold">Simrat Bhalla</h2>
            <p className="text-sm text-gray-500">Founder @ MakeMePro Co.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#17A8FC]"
          /> */}
          <div className="text-gray-500 flex flex-row space-x-2">
            <Image
              src="/img/dashboard/notification.svg"
              alt="notificaiton"
              width={20}
              height={10}
            />
            <span className="bg-yellow-300 text-white px-2 py-1 rounded-full">
              4
            </span>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 ">
          <div className="flex flex-row gap-1">
            <Image src="/img/dashboard/user.svg" alt="user" width={50} height={50} />
            <h3 className="text-sm text-gray-500 ">Users Engaged</h3>
          </div>

          <p className="text-2xl font-semibold">
            500 <span className="text-green-500 text-sm">+40</span>
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 flex flex-row gap-1">
            <Image src="/img/dashboard/transaction.svg" alt="transaction" width={50} height={50} />
            Total Transactions
          </h3>
          <p className="text-2xl font-semibold">
            $500 <span className="text-green-500 text-sm">+40</span>
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 flex flex-row gap-1 ">
            <Image src="/img/dashboard/revenue.svg" alt="" width={50} height={50} />
            Revenue Generated
          </h3>
          <p className="text-2xl font-semibold ">
            $500 <span className="text-green-500 text-sm">+40</span>
          </p>
        </div>

    
      </div>
      */}
      <div className="w-full">
        {value == "trainers" ? <Trainers /> : <></>}
        {value == "listings" ? <AdminListings /> : <></>}
        {value == "dashboard" ? <PendingDetails /> : <></>}
        {value == "orderStatus" ? <OrderStatus /> : <></>}
      </div>
      {/*<div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Top Courses</h3>
          <ul>
            <li className="flex justify-between py-2">
              <span>Implementing SAFe</span>
              <span className="text-gray-600">$30.00</span>
            </li>
             Repeat more items as needed
          </ul>
          <button className="mt-4 w-full bg-[#17A8FC] text-white py-2 rounded-lg hover:bg-blue-600">
            + Add New Courses
          </button>
        </div> */}

      {/* <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Generate Coupon</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter coupon name"
            className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Offer Value"
            className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-[#17A8FC] text-white py-2 rounded-lg hover:bg-blue-600">
            Generate
          </button>
        </div>
      </div>
    </div> */}
    </div>
  );
};

export default Dashboard;
