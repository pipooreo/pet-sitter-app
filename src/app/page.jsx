"use client";
import Activity from "@/components/home/Activity";
import HomeFooter from "@/components/home/HomeFooter";
import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import MainLayout from "@/components/layouts/MainLayout";
import { useSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";

export default function Home() {
  const { data: session, status } = useSession();
  console.log(session);
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <BeatLoader size={15} color={"#FF7037"} margin={2} />
      </div>
    );
  }
  return (
    <MainLayout session={session}>
      <main className="w-full h-full xs:w-xs">
        <HomeHeader />
        <SearchBar />
        <Activity />
        <HomeFooter />
      </main>
    </MainLayout>
  );
}
