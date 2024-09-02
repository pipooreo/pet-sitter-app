"use client";
import Activity from "@/components/home/Activity";
import HomeFooter from "@/components/home/HomeFooter";
import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import MainLayout from "@/components/layouts/MainLayout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

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
