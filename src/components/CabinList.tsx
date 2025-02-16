import CabinCard from "@/src/components/CabinCard";
import { Cabin, getCabins } from "@/src/lib/data-service";

interface CabinListProps {
  filter: "all" | "small" | "medium" | "large" | string;
}

export default async function CabinList({ filter }: CabinListProps) {
  const cabins = await getCabins();

  if (!cabins.length) return null;

  let displayedCabins: Cabin[] = [];

  if (filter === "all") displayedCabins = cabins;
  if (filter === "small")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  if (filter === "medium")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
    );
  if (filter === "large")
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
