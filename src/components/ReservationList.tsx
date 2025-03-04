"use client";

import { useOptimistic } from "react";
import { Booking } from "../lib/data-service";
import ReservationCard from "./ReservationCard";
import { deleteBooking } from "@/src/lib/actions";

interface ReservationListProps {
  bookings: Booking[];
}

export default function ReservationList({ bookings }: ReservationListProps) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId: string | number) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId: string | number) {
    optimisticDelete(bookingId);
    try {
      await deleteBooking(String(bookingId));
    } catch (error) {
      console.error("Failed to delete booking:", error);
      // Optionally, revert the optimistic update if the deletion fails
      // optimisticRevert(bookingId);
    }
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}
