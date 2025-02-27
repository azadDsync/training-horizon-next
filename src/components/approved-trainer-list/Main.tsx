"use client";
import { Triangle } from "lucide-react";
import SearchBar from "../listing/SearchBar";
import { Card, CardContent } from "../ui/card";
import SearchSection from "../UserFlow/SearchSection";
import TrainerCard from "./TrainerCard";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface Trainer {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  imageUrl: string;
}

const Main = () => {
  // const [trainers, setTrainers] = useState([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [keywords, setKeywords] = useState<string>("");
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    // Fetch trainers from the API
    const fetchTrainers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/approved-trainers/`
        ); // API route for fetching trainers
        const data = await response.json();
        setTrainers(data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainers();
  }, []);

  useEffect(() => {
    // Filter trainers based on keywords
    const filtered = trainers.filter((trainer) => {
      const fullName = `${trainer.fname} ${trainer.lname}`.toLowerCase();
      return fullName.includes(keywords.toLowerCase());
    });
    setFilteredTrainers(filtered);
  }, [keywords, trainers]);

  const handleSearch = useCallback(
    (searchKeywords: string) => {
      // Filter trainers based on the provided search keywords
      const filtered = trainers.filter((trainer) => {
        const fullName = `${trainer.fname} ${trainer.lname}`.toLowerCase();
        return fullName.includes(searchKeywords.toLowerCase());
      });
      setFilteredTrainers(filtered);
    },
    [trainers]
  );

  useEffect(() => {
    handleSearch(keywords);
  }, [keywords, trainers, handleSearch]);

  return (
    <div className="flex flex-col items-center pt-5 min-h-screen bg-background">
      <div className="w-full max-w-[1296px] px-4  space-y-6">
        <h2 className="text-5xl font-bold text-center">
          Our <span className="text-blue-600">Trainers</span>
        </h2>
        <hr className="w=full border-2 border-sky-500" />
        <div className="w-full">
          <SearchSection
            keywords={keywords}
            setKeywords={setKeywords}
            onSearch={handleSearch}
          />

          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer, idx) => (
                <TrainerCard
                  key={idx}
                  trainer={trainer} // Pass each trainer data as prop
                />
              ))
            ) : (
              <p>No listings found.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Main;
