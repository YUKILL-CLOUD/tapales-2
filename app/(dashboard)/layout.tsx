
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
        <Icon 
            icon="fa6-solid:dog" 
            width={32} 
            height={32}
            className="text-primary"
          />
          <span className="hidden lg:block font-bold ">Tapales</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        
        {children}
      </div>
    </div>
  );
}