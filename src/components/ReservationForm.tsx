"use client";

import { CabinType } from "@/src/lib/data-service";
import { useAuth } from "@/src/context/AuthContext";
import Image from "next/image";
import { useReservation } from "../context/ReservationContext";
import { differenceInDays } from "date-fns";
import { createBooking } from "../lib/actions";
import SubmitButton from "./SubmitButton";

interface ReservationFormProps {
  cabin?: CabinType;
}

function ReservationForm({ cabin }: ReservationFormProps) {
  const { range, resetRange } = useReservation();
  const session = useAuth();

  const { regularPrice = 0, discount = 0, id, maxCapacity = 0 } = cabin ?? {};

  const startDate = range?.from;
  const endDate = range?.to;
  const numNights =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate: startDate?.toISOString() ?? "",
    endDate: endDate?.toISOString() ?? "",
    numNights,
    cabinPrice,
    cabinId: id ?? "",
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      {session?.user?.image && (
        <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
          <p>Logged in as</p>

          <div className="flex gap-2 items-center justify-center">
            <div className="relative h-8 w-8">
              <Image
                className="rounded-full object-cover"
                fill
                src={session.user.image}
                alt={session.user.name ?? "User Profile"}
                referrerPolicy="no-referrer"
              />
            </div>
            <p>{session.user.name}</p>
          </div>
        </div>
      )}

      <form
        action={async (FormData) => {
          await createBookingWithData(FormData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
