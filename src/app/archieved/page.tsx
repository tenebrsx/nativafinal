import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import ArchivedStackPage from "@/components/archived-stack-page";

export const metadata: Metadata = pageMetadata({
  title: "Archived · stack CRM + IA",
  description: "Private archive of homepage CRM and brand AI stack stories.",
  path: "/archieved",
  noindex: true,
});

export default function ArchievedPage() {
  return <ArchivedStackPage />;
}
