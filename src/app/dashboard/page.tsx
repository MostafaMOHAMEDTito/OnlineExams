import React from "react";
import SideNav from "../_components/sideNav/page";
import Quiez from "./_components/Quiez/page";
import UserProfileCard from "@/components/userProfileCard/page";

export default async function Dashboard() {
  // UI rendering
  return (
    <section className="relative">
      <SideNav />
      <div className="p-4 sm:ml-64 w-[1063]">
        <UserProfileCard/>
        <Quiez />
      </div>
    </section>
  );
}
