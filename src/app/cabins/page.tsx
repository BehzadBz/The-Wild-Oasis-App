import { Metadata } from "next";
import CabinList from "@/src/components/CabinList";
import { Suspense } from "react";
import Spinner from "@/src/components/Spinner";
import { Filter } from "@/src/components/Filter";
import ReservationReminder from "@/src/components/ReservationReminder";

export const metadata: Metadata = {
  title: "Cabins",
};

type PageProps = {
  searchParams: { capacity?: string };
};

export default function Page({ searchParams }: PageProps) {
  const filter = searchParams.capacity ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&#39;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
