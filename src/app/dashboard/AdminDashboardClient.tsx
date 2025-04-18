"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Shield,
  Edit,
  Trash2,
  Menu,
  X,
  BarChart3,
  Calendar,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface IDashboardData {
  totalUsers: number;
  totalMale: number;
  totalFemale: number;
  logs: Array<{
    _id?: string;
    userId?: { name?: string; email?: string; location?: string };
    actionType?: string;
    createdAt: string;
  }>;
  events: Array<{
    _id: string;
    title: string;
    description?: string;
    date: string;
    location: string;
  }>;
  comments: Array<{
    _id?: string;
    userId?: { name?: string; email?: string };
    eventId?: { title?: string };
    text?: string;
    createdAt: string;
  }>;
  allUsers: Array<{
    _id?: string;
    name: string;
    email: string;
    gender: string;
    location: string;
    role: string;
  }>;
  admins: Array<{
    _id?: string;
    name: string;
    email: string;
    gender: string;
    location: string;
    role: string;
  }>;
}

type IEvent = IDashboardData["events"][number];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function AdminDashboardClient({
  dashboardData,
}: {
  dashboardData?: Partial<IDashboardData>;
}) {
  /* ----------------------------- DESCTRUCTURING ---------------------------- */
  const {
    totalUsers = 0,
    totalMale = 0,
    totalFemale = 0,
    logs = [],
    events = [],
    comments = [],
    allUsers = [],
    admins = [],
  } = dashboardData || {};

  const router = useRouter();

  /* ------------------------------- FILTERING ------------------------------- */
  const filteredUsers = allUsers.filter((usr) => usr.role !== "admin");
  const filteredAdmins = admins.filter((adm) => adm.role === "admin");

  /* ------------------------------- UI STATE -------------------------------- */
  const [activeSection, setActiveSection] = useState<
    "overview" | "comments-events" | "all-users" | "all-admins"
  >("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ----------------------------- ACTION HANDLERS --------------------------- */
  const handleMakeAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to change this user's role to admin?"))
      return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to update user role");
        return;
      }
      alert("User role updated to admin successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Error updating user role.");
    }
  };

  const handleEditEvent = (eventData: IEvent) => {
    window.location.href = `/updateevent/${eventData._id}`;
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to delete event");
        return;
      }
      alert("Event deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Delete event error:", error);
      alert("Error deleting event.");
    }
  };

  /* ------------------------------ RENDERERS ------------------------------- */
  const renderContent = () => {
    switch (activeSection) {
      /* -------------------------------------------------------------------- */
      /*                                OVERVIEW                               */
      /* -------------------------------------------------------------------- */
      case "overview":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#5d4037]">
                Dashboard Overview
              </h2>
              <span
                className="text-sm text-[#8d6e63]"
                suppressHydrationWarning
              >
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Total Users */}
              <div className="bg-white rounded-lg shadow-md p-5 border border-[#e6dfd3] transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[#5d4037]">Total Users</h3>
                  <div className="p-2 bg-[#f8f5f0] rounded-full">
                    <Users size={20} className="text-[#8d6e63]" />
                  </div>
                </div>
                <p className="text-3xl font-bold mt-2 text-[#5d4037]">
                  {totalUsers}
                </p>
                <p className="text-sm text-[#8d6e63] mt-1">
                  Registered accounts
                </p>
              </div>

              {/* Male Users */}
              <div className="bg-white rounded-lg shadow-md p-5 border border-[#e6dfd3] transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[#5d4037]">Male Users</h3>
                  <div className="p-2 bg-[#f8f5f0] rounded-full">
                    <User size={20} className="text-[#8d6e63]" />
                  </div>
                </div>
                <p className="text-3xl font-bold mt-2 text-[#5d4037]">
                  {totalMale}
                </p>
                <p className="text-sm text-[#8d6e63] mt-1">
                  {totalUsers > 0
                    ? Math.round((totalMale / totalUsers) * 100)
                    : 0}
                  % of users
                </p>
              </div>

              {/* Female Users */}
              <div className="bg-white rounded-lg shadow-md p-5 border border-[#e6dfd3] transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[#5d4037]">Female Users</h3>
                  <div className="p-2 bg-[#f8f5f0] rounded-full">
                    <User size={20} className="text-[#8d6e63]" />
                  </div>
                </div>
                <p className="text-3xl font-bold mt-2 text-[#5d4037]">
                  {totalFemale}
                </p>
                <p className="text-sm text-[#8d6e63] mt-1">
                  {totalUsers > 0
                    ? Math.round((totalFemale / totalUsers) * 100)
                    : 0}
                  % of users
                </p>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-[#e6dfd3]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#5d4037] flex items-center">
                  <BarChart3 size={18} className="mr-2 text-[#8d6e63]" />
                  Event Logs
                </h3>
                <span className="text-xs text-[#8d6e63] bg-[#f8f5f0] px-2 py-1 rounded-full">
                  {logs.length} entries
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8f5f0] text-[#5d4037]">
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        User Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => (
                      <tr
                        key={`${log._id || "log"}-${log.createdAt}-${idx}`}
                        className="hover:bg-[#f8f5f0] transition-colors"
                      >
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {log.userId?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {log.userId?.email || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {log.userId?.location || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] capitalize">
                          <span className="px-2 py-1 bg-[#e6dfd3] text-[#5d4037] rounded-full text-xs">
                            {log.actionType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#8d6e63]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-center text-[#8d6e63]"
                        >
                          No logs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      /* -------------------------------------------------------------------- */
      /*                        COMMENTS & EVENTS SECTION                      */
      /* -------------------------------------------------------------------- */
      case "comments-events":
        return (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#5d4037]">
              Comments &amp; Events
            </h2>

            {/* Comments Table */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-[#e6dfd3]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#5d4037] flex items-center">
                  <MessageSquare size={18} className="mr-2 text-[#8d6e63]" />
                  User Comments
                </h3>
                <span className="text-xs text-[#8d6e63] bg-[#f8f5f0] px-2 py-1 rounded-full">
                  {comments.length} comments
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8f5f0] text-[#5d4037]">
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Event
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Comment
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((cmt, idx) => (
                      <tr
                        key={`${cmt._id || "comment"}-${cmt.createdAt}-${idx}`}
                        className="hover:bg-[#f8f5f0] transition-colors"
                      >
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {cmt.userId?.name}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {cmt.userId?.email}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {cmt.eventId?.title}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {cmt.text || "No comment"}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#8d6e63]">
                          {new Date(cmt.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {comments.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-center text-[#8d6e63]"
                        >
                          No comments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Posted Events Table */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-[#e6dfd3]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#5d4037] flex items-center">
                  <Calendar size={18} className="mr-2 text-[#8d6e63]" />
                  All Posted Events
                </h3>
                <span className="text-xs text-[#8d6e63] bg-[#f8f5f0] px-2 py-1 rounded-full">
                  {events.length} events
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8f5f0] text-[#5d4037]">
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr
                        key={ev._id}
                        className="hover:bg-[#f8f5f0] transition-colors"
                      >
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037] font-medium">
                          {ev.title}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {(ev.description || "").length > 50
                            ? `${(ev.description || "").substring(0, 50)}...`
                            : ev.description || "No description"}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {new Date(ev.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {ev.location}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3]">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditEvent(ev)}
                              className="flex items-center justify-center p-1.5 bg-[#e6dfd3] text-[#5d4037] rounded-md hover:bg-[#d7cec7] transition-colors"
                              aria-label="Edit event"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev._id)}
                              className="flex items-center justify-center p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                              aria-label="Delete event"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-center text-[#8d6e63]"
                        >
                          No events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      /* -------------------------------------------------------------------- */
      /*                              ALL USERS                                */
      /* -------------------------------------------------------------------- */
      case "all-users":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#5d4037]">
                All Users
              </h2>
              <span className="text-sm text-[#8d6e63] bg-[#f8f5f0] px-3 py-1 rounded-full">
                {filteredUsers.length} users
              </span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 border border-[#e6dfd3]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8f5f0] text-[#5d4037]">
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Gender
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((usr) => (
                      <tr
                        key={usr._id || usr.email}
                        className="hover:bg-[#f8f5f0] transition-colors"
                      >
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037] font-medium">
                          {usr.name}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {usr.email}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037] capitalize">
                          {usr.gender}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {usr.location}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3]">
                          <span className="px-2 py-1 rounded-full text-xs bg-[#e6dfd3] text-[#5d4037]">
                            {usr.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3]">
                          {usr.role !== "admin" &&
                            usr.role !== "superadmin" &&
                            usr._id && (
                              <button
                                onClick={() => handleMakeAdmin(usr._id!)}
                                className="bg-[#8d6e63] text-white px-3 py-1 rounded-md transition-all hover:bg-[#5d4037]"
                              >
                                Make Admin
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-3 text-center text-[#8d6e63]"
                        >
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      /* -------------------------------------------------------------------- */
      /*                              ALL ADMINS                               */
      /* -------------------------------------------------------------------- */
      case "all-admins":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#5d4037]">
                Admin Users
              </h2>
              <span className="text-sm text-[#8d6e63] bg-[#f8f5f0] px-3 py-1 rounded-full">
                {filteredAdmins.length} admins
              </span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 border border-[#e6dfd3]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8f5f0] text-[#5d4037]">
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Gender
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium border-b border-[#e6dfd3]">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((adm) => (
                      <tr
                        key={adm._id || adm.email}
                        className="hover:bg-[#f8f5f0] transition-colors"
                      >
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037] font-medium">
                          {adm.name}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {adm.email}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037] capitalize">
                          {adm.gender}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3] text-[#5d4037]">
                          {adm.location}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-[#e6dfd3]">
                          <span className="px-2 py-1 bg-[#8d6e63] text-white rounded-full text-xs">
                            {adm.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredAdmins.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-center text-[#8d6e63]"
                        >
                          No admins found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      /* -------------------------------------------------------------------- */
      default:
        return null;
    }
  };

  /* ------------------------------------------------------------------------ */
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f5f0]">
      {/* --------------------------- MOBILE HEADER --------------------------- */}
      <div className="md:hidden bg-white border-b border-[#e6dfd3] p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-[#5d4037]">Admin Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-[#5d4037] hover:bg-[#f8f5f0]"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ----------------------------- SIDEBAR ----------------------------- */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white shadow-md md:shadow-lg flex-shrink-0 border-r border-[#e6dfd3]`}
      >
        <div className="px-6 py-6 border-b border-[#e6dfd3] hidden md:block">
          <h1 className="font-bold text-xl text-[#5d4037]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#8d6e63] mt-1">
            Manage your application
          </p>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveSection("overview");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === "overview"
                  ? "bg-[#8d6e63] text-white font-medium"
                  : "text-[#5d4037] hover:bg-[#f8f5f0]"
              }`}
            >
              <LayoutDashboard size={18} className="mr-3" />
              Overview
            </button>
            <button
              onClick={() => {
                setActiveSection("comments-events");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === "comments-events"
                  ? "bg-[#8d6e63] text-white font-medium"
                  : "text-[#5d4037] hover:bg-[#f8f5f0]"
              }`}
            >
              <MessageSquare size={18} className="mr-3" />
              Comments &amp; Events
            </button>
            <button
              onClick={() => {
                setActiveSection("all-users");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === "all-users"
                  ? "bg-[#8d6e63] text-white font-medium"
                  : "text-[#5d4037] hover:bg-[#f8f5f0]"
              }`}
            >
              <Users size={18} className="mr-3" />
              All Users
            </button>
            <button
              onClick={() => {
                setActiveSection("all-admins");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === "all-admins"
                  ? "bg-[#8d6e63] text-white font-medium"
                  : "text-[#5d4037] hover:bg-[#f8f5f0]"
              }`}
            >
              <Shield size={18} className="mr-3" />
              Admins
            </button>
          </div>
        </nav>
      </aside>

      {/* --------------------------- MAIN CONTENT --------------------------- */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
