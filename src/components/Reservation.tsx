import DateSelector from "@/src/components/DateSelector";
import ReservationForm from "@/src/components/ReservationForm";
import {
  CabinType,
  getBookedDatesByCabinId,
  getSettings,
} from "@/src/lib/data-service";

interface ReservationProps {
  cabin: CabinType;
}

export default async function Reservation({ cabin }: ReservationProps) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      <ReservationForm cabin={cabin} />
    </div>
  );
}
