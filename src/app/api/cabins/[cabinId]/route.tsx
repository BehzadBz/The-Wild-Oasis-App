import { getBookedDatesByCabinId, getCabin } from "@/src/lib/data-service";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { cabinId: string };
  },
) {
  const { cabinId } = params;
  if (!cabinId) {
    return new Response(JSON.stringify({ message: "Cabin ID is required" }), {
      status: 400,
    });
  }

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);

    return new Response(JSON.stringify({ cabin, bookedDates }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Failed to get cabin ${cabinId}`,
        error,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
}
