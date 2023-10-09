import RootProvider from "@/lib/providers/RootProvider";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Practitioner Management System",
  description: "A Practitioner Management System",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProvider>
          <MainLayout>{children}</MainLayout>
        </RootProvider>
      </body>
    </html>
  );
}
