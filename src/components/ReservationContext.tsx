"use client";

import React, { createContext, useContext, useState } from "react";

// Explicitly define the type of initialState
const initialState: {
  from: Date | undefined;
  to: Date | undefined;
} = { from: undefined, to: undefined };

interface ReservationContextType {
  range: { from: Date | undefined; to: Date | undefined };
  setRange: React.Dispatch<
    React.SetStateAction<{
      from: Date | undefined;
      to: Date | undefined;
    }>
  >;
  resetRange: () => void;
}

interface ReservationContextProps {
  children: React.ReactNode;
}

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined,
);

function ReservationProvider({ children }: ReservationContextProps) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}

export { ReservationProvider, useReservation };
