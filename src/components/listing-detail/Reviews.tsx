"use client"

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Review {
  _id: string;
  name: string;
  review: string;
  rating: number;
  date: string;
}

interface ReviewsResponse {
  averageRating: number;
  reviews: Review[];
}

const Reviews = ({ listingId }: { listingId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/review/reviews/${listingId}`)
      .then((res) => res.json())
      .then((data: ReviewsResponse) => {
        console.log('Fetched data:', data); // Log the response to verify the data
        // Ensure reviews is an array
        if (Array.isArray(data.reviews)) {
          const fetchedReviews = data.reviews
          .sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime())
          setReviews(data.reviews);
        } else {
          setReviews([]); // Set empty array if data.reviews is not an array
        }

        // Set the average rating
        const avgRating = (typeof data.averageRating === 'number' && !isNaN(data.averageRating)) 
          ? data.averageRating 
          : 0;
        setAverageRating(avgRating);
      })
      .catch((error) => {
        console.log("failed to fetch reviews",error);
        setReviews([]); // Ensure reviews is always an array on error
        setAverageRating(0); // Set default to 0 in case of error
      });
  }, [listingId]);

  return (
    <div className=" p-10">
      <h2 className="text-2xl font-bold mb-6">Reviews for Listing</h2>

      {/* Display Average Rating */}
      {averageRating !== null ? (
        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Average Rating: {averageRating.toFixed(1)} ★
          </h3>
        </div>
      ) : (
        <p>Loading average rating...</p>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.slice(0, visibleReviewsCount).map((review) => (
            <div key={review._id} className="p-4 bg-white shadow rounded-lg">
              <div className="flex items-center mb-2">
                <Image
                  src={`https://ui-avatars.com/api/?name=${review.name}&background=random`}
                  alt={review.name}
                  height={20}
                  width={20}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">{review.name}</h3>
                  <div className="text-yellow-500">
                    {'★'.repeat(review.rating)}{' '}
                    <span className="text-gray-500">({review.rating} stars)</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p>{review.review}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
      </div>
      {/* Show More / Show Less Button */}
      {reviews.length > 3 && (
        <div className="mt-4">
          <button
            className=" text-blue-600 px-4 py-2 rounded"
            onClick={() =>
              setVisibleReviewsCount(visibleReviewsCount === 3 ? reviews.length : 3)
            }
          >
            {visibleReviewsCount === 3 ? "Show all reviews" : "Hide Reviews"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
