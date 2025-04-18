"use client";

import React from "react";
import Link from "next/link";

export default function RoleNavbar({ userRole }: { userRole: "user" | "admin" | "superadmin" }) {
  if (userRole === "superadmin") {
    // 3rd private navbar
    return (
      <nav className="flex gap-4 p-4 bg-gray-200 shadow">
        <Link href="/admindashboard">AdminDashboard</Link>
        <Link href="/event-approval">EventApproval</Link>
        <Link href="/profile">Profile</Link>
      </nav>
    );
  } else if (userRole === "admin") {
    // 2nd private navbar
    return (
      <nav className="flex gap-4 p-4 bg-gray-200 shadow">
        <Link href="/admindashboard">Dashboard</Link>
        <Link href="/create-event">Create Event</Link>
        <Link href="/profile">Profile</Link>
      </nav>
    );
  } else {
    // 1st private navbar for normal user
    return (
      <nav className="flex gap-4 p-4 bg-gray-200 shadow">
        <Link href="/homepage">Home</Link>
        <Link href="/eventpage">Events</Link>
        <Link href="/exhibitpage">Exhibit</Link>
        <Link href="/profilepage">Profile</Link>
      </nav>
    );
  }
}
