import { eachDayOfInterval } from "date-fns";
import { supabase } from "@/src/lib/supabase";

// Define interfaces for the data structures
interface Cabin {
  id: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
}

interface Guest {
  id: string;
  email: string;
  // Add other fields as necessary
}

interface Booking {
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
}

interface Settings {
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

export async function getCabin(id: string): Promise<Cabin | null> {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
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
    console.error(error);
    return null;
  }

  return data;
}

export const getCabins = async function (): Promise<Cabin[]> {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins!inner(name, image)",
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return (data ?? []).map((booking) => ({
    ...booking,
    cabins: Array.isArray(booking.cabins) ? booking.cabins[0] : booking.cabins,
  }));
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    throw new Error("Guest could not be created");
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
export async function updateGuest(
  id: string,
  updatedFields: Partial<Guest>,
): Promise<Guest | null> {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(
  id: string,
  updatedFields: Partial<Booking>,
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

// Delete

export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
}
