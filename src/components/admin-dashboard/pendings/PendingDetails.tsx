import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { ColDef, ICellRendererParams } from "ag-grid-community";
import Image from "next/image";

function PendingDetails() {
  const [rowData, setRowData] = useState<
    { fname: string; lname: string; email: string; phone: string }[]
  >([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      headerName: "Name",
      valueGetter: (params) => `${params.data.fname} ${params.data.lname}`,
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Email",
      field: "email",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Phone",
      field: "phone",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Action",
      field: "action",
      headerClass: "font-bold border p-2 font-bold  text-md",
      cellRenderer: (data: ICellRendererParams) => (
        <div className="flex gap-8">
          <button
            className="text-green-500 font-bold"
            onClick={() =>
              handleApproveTrainer(data.data._id, data.data.email)
            }>
            Approve
          </button>
          <button
            className="text-red-600"
            onClick={() => handleRejectTrainer(data.data._id, data.data.email)}>
            Reject
          </button>
        </div>
      ),
    },
  ]);

  const [rowData2, setRowData2] = useState<
    { title: string; price: string; location: string; mode: string }[]
  >([]);
  const [colDefs2, setColDefs2] = useState<ColDef[]>([
    {
      headerName: "Title",
      field: "title",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Price",
      field: "price",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Location",
      field: "location",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Action",
      field: "action",
      headerClass: "font-bold border p-2 font-bold  text-md",
      cellRenderer: (data: ICellRendererParams) => (
        <div className="flex gap-8">
          <button
            className="text-green-500 font-bold"
            onClick={() =>
              handleApproveListing(data.data._id, data.data.title)
            }>
            Approve
          </button>
          <button
            className="text-red-600"
            onClick={() => handleRejectListing(data.data._id, data.data.title)}>
            Reject
          </button>
        </div>
      ),
    },
  ]);

  const handleRejectTrainer = async (
    trainerID: string,
    trainerEmail: string
  ) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/discard-trainer/` +
        trainerID.toString()
    );
    //  console.log(response.data);
    setRowData((prevData) =>
      prevData.filter((row) => row.email != trainerEmail)
    );
  };

  const handleApproveTrainer = async (
    trainerID: string,
    trainerEmail: string
  ) => {
    // console.log(trainerID);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/approve-trainer/` +
        trainerID.toString()
    );
    // console.log(response.data);
    setRowData((prevData) =>
      prevData.filter((row) => row.email != trainerEmail)
    );
  };

  const handleRejectListing = async (
    listingId: string,
    listingTitle: string
  ) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/discard-listing/` +
        listingId.toString()
    );
    //  console.log(response.data);
    setRowData2((prevData) =>
      prevData.filter((row) => row.title != listingTitle)
    );
  };

  const handleApproveListing = async (
    listingId: string,
    listingTitle: string
  ) => {
    // console.log(listingId);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/approve-listing/` +
        listingId.toString()
    );
    // console.log(response.data);
    setRowData2((prevData) =>
      prevData.filter((row) => row.title != listingTitle)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/pending-trainers`
        );
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/pending-listings`
        );
        // console.log(response.data.pendingTrainers);
        // if(Array.isArray(response.data.data))
        setRowData(response.data.pendingTrainers);
        setRowData2(res.data.pendingListings);
        // else{ console.log("not an array")}
      } catch (error) {
        console.log("error");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Pending Trainers</h3>
          <div className="overflow-y-auto h-64">
            <div
              className="ag-theme-quartz "
              style={{ height: "100%", width: "100%" }}>
              <AgGridReact rowData={rowData || []} columnDefs={colDefs} />
            </div>
          </div>
        </div>

        {/* <div className="bg-white  rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Customer Reaction</h3>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/img/dashboard/image.svg"
                alt="image"
                height={40}
                width={40}
              />
              <span className="font-semibold">Thomas</span>
            </div>
            <p className="text-sm text-gray-600">
              Everyone who knows buys crypto, that's a practical solution for
              funds transfer.
            </p>
            <div className="text-xs text-gray-500">👍 89 | 👎 12</div>
          </div>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/img/dashboard/image.svg"
                alt="image"
                height={40}
                width={40}
              />
              <span className="font-semibold">Master Cat</span>
            </div>
            <p className="text-sm text-gray-600">
              Don't worry! When all other currencies are obsolete, every soul on
              earth will hold bitcoin!
            </p>
            <div className="text-xs text-gray-500">👍 128 | 👎 15</div>
          </div>
          <button className="w-full bg-[#17A8FC] text-white py-2 rounded-lg hover:bg-blue-600">
            Manage Reactions
          </button>
        </div> */}
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Pending Listings</h3>
          <div className="overflow-y-auto h-64">
            <div
              className="ag-theme-quartz "
              style={{ height: "100%", width: "100%" }}>
              <AgGridReact rowData={rowData2 || []} columnDefs={colDefs2} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PendingDetails;
