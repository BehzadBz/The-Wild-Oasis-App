import { eachDayOfInterval } from "date-fns";
import { supabase } from "@/src/lib/supabase";
import { notFound } from "next/navigation";

// Define interfaces for the data structures
export interface CabinType {
  id: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
}

export interface Guest {
  id: string;
  email?: string;
  fullName?: string;
  nationality: string;
  nationalID: string;
  countryFlag: string;
  guestId?: string;
  // Add other fields as necessary
}

export interface Booking {
  id: string;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: string;
  cabinId: string;
  cabins: {
    name: string;
    image: string;
  };
  status: string;
}

export interface Settings {
  id: number;
  created_at: string; // Using string because Supabase returns timestamps as ISO strings
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
}

interface Country {
  name: string;
  flag: string;
}

// Get

export async function getCabin(id: string): Promise<CabinType | null> {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching cabin:", error.message || error);

    // Handle the case where no rows are returned
    if (
      error.message === "JSON object requested, multiple (or no) rows returned"
    ) {
      console.error("No cabin found with the provided ID:", id);
      notFound();
    }

    // Handle other errors
    throw new Error("Failed to fetch cabin");
  }

  return data;
}

export async function getCabinPrice(id: string): Promise<{
  regularPrice: number;
  discount: number;
} | null> {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching cabin price:", error.message || error);
    return null;
  }

  return data;
}

export const getCabins = async function (): Promise<CabinType[]> {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image, description")
    .order("name");

  if (error) {
    console.error("Error fetching cabins:", error.message || error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string): Promise<Guest | null> {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching guest:", error.message || error);
    return null;
  }

  return data;
}

export async function getBooking(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching booking:", error.message || error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, status, cabins(name, image)",
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error("Error fetching bookings:", error.message || error);
    throw new Error("Bookings could not be loaded");
  }

  // Ensure data is an array before proceeding
  if (!Array.isArray(data)) {
    console.error("Unexpected data format from Supabase:", data);
    return [];
  }

  return data.map((booking) => {
    // Ensure cabins exist and handle cases where it's missing
    const cabinData = booking.cabins
      ? Array.isArray(booking.cabins)
        ? booking.cabins[0]
        : booking.cabins
      : { name: "Unknown", image: "" };

    return {
      ...booking,
      cabins: cabinData,
    };
  });
}

export async function getBookedDatesByCabinId(
  cabinId: string,
): Promise<Date[]> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayISOString = today.toISOString(); // Keep today as a Date, store ISO string separately

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${todayISOString},status.eq.checked-in`);

  if (error) {
    console.error("Error fetching booked dates:", error.message || error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  return data
    .map((booking: Booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();
}

export async function getSettings(): Promise<Settings | null> {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error("Error fetching settings:", error.message || error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries(): Promise<Country[]> {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag",
    );
    return await res.json();
  } catch {
    throw new Error("Could not fetch countries");
  }
}

// Create
export async function createGuest(
  newGuest: Partial<Guest>,
): Promise<Guest | null> {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error("Error fetching countries:", error);
    throw new Error("Could not fetch countries");
  }

  return data;
}

export async function createBooking(
  newBooking: Partial<Booking>,
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

// Update

// The updatedFields is an object which should ONLY contain the updated data
// export async function updateGuest(
//   id: string,
//   updatedFields: Partial<Guest>,
// ): Promise<Guest | null> {
//   const { data, error } = await supabase
//     .from("guests")
//     .update(updatedFields)
//     .eq("id", id)
//     .select()
//     .single();
//
//   if (error) {
//     console.error(error);
//     throw new Error("Guest could not be updated");
//   }
//   return data;
// }
//
// export async function updateBooking(
//   id: string,
//   updatedFields: Partial<Booking>,
// ): Promise<Booking | null> {
//   const { data, error } = await supabase
//     .from("bookings")
//     .update(updatedFields)
//     .eq("id", id)
//     .select()
//     .single();
//
//   if (error) {
//     console.error(error);
//     throw new Error("Booking could not be updated");
//   }
//   return data;
// }
//
// // Delete
// export async function deleteBooking(id: string): Promise<void> {
//   const { error } = await supabase.from("bookings").delete().eq("id", id);
//
//   if (error) {
//     console.error(error);
//     throw new Error("Booking could not be deleted");
//   }
// }
