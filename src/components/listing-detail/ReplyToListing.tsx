// // components/CourseCard.tsx
// "use client";

// import React, { useState } from "react";

// function ReplyToListing() {
//   const [name, setName] = useState("user");
//   const [message, setMessage] = useState("");
//   const [activeTab, setActiveTab] = useState<string>("Overview");
//   const [isOpen, setIsOpen] = useState(false);

//   const openPopup = () => setIsOpen(true);
//   const closePopup = () => setIsOpen(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const response = await fetch("http://localhost:5000/reviews", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name, message }),
//     });
//     if (response.ok) {
//       alert("Review submitted!");
//       setName("");
//       setMessage("");
//     } else {
//       alert("Error submitting review.");
//     }
//   };
//   return (
//     <>
//       <button
//         onClick={openPopup}
//         className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-md shadow mb-4"
//       >
//         Reply to Listing
//       </button>

//       {/* Pop-Up Card */}
//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
//             <h2 className="text-xl font-bold mb-4">Send a Message</h2>
//             <textarea
//               onChange={(e) => setMessage(e.target.value)}
//               className="w-full border border-gray-300 rounded-md p-2 mb-4"
//               rows={8}
//               placeholder="Type your message here..."
//               required
//             ></textarea>

//             <div className="flex justify-end">
//               <button
//                 onClick={closePopup}
//                 className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-[#17A8FC] hover:bg-blue-500 text-white rounded-md"
//               >
//                 Send
//               </button>
//             </div>
//             <div className="container mx-auto"></div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default ReplyToListing;
// Current issues:

"use client";

import React, { useState } from "react";
import { z } from "zod";


interface ReplyFormData {
  name: string;
  message: string;
}

const replySchema = z.object({
  name: z.string().min(1, "Name is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

function ReplyToListing() {
  const [name, setName] = useState("user");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => {
    setIsOpen(false);
    setError(null);
    setMessage("");
  };

  const validateForm = (): boolean => {
    try {
      replySchema.parse({ name, message });
      setError(null);
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await response.json();
      closePopup();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={openPopup}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-md shadow mb-4 disabled:opacity-50"
        disabled={isLoading}
      >
        Reply to Listing
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Send a Message</h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={8}
                placeholder="Type your message here..."
                disabled={isLoading}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#17A8FC] hover:bg-blue-500 text-white rounded-md disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ReplyToListing;
