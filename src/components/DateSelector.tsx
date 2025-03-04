"use client";

import { DayPicker, SelectRangeEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CabinType, Settings } from "@/src/lib/data-service";
import { useReservation } from "@/src/context/ReservationContext";
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";

interface DateSelectorProps {
  settings: Settings | null;
  bookedDates: Date[];
  cabin: CabinType;
}

interface Range {
  from: Date | undefined;
  to: Date | undefined;
}

function isAlreadyBooked(range: Range, datesArr: Date[]): boolean {
  if (!range.from || !range.to) {
    return false;
  }

  const interval = { start: range.from, end: range.to };
  return datesArr.some((date) => {
    return isWithinInterval(date, interval);
  });
}

function DateSelector({ settings, cabin }: DateSelectorProps) {
  const { range, setRange, resetRange, bookedDates = [] } = useReservation();

  // Create a wrapper function to adapt setRange to SelectRangeEventHandler
  const handleRangeSelect: SelectRangeEventHandler = (selectedRange) => {
    setRange({
      from: selectedRange?.from ?? undefined,
      to: selectedRange?.to ?? undefined,
    });
  };

  const displayRange = isAlreadyBooked(range, bookedDates) ? undefined : range;

  const regularPrice: number = cabin?.regularPrice;
  const discount: number = cabin?.discount;
  const numNights =
    displayRange && displayRange.from && displayRange.to
      ? differenceInDays(displayRange.to, displayRange.from)
      : 0;
  const cabinPrice: number = numNights * (regularPrice - discount);

  // Settings
  const minBookingLength =
    settings?.minBookingLength !== undefined ? settings.minBookingLength : 1;
  const maxBookingLength =
    settings?.maxBookingLength !== undefined ? settings.maxBookingLength : 30;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={handleRangeSelect}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
