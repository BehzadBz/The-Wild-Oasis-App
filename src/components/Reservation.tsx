import {
  CabinType,
  getBookedDatesByCabinId,
  getSettings,
} from "@/src/lib/data-service";
import ReservationClient from "@/src/components/ReservationClient";

interface ReservationProps {
  cabin: CabinType;
}

export default async function Reservation({ cabin }: ReservationProps) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  // Check if settings is null and handle accordingly
  if (!settings) {
    return <div>Error: Unable to load settings.</div>; // Or some fallback UI
  }

  return (
    <ReservationClient
      cabin={cabin}
      settings={settings}
      bookedDates={bookedDates}
    />
  );
}
