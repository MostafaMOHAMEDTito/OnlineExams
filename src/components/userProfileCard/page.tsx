import { OPTIONS } from "@/app/auth";
import { getServerSession } from "next-auth";
import React from "react";
import userImage from "../../../public/pexels-mastercowley.png";
import Image from "next/image";

const UserProfileCard = async () => {
  const user = await getServerSession(OPTIONS);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <Image
          width={200}
          height={250}
          src={userImage || "../../../public/pexels-mastercowley.png"}
          alt="User"
          className="  object-cover"
        />
      </div>

      {/* User Details */}
      <div className=" w-9/12">
        <h2 className="text-xl font-semibold text-maincolor">
          {user?.username}
        </h2>
        <p className="text-sm text-[#979CA3]">Voluptatem aut</p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: "70%" }} // Adjust based on progress
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around space-x-6 mt-3">
          {/* Quiz Passed */}
          <div className="text-center flex justify-center items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-10 text-maincolor bg-white"
              >
                <path
                  fillRule="evenodd"
                  d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">27</h3>
              <p className="text-sm text-gray-500">Quiz Passed</p>
            </div>
          </div>
          {/* Fastest Time */}
          <div className="text-center flex justify-center items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-10 text-maincolor bg-white"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">13 min</h3>
              <p className="text-sm text-gray-500">Fastest Time</p>
            </div>
          </div>
          {/* Correct Answers */}
          <div className="text-center flex justify-center items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-10 text-maincolor bg-white"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">200</h3>
              <p className="text-sm text-gray-500">Correct Answers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
