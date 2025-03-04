"use server";

import { auth, signIn, signOut } from "./auth";
import { supabase } from "@/src/lib/supabase";
import { revalidatePath } from "next/cache";
import { Booking, getBookings } from "@/src/lib/data-service";
import { redirect } from "next/navigation";

const NATIONAL_ID_REGEX = /^[a-zA-Z0-9]{6,12}$/;

interface UpdateGuestProps {
  nationality: string;
  countryFlag: string;
  nationalID: string;
}

function validateNationalID(nationalID: string): void {
  if (!NATIONAL_ID_REGEX.test(nationalID)) {
    throw new Error(
      "Invalid national ID. It must be 6-12 alphanumeric" + " characters."
    );
  }
}

export async function updateGuest(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session)
    throw new Error("You must be logged in to update guest information.");

  const nationalID = formData.get("nationalID") as string;
  const nationalityData = formData.get("nationality") as string;

  const [nationality, countryFlag] = nationalityData.split("%");

  validateNationalID(nationalID);

  const updateData: UpdateGuestProps = { nationality, countryFlag, nationalID };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function createBooking(
  bookingData: Booking,
  formData: FormData
): Promise<void> {
  const session = await auth();
  if (!session || !session.user.guestId)
    throw new Error("You must be logged in to update guest information.");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: (formData.get("observations") as string | null)?.slice(
      0,
      1000
    ),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId: string) {
  const session = await auth();
  if (!session || !session.user.guestId)
    throw new Error("You must be logged in to update guest information.");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not" + " allowed to delete this booking!");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData: FormData) {
  const session = await auth();
  if (!session || !session.user.guestId)
    throw new Error("You must be logged in to update guest information.");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  const bookingId = Number(formData.get("bookingId"));

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not" + " allowed to update this booking!");

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: (formData.get("observations") as string | null)?.slice(
      0,
      1000
    ),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

export async function signInAction(): Promise<void> {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction(): Promise<void> {
  "use server";

  const session = await auth();
  if (!session?.user) {
    return;
  }
  await signOut({ redirect: false });
  redirect("/");
}
