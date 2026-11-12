import type { Metadata } from "next";
import { HomeArchive } from "@/components/HomeArchive";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeArchive page={1} />;
}
