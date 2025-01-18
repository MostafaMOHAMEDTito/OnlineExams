import React from "react";
import SideNav from "../_components/sideNav/page";
import Quiez from "./_components/Quiez/page";
import UserProfileCard from "@/components/userProfileCard/page";

export default async function Dashboard() {
  // UI rendering
  return (
    <>
      <div >
        <UserProfileCard />
        <Quiez />
      </div>
    </>
  );
}
