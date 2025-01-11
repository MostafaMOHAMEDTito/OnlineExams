"use client";

import Image from "next/image";
import React, { useState } from "react";
import userImage from "../../../../public/pexels-mastercowley.png";
import CSS from "../../../../public/CSS.png";
import JS from "../../../../public/JS.png";
import HTML from "../../../../public/HTML.png";
import ReactImg from "../../../../public/React.png";
import Swal from "sweetalert2";

import LoadingSpinner from "@/app/_components/loadingSpinner/page";
import { useSession } from "next-auth/react";
import StartQuiz from "../startQuiz/page";
import { useQuery } from "@tanstack/react-query";

// Map images to quiz titles
const renderImg: any = {
  "JavaScript Quiz": JS,
  "CSS Quiz": CSS,
  "HTML Quiz": HTML,
  "React Quiz": ReactImg,
};

const fetchExams = async (token: string | undefined) => {
  if (!token) {
    throw new Error("Missing authentication token.");
  }
  try {
    const response = await fetch("https://exam.elevateegy.com/api/v1/exams", {
      headers: {
        "Content-Type": "application/json",
        token,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error("Failed to fetch quizzes.");
  }
};

export default function QuizHistory() {
  const session = useSession();
  const token = session.data?.token;
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["exams"],
    queryFn: () => fetchExams(token),
    enabled: !!token,
  });
  const quizzes = data?.exams || [];

  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State variables for quiz history
  const [display, setdisPlay] = useState("hidden "); // Change display

  // Function to handle start quizzes
  function startQuizzes() {
    Swal.fire({
      title: "Instructions",
      icon: "question",
      cancelButtonColor: "#4461F2",
      confirmButtonText: "Start",
      html: `
      <ul>
        <li>Duration: 10 minutes.</li>
        <li>Questions: 10.</li>
        <li>Don't leave the page.</li>
      </ul>
    `,
    }).then((result) => {
      if (result.isConfirmed) {
        setdisPlay("flex");
      }
    });
  }

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter quizzes based on search query
  const filteredQuizzes = quizzes.filter((quiz: Quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Loading State
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render Error State
  if (isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
        <p className="text-red-500 dark:text-red-400 text-lg font-semibold">
          Error in Fetch Data
        </p>
      </div>
    );
  }

  // Render Quizzes
  return (
    <section className="w-5/6 mx-auto ">
      {/* Input for search query to quiz data */}
      <div className="flex mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange} // Update search query
          className="border-2 border-white shadow-lg rounded-lg px-4 py-2 w-9/12 focus:outline-none"
          placeholder="Search Quiz"
        />
        <button
          className="mx-4 text-white bg-maincolor dark:bg-blue-400 rounded-2xl px-6 py-2"
          onClick={startQuizzes}
        >
          Start Quiz
        </button>
        <Image
          width={50}
          height={50}
          className="rounded-full"
          src={userImage || "/placeholder.jpg"}
          alt="userImage"
        />
      </div>
      {/* Map filtered exams to display */}
      <div className="grid grid-cols-1 gap-8">
        {filteredQuizzes.map(
          (quiz: {
            _id: string;
            title: string;
            duration: number;
            numberOfQuestions: number;
          }) => (
            <div
              key={quiz._id}
              className="flex flex-wrap justify-between items-center bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center rounded-t-lg">
                <Image
                  src={renderImg[quiz.title] || "/placeholder.jpg"}
                  alt={quiz.title}
                  width={100}
                  height={100}
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {quiz.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  <span className="font-semibold">Duration : </span>
                  {quiz.duration} minutes
                </p>
              </div>
              <div className="px-4 py-6">
                <button
                  onClick={startQuizzes}
                  className="bg-maincolor text-white text-sm py-3 px-4 rounded-lg hover:bg-maincolor-dark transition-colors duration-200"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          )
        )}
      </div>
      {/* When start show exams */}
      <div
        className={`${display} w-full flex-wrap justify-center items-center justify-items-center bg-gray-200/70 dark:bg-gray-900/70 h-screen absolute top-0 right-0`}
      >
        <div className="w-3/5">
          <StartQuiz />
        </div>
      </div>
    </section>
  );
}
