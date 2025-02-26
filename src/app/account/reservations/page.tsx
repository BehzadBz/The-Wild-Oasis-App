import ReservationCard from "@/src/components/ReservationCard";
import Link from "next/link";
import { auth } from "@/src/lib/auth";
import { getBookings } from "@/src/lib/data-service";

export const metadata = {
  title: "Reservation",
};

export default async function Page() {
  const session = await auth();
  if (!session?.user.guestId) {
    return <p>You need to be logged in to view your reservations.</p>;
  }

  const bookings = await getBookings(session.user.guestId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <Link className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <ReservationCard booking={booking} key={booking.id} />
          ))}
        </ul>
      )}
    </div>
  );
}
