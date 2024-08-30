import Activity from "@/components/home/Activity";
import HomeFooter from "@/components/home/HomeFooter";
import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import MainLayout from "@/components/layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <main className="w-full h-full xs:w-xs">
        <HomeHeader />
        <SearchBar />
        <Activity />
        <HomeFooter />
      </main>
    </MainLayout>
  );
}
