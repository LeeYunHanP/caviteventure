"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Calendar,
  Clipboard,
  Users,
  Shield,
  Menu,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  UserMinus,
  BarChart3,
  Clock,
} from "lucide-react";
import { gsap } from "gsap";

// 1) Define explicit interfaces instead of `any`
interface IUser {
  _id: string;
  name: string;
  email: string;
  gender: string;
  role: string;
  location: string;
}

interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdBy: IUser;
  approvedBy: IUser;
}

interface ILog {
  action: string;
  userId: IUser;
  createdAt: string;
}

interface IDashboardData {
  totalUsers: number;
  totalMale: number;
  totalFemale: number;
  approvedEvents: IEvent[];
  logs: ILog[];
  allUsers: IUser[];
  admins: IUser[];
}

interface SuperAdminDashboardClientProps {
  dashboardData: IDashboardData;
}

export default function SuperAdminDashboardClient({ dashboardData }: SuperAdminDashboardClientProps) {
  const [fetchedData, setFetchedData] = useState<IDashboardData>(dashboardData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeSection] = useState<
    "overview" | "approvedEvents" | "logs" | "allUsers" | "admins"
  >("overview");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Refs for animations
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const refreshButtonRef = useRef<HTMLButtonElement>(null);
  const actionButtonRefs = useRef<HTMLButtonElement[]>([]);

  // Helper to add refs
  const addToCardRefs = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };
  const addToActionButtonRefs = (el: HTMLButtonElement | null) => {
    if (el && !actionButtonRefs.current.includes(el)) actionButtonRefs.current.push(el);
  };

  // Fetch data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/superadmin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const data: IDashboardData = await res.json();
      setFetchedData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Clear success message after 5s
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // Animate cards on section change
  useEffect(() => {
    if (loading) return;
    const cards = [...cardRefs.current];
    gsap.set(cards, { opacity: 0, y: 20, transformPerspective: 800 });
    gsap.to(cards, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" });
  }, [activeSection, loading]);

  // Make user admin
  const handleMakeAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to make this user an admin?")) return;
    setActionInProgress(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });
      if (!res.ok) throw new Error("Failed to update user role");
      setSuccessMessage("User role updated to admin successfully!");
      fetchDashboardData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionInProgress(null);
    }
  };

  // Remove admin
  const handleRemoveAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to remove the admin role?")) return;
    setActionInProgress(adminId);
    try {
      const res = await fetch(`/api/admin/users/${adminId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user" }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      setSuccessMessage("Admin role removed successfully!");
      fetchDashboardData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionInProgress(null);
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e5]">
        <div className="bg-white rounded-xl shadow-lg border border-[#e6d7c3] p-8 max-w-md w-full">
          <div className="absolute top-0 left-0 h-1 bg-[#8d6e63] loading-bar"></div>
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-[#e6d7c3]"></div>
              <div className="w-16 h-16 rounded-full border-t-4 border-[#8d6e63] absolute top-0 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <LayoutDashboard size={24} className="text-[#8d6e63]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#5d4037] mb-2">Loading Dashboard</h3>
            <p className="text-[#8d6e63] text-center mb-4">Preparing your administrative interface...</p>
            <div className="grid grid-cols-3 gap-2 w-full mt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-2 bg-[#e6d7c3] rounded-full loading-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e5]">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-[#e6d7c3] text-center max-w-md">
          <AlertTriangle size={32} className="text-red-500 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-[#5d4037] mb-2">Error</h3>
          <p className="text-[#8d6e63] mb-4">{error}</p>
          <button onClick={fetchDashboardData} className="px-4 py-2 bg-[#8d6e63] text-white rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Destructure data
  const {
    totalUsers,
    totalMale,
    totalFemale,
    approvedEvents,
    logs,
    allUsers,
    admins,
  } = fetchedData;

  // Recent logs slice
  const recentLogs = logs.slice(0, 5);

  // Render per section
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 success-message">
                <CheckCircle2 size={20} className="text-green-500 mr-2 inline-block" />
                <span className="text-green-700">{successMessage}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#5d4037] flex items-center">
                <BarChart3 className="mr-2" /> Overview
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={fetchDashboardData}
                className="flex items-center gap-1 px-3 py-2 bg-[#f8f5f0] rounded-lg"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Users", value: totalUsers, Icon: Users },
                { label: "Male Users", value: totalMale, Icon: Users },
                { label: "Female Users", value: totalFemale, Icon: Users },
              ].map(({ label, value, Icon }, idx) => (
                <div key={idx} ref={addToCardRefs} className="bg-white p-5 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[#5d4037] font-medium">{label}</h3>
                      <p className="text-3xl font-bold text-[#5d4037] mt-2">{value}</p>
                    </div>
                    <div className="p-2 rounded-full bg-[#f8f5f0]">
                      <Icon className="text-[#8d6e63]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="flex items-center text-xl font-bold text-[#5d4037]">
                <Clock className="mr-2" /> Recent Actions
              </h3>
              <div ref={addToCardRefs} className="bg-white rounded-lg shadow-md p-5">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#f8f5f0]">
                      <th className="py-2 px-4 text-left">Action</th>
                      <th className="py-2 px-4 text-left">User</th>
                      <th className="py-2 px-4 text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 px-4">{log.action}</td>
                        <td className="py-2 px-4">{log.userId.name}</td>
                        <td className="py-2 px-4">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "approvedEvents":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#5d4037] flex items-center">
                <Calendar className="mr-2" /> Approved Events
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={fetchDashboardData}
                className="flex items-center gap-1 px-3 py-2 bg-[#f8f5f0] rounded-lg"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <div ref={addToCardRefs} className="bg-white rounded-lg shadow-md p-5 overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#f8f5f0]">
                    {[
                      "Title",
                      "Description",
                      "Date",
                      "Location",
                      "Created By",
                      "Approved By",
                    ].map((h) => (
                      <th key={h} className="py-2 px-4 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approvedEvents.map((ev) => (
                    <tr key={ev._id} className="border-b">
                      <td className="py-2 px-4 font-medium text-[#5d4037]">{ev.title}</td>
                      <td className="py-2 px-4 text-[#8d6e63]">
                        {ev.description.length > 50 ? ev.description.slice(0, 50) + '...' : ev.description}
                      </td>
                      <td className="py-2 px-4">{new Date(ev.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{ev.location}</td>
                      <td className="py-2 px-4">{ev.createdBy.name}</td>
                      <td className="py-2 px-4">{ev.approvedBy.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "logs":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#5d4037] flex items-center">
                <Clipboard className="mr-2" /> Event Logs
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={fetchDashboardData}
                className="flex items-center gap-1 px-3 py-2 bg-[#f8f5f0] rounded-lg"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <div ref={addToCardRefs} className="bg-white rounded-lg shadow-md p-5 overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#f8f5f0]">
                    <th className="py-2 px-4 text-left">Action</th>
                    <th className="py-2 px-4 text-left">User</th>
                    <th className="py-2 px-4 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2 px-4">{log.action}</td>
                      <td className="py-2 px-4">{log.userId.name}</td>
                      <td className="py-2 px-4">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "allUsers":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#5d4037] flex items-center">
                <Users className="mr-2" /> All Users
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={fetchDashboardData}
                className="flex items-center gap-1 px-3 py-2 bg-[#f8f5f0] rounded-lg"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <div ref={addToCardRefs} className="bg-white rounded-lg shadow-md p-5 overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#f8f5f0]">
                    {[
                      "Name",
                      "Email",
                      "Gender",
                      "Role",
                      "Location",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="py-2 px-4 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u._id} className="border-b">
                      <td className="py-2 px-4 font-medium">{u.name}</td>
                      <td className="py-2 px-4">{u.email}</td>
                      <td className="py-2 px-4 capitalize">{u.gender}</td>
                      <td className="py-2 px-4">{u.role}</td>
                      <td className="py-2 px-4">{u.location}</td>
                      <td className="py-2 px-4">
                        {u.role === 'user' && (
                          <button
                            ref={addToActionButtonRefs}
                            onClick={() => handleMakeAdmin(u._id)}
                            disabled={actionInProgress === u._id}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg flex items-center gap-1"
                          >
                            {actionInProgress === u._id ? (
                              <RefreshCw className="animate-spin" />
                            ) : (
                              <UserPlus />
                            )}
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "admins":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#5d4037] flex items-center">
                <Shield className="mr-2" /> Admins
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={fetchDashboardData}
                className="flex items-center gap-1 px-3 py-2 bg-[#f8f5f0] rounded-lg"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <div ref={addToCardRefs} className="bg-white rounded-lg shadow-md p-5 overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#f8f5f0]">
                    {[
                      "Name",
                      "Email",
                      "Gender",
                      "Location",
                      "Actions",
                    ].map((h) => (<th key={h} className="py-2 px-4 text-left">{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr key={a._id} className="border-b">
                      <td className="py-2 px-4 font-medium">{a.name}</td>
                      <td className="py-2 px-4">{a.email}</td>
                      <td className="py-2 px-4 capitalize">{a.gender}</td>
                      <td className="py-2 px-4">{a.location}</td>
                      <td className="py-2 px-4">
                        <button
                          ref={addToActionButtonRefs}
                          onClick={() => handleRemoveAdmin(a._id)}
                          disabled={actionInProgress === a._id}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-1"
                        >
                          {actionInProgress === a._id ? <RefreshCw className="animate-spin" /> : <UserMinus />}
                          Remove Admin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f0e5] relative">
      {/* Mobile header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-[#5d4037]">Super Admin Dashboard</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-white`}>  ...</aside>
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
    </div>
  );
}
