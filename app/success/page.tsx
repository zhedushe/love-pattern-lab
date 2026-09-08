import { Suspense } from "react";
import { SuccessExperience } from "@/components/success-experience";

export default function SuccessPage() {
  return <Suspense fallback={<main className="status-page"><div className="spinner" /></main>}><SuccessExperience /></Suspense>;
}
