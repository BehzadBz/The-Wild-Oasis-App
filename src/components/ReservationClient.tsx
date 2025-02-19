"use client";

import { CabinType, Settings } from "@/src/lib/data-service";
import React from "react";
import { useAuth } from "@/src/context/AuthContext";
import DateSelector from "@/src/components/DateSelector";
import ReservationForm from "@/src/components/ReservationForm";
import LoginMessage from "@/src/components/LoginMessage";

interface ReservationFormProps {
  cabin: CabinType;
  settings: Settings;
  bookedDates: Date[];
}

export default function ReservationClient({
  cabin,
  settings,
  bookedDates,
}: ReservationFormProps) {
  const session = useAuth();

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? <ReservationForm cabin={cabin} /> : <LoginMessage />}
    </div>
  );
}
