import { ReactNode } from "react";
import SideNavigation from "@/src/components/SideNavigation";

interface RootLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: RootLayoutProps) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12">
      <SideNavigation />
      <div>{children}</div>
    </div>
  );
}
