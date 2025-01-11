"use client";
import LoadingSpinner from "@/app/_components/loadingSpinner/page";
import React, { useEffect, useState } from "react";
import icon from "../../../../public/download (1).png";
import Image from "next/image";
import Link from "next/link";
import RenderInCorrectQuestions from "../_components/renderInCorrectQuestions/page";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { JSON_HEADER } from "@/lib/constants/api.constants";

// Fetch questions from the API
const fetchQuestions = async (token: string | undefined) => {
  if (!token) {
    throw new Error("Missing authentication token.");
  }

  const response = await fetch("https://exam.elevateegy.com/api/v1/questions", {
    headers: {
      ...JSON_HEADER,
      token,
    },
  });

  if (!response.ok) {
    console.error("Fetching failed.");
    throw new Error(`Failed to fetch questions: ${response.statusText}`);
  }

  return response.json();
};

export default function StartQuiz() {
  const session = useSession();
  const token: string | undefined = session.data?.token;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeDown, setTimeDown] = useState<number>(10 * 60);
  const [isDowntime, setIsDowntime] = useState(true);
  const [percentageScore, setPercentageScore] = useState(0);
  const [correctScore, setCorrectScore] = useState(0);
  const [inCorrectScore, setInCorrectScore] = useState(0);
  const [display, setdisPlay] = useState(1); // Change display state
  const [incorrectQuestions, setincorrectQuestions] = useState<any>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchQuestions"],
    queryFn: () => fetchQuestions(token),
    enabled: !!token, // Ensure token is available before fetching
  });

  const questions = data?.questions || [];

  useEffect(() => {
    if (timeDown > 0 && isDowntime) {
      const time = setInterval(() => {
        setTimeDown((prevTimeDown) => prevTimeDown - 1);
      }, 1000);
      return () => clearInterval(time);
    } else if (timeDown === 0 && isDowntime) {
      handleFinished(); // Automatically finish the quiz when time runs out
    }
  }, [timeDown, isDowntime, display]);

  const formtTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSelect = (option: string) => {
    setAnswers((prev: any) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinished = () => {
    // Stop the timer when the quiz is finished
    setIsDowntime(false);

    // Validate `questions` and `answers` arrays
    if (!questions || questions.length === 0) {
      console.error("No questions provided.");
      return;
    }

    // Calculate correct score
    const correctScore = questions.reduce(
      (score: number, question: any, index: number) => {
        if (question.correct === answers[index]) {
          return score + 1; // Increment score if the answer is correct
        }
        return score; // No increment if the answer is incorrect
      },
      0
    );

    // Calculate percentages
    const percentageScore = Math.round((correctScore / questions.length) * 100);
    const inCorrectScore = questions.length - correctScore;

    // Update state
    setCorrectScore(correctScore);
    setInCorrectScore(inCorrectScore);
    setPercentageScore(percentageScore);
    setdisPlay(2); // Display the results
  };

  const showResults = () => {
    // Find all questions where the user's answer is incorrect
    const incorrectQuestions = questions.filter(
      (question: any, index: number) => {
        return question.correct !== answers[index]; // Check if the answer is incorrect
      }
    );
    setincorrectQuestions(incorrectQuestions); // Return the incorrect questions
    setdisPlay(3); // Display the results
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500">Error in Fetch Data</p>
      </div>
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500">No questions available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200/70 flex flex-col items-center p-4 dark:bg-gray-800/70 dark:text-gray-200">
      <div
        className={
          display === 1
            ? "bg-white w-full shadow-2xl rounded-lg dark:bg-gray-800/70 dark:text-gray-200"
            : "bg-white w-full shadow-2xl rounded-lg hidden"
        }
      >
        <div className="w-11/12 m-auto  text-center dark:bg-gray-800/70 dark:text-gray-200">
          {/* Timer */}
          <div className="flex justify-between items-center mb-4 text-maincolor mt-4">
            <p className="text-sm sm:text-base font-medium">
              Question {`${currentQuestion + 1} of ${questions.length}`}
            </p>
            <div className="flex">
              <Image src={icon} alt="timedown image" width={20} height={20} />
              <p className="text-sm sm:text-base font-medium">
                {formtTime(timeDown)}
              </p>
            </div>
          </div>
          {/* Progress Dots */}
          <div className=" flex justify-center mb-6 space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                  currentQuestion >= index ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          {/* Question */}
          <div className="bg-white w-full my-5 m-auto shadow-md rounded-lg p-4 sm:p-6 dark:bg-gray-800/70 dark:text-gray-200">
            <p className="text-lg sm:text-xl font-medium mb-4">
              {questions[currentQuestion]?.question || "No question available"}
            </p>

            {/* Options */}
            <ul className="">
              {questions[currentQuestion]?.answers?.map(
                (answerObj: { answer: string; key: string }, index: number) => (
                  <li
                    key={index}
                    className={`w-full p-3 sm:p-4 mb-2 rounded-lg cursor-pointer text-sm sm:text-base  dark:bg-gray-800/70 dark:text-gray-200${
                      answers[currentQuestion] === answerObj.key
                        ? "bg-blue-100 text-blue-900 border border-blue-500"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleSelect(answerObj.key)}
                  >
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={answerObj.key}
                        checked={answers[currentQuestion] === answerObj.key}
                        onChange={() => handleSelect(answerObj.key)}
                        className="hidden"
                      />
                      <span className="ms-2 sm:ms-4">{answerObj.answer}</span>
                    </label>
                  </li>
                )
              )}
            </ul>
            {/* Navigation Buttons */}
            <div className="flex justify-around w-full mt-6">
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className={`px-8 sm:py-2 sm:px-10 md:px-16 rounded-lg shadow mx-2 text-sm sm:text-base ${
                  currentQuestion === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-maincolor"
                }`}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  currentQuestion === questions.length - 1 ||
                  !answers[currentQuestion]
                }
                className={`px-8 sm:py-2 sm:px-6 md:px-16 rounded-lg shadow mx-2 text-sm sm:text-base ${
                  currentQuestion === questions.length - 1 ||
                  !answers[currentQuestion]
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-maincolor"
                }`}
              >
                Next
              </button>
              <button
                onClick={handleFinished}
                disabled={!answers[currentQuestion]}
                className={`px-8 sm:py-2 sm:px-6 md:px-16 rounded-lg shadow mx-2 text-sm sm:text-base ${
                  currentQuestion === questions.length - 1 &&
                  answers[currentQuestion]
                    ? "bg-blue-500 text-white hover:bg-maincolor"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed hidden"
                }`}
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          display === 2
            ? "fixed inset-0 bg-black/50 flex items-center justify-center dark:bg-gray-800/70 dark:text-gray-200"
            : ` fixed inset-0 bg-black/50 hidden items-center justify-center `
        }
      >
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg dark:bg-gray-800/70 dark:text-gray-200">
          <h2 className="text-xl font-semibold text-center mb-4">Your score</h2>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-20 h-20">
              {/* Circular Progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="gray"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#3b82f6"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="220"
                  strokeDashoffset={220 - (220 * percentageScore) / 100}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{percentageScore}%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <div className="flex items-center gap-2 text-blue-600">
              <span>Correct</span>
              <span className="bg-blue-100 text-blue-600 rounded-full px-3 py-1">
                {correctScore}
              </span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <span>Incorrect</span>
              <span className="bg-red-100 text-red-600 rounded-full px-3 py-1">
                {inCorrectScore}
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Link
              href="/"
              className="w-5/12 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 "
            >
              <button className=" w-full ">Back</button>
            </Link>

            <button
              onClick={showResults}
              disabled={
                questions.filter(
                  (question: any, index: number) =>
                    question.correct !== answers[index]
                ).length === 0
              }
              className={`px-4 py-2 w-5/12 rounded-lg ${
                questions.filter(
                  (question: any, index: number) =>
                    question.correct !== answers[index]
                ).length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
      <div className={display === 3 ? " flex   " : ` hidden `}>
        <RenderInCorrectQuestions
          answers={answers}
          questions={incorrectQuestions}
        />
      </div>
    </div>
  );
}
