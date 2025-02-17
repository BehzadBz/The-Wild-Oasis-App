import { CabinType, getCabin, getCabins } from "@/src/lib/data-service";
import Reservation from "@/src/components/Reservation";
import { Suspense } from "react";
import Spinner from "@/src/components/Spinner";
import Cabin from "@/src/components/Cabin";

type Params = Promise<{ cabinId: string }>;

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const cabin = await getCabin(params.cabinId);

  if (!cabin) {
    return {
      title: "Cabin not found",
    };
  }

  return { title: `${cabin.name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  if (!cabins || cabins.length === 0) {
    console.warn("No cabins found for static generation.");
  }

  return cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));
}

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const cabin: CabinType | null = await getCabin(params.cabinId);

  if (!cabin) {
    throw new Error("Cabin not found");
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
