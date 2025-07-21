"use client";

import { AttestationForm } from "@/components/AttestationForm";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Toaster />
      <AttestationForm />
    </div>
  );
}
