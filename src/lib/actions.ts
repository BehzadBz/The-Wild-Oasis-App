"use server";

import { auth, signIn, signOut } from "./auth";
import { supabase } from "@/src/lib/supabase";
import { revalidatePath } from "next/cache";

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

export async function signInAction(): Promise<void> {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction(): Promise<void> {
  // Clear Supabase client session (if using Supabase)
  await supabase.auth.signOut();

  // Clear server-side session
  await signOut({ redirectTo: "/" });

  // Clear client-side state
  localStorage.clear();
  sessionStorage.clear();

  // Force a page reload to reset the app state
  window.location.href = "/";
}
