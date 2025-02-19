"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import Image from "next/image";

export default function User() {
  const session = useAuth();

  return (
    <div>
      {session?.user?.image ? (
        <Link
          href="/account"
          className="hover:text-accent-400 transition-colors flex items-center gap-4"
        >
          <div className="relative h-8 w-8">
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User Profile"}
              fill
              className="rounded-full object-cover"
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <span>Guest area</span>
        </Link>
      ) : (
        <Link
          href="/account"
          className="hover:text-accent-400 transition-colors"
        >
          Guest area
        </Link>
      )}
    </div>
  );
}
