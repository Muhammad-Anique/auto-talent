"use client";

import { Loader2Icon } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md  z-50 flex items-center justify-center">
      <div className="p-6 bg-white size-30 justify-center items-center rounded-full flex flex-col ">
        <Loader2Icon className="size-12 text-[#5b6949] animate-spin " />
      </div>
    </div>
  );
}
