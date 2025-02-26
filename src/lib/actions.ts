"use server";

import { auth, signIn, signOut } from "./auth";
import { supabase } from "@/src/lib/supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "@/src/lib/data-service";

const NATIONAL_ID_REGEX = /^[a-zA-Z0-9]{6,12}$/;

interface UpdateGuestProps {
  nationality: string;
  countryFlag: string;
  nationalID: string;
}

function validateNationalID(nationalID: string): void {
  if (!NATIONAL_ID_REGEX.test(nationalID)) {
    throw new Error(
      "Invalid national ID. It must be 6-12 alphanumeric" + " characters.",
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

export async function deleteReservation(bookingId: string) {
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

export async function signInAction(): Promise<void> {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });

  revalidatePath("/");
}
