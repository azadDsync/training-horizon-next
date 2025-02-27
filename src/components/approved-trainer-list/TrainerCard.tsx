"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface TrainerProps {
  trainer: {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    _id: string;
    imageUrl: string;
  };
}

const TrainerCard: React.FC<TrainerProps> = ({ trainer }) => {
  const [getImageUrl, setImageUrl] = useState<string>("/img/loading.gif");

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (!trainer.imageUrl) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/upload?imageUrl=${trainer.imageUrl}`
        );
        if (!response.ok) throw new Error("Failed to fetch signed URL");

        const data = await response.json();
        console.log("Signed URL Response:", data);

        if (data.signedUrl) {
          setImageUrl(data.signedUrl);
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImage();
  }, [trainer.imageUrl]);

  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:-translate-y-2">
      <img
        src={getImageUrl}
        alt={`${trainer.fname} ${trainer.lname}`}
        className="w-full h-[300px] object-cover rounded-t-lg"
      />

      <CardContent className="pt-6 space-y-2">
        <div className="flex items-center justify-center font-semibold">
          <h3 className="text-xl">{trainer.fname} {trainer.lname}</h3>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-sm text-gray-600">{trainer.email}</div>
          <div className="text-sm text-gray-600">{trainer.phone}</div>
          <Link
            href={`/dashboard/teacher/${trainer._id}`}
            className="text-sky-500 hover:underline"
          >
            Know More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default TrainerCard;