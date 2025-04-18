"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

// 1) We define the interface your server data must match:
interface IDashboardData {
  totalUsers: number;
  totalMale: number;
  totalFemale: number;
  approvedEvents: any[]; // rename from 'events' -> 'approvedEvents'
  logs: any[];
  allUsers: any[];
  admins: any[];
}

// 2) Define props for your component
interface SuperAdminDashboardClientProps {
  dashboardData: IDashboardData;
}

export default function SuperAdminDashboardClient({ dashboardData }: SuperAdminDashboardClientProps) {
  // You can optionally store that prop data in state
  const [fetchedData, setFetchedData] = useState<IDashboardData | null>(dashboardData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState<"overview" | "approvedEvents" | "logs" | "allUsers" | "admins">(
    "overview",
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refs for GSAP animations
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const buttonRefs = useRef<HTMLButtonElement[]>([]);
  const refreshButtonRef = useRef<HTMLButtonElement>(null);
  const actionButtonRefs = useRef<HTMLButtonElement[]>([]);

  const addToCardRefs = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  const addToButtonRefs = (el: HTMLButtonElement | null) => {
    if (el && !buttonRefs.current.includes(el)) {
      buttonRefs.current.push(el);
    }
  };

  const addToActionButtonRefs = (el: HTMLButtonElement | null) => {
    if (el && !actionButtonRefs.current.includes(el)) {
      actionButtonRefs.current.push(el);
    }
  };

  const router = useRouter();

  // If you want client-side fetching from /api/superadmin/dashboard:
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/superadmin/dashboard");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch dashboard data");
      }
      const data = await res.json();
      setFetchedData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example: fetch data on mount (optional if you trust server-provided data)
  useEffect(() => {
    fetchDashboardData();

    // Cleanup - reset card positions
    return () => {
      cardRefs.current.forEach((card) => {
        gsap.to(card, {
          x: 0,
          y: 0,
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "power1.out",
        });
      });
    };
  }, []);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Animations
  const handleCardMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const rect = currentTarget.getBoundingClientRect();
    const xOffset = clientX - (rect.left + rect.width / 2);
    const yOffset = clientY - (rect.top + rect.height / 2);

    gsap.to(currentTarget, {
      x: xOffset * 0.03,
      y: yOffset * 0.03,
      rotationY: xOffset / 25,
      rotationX: -yOffset / 25,
      transformPerspective: 800,
      duration: 0.6,
      ease: "power1.out",
      boxShadow: "0 10px 15px -3px rgba(101, 67, 33, 0.1), 0 4px 6px -2px rgba(101, 67, 33, 0.05)",
    });
  };

  const handleCardMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      duration: 0.6,
      ease: "power1.out",
    });
  };

  const handleRefreshButtonHover = () => {
    if (refreshButtonRef.current) {
      gsap.to(refreshButtonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  };

  const handleRefreshButtonLeave = () => {
    if (refreshButtonRef.current) {
      gsap.to(refreshButtonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  };

  const handleActionButtonHover = (event: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(event.currentTarget, {
      y: -3,
      scale: 1.05,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const handleActionButtonLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(event.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  // "Refresh" animation
  const handleRefresh = () => {
    if (refreshButtonRef.current) {
      gsap
        .timeline()
        .to(refreshButtonRef.current, {
          scale: 1.1,
          duration: 0.2,
          ease: "power1.out",
        })
        .to(refreshButtonRef.current.querySelector("svg"), {
          rotation: 360,
          duration: 0.8,
          ease: "power1.inOut",
        })
        .to(refreshButtonRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power1.in",
        });
    }
    fetchDashboardData();
  };

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

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update user role");
        return;
      }

      showSuccessMessage("User role updated to admin successfully!");
      fetchDashboardData(); // re-fetch updated data
    } catch (err: any) {
      setError("Error updating user role.");
    } finally {
      setActionInProgress(null);
    }
  };

  // Remove admin role
  const handleRemoveAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to remove the admin role?")) return;
    setActionInProgress(adminId);

    try {
      const res = await fetch(`/api/admin/users/${adminId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user" }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update role");
        return;
      }

      showSuccessMessage("Admin role removed successfully!");
      fetchDashboardData();
    } catch (err: any) {
      setError("Error updating role.");
    } finally {
      setActionInProgress(null);
    }
  };

  // Animate success messages
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      const successElement = document.querySelector(".success-message");
      if (successElement) {
        gsap.fromTo(
          successElement,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "back.out" },
        );
      }
    }, 10);
  };

  // GSAP animation when activeSection changes
  useEffect(() => {
    if (!loading && cardRefs.current.length > 0) {
      gsap.set(cardRefs.current, {
        opacity: 0,
        y: 20,
        rotationX: 0,
        rotationY: 0,
        transformPerspective: 800,
      });
      gsap.to(cardRefs.current, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "all",
      });
    }
  }, [activeSection, loading]);

  // Add custom loading CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .loading-bar {
        width: 0%;
        animation: loading-bar-animation 2s ease-in-out infinite;
      }
      
      .loading-pulse {
        animation: loading-pulse-animation 1.5s ease-in-out infinite;
      }
      
      @keyframes loading-bar-animation {
        0% { width: 0%; }
        50% { width: 100%; }
        100% { width: 0%; }
      }
      
      @keyframes loading-pulse-animation {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Show a fancy loading screen if loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e5]">
        <div className="bg-white rounded-xl shadow-lg border border-[#e6d7c3] p-8 max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-[#8d6e63] loading-bar"></div>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-[#e6d7c3]"></div>
              <div className="w-16 h-16 rounded-full border-t-4 border-[#8d6e63] absolute top-0 left-0 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <LayoutDashboard size={24} className="text-[#8d6e63]" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#5d4037] mb-2">Loading Dashboard</h3>
            <p className="text-[#8d6e63] text-center mb-4">Preparing your administrative interface...</p>

            <div className="grid grid-cols-3 gap-2 w-full mt-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 bg-[#e6d7c3] rounded-full loading-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error screen if error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e5]">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-[#e6d7c3] text-center max-w-md">
          <div className="text-red-500 mb-4 mx-auto">
            <AlertTriangle size={32} className="mx-auto" />
          </div>
          <h3 className="text-[#5d4037] font-bold text-xl mb-2">Error</h3>
          <p className="text-[#8d6e63]">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-[#8d6e63] text-white rounded-lg hover:bg-[#5d4037] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Safely destructure the data from fetchedData (or fallback to the prop if fetchedData is null)
  const {
    totalUsers = 0,
    totalMale = 0,
    totalFemale = 0,
    approvedEvents = [],
    logs = [],
    allUsers = [],
    admins = [],
  } = fetchedData || dashboardData;

  // If you want only the first 5 logs in the "Recent Actions" block:
  const recentLogs = logs.slice(0, 5);

  // Renders the main content sections depending on activeSection
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Success message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start success-message">
                <CheckCircle2 size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertTriangle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Stats Section */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#5d4037] flex items-center">
                <BarChart3 className="mr-2 h-6 w-6 text-[#8d6e63]" />
                Dashboard Overview
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={handleRefresh}
                className="text-sm text-[#8d6e63] bg-[#f8f5f0] hover:bg-[#e6d7c3] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                onMouseEnter={handleRefreshButtonHover}
                onMouseLeave={handleRefreshButtonLeave}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                ref={addToCardRefs}
                className="bg-white rounded-lg shadow-md p-5 border border-[#e6d7c3] transition-all duration-300"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#5d4037]">Total Users</h3>
                    <p className="text-3xl font-bold text-[#5d4037] mt-2">{totalUsers}</p>
                  </div>
                  <div className="bg-[#f8f5f0] p-2 rounded-full">
                    <Users size={24} className="text-[#8d6e63]" />
                  </div>
                </div>
              </div>

              <div
                ref={addToCardRefs}
                className="bg-white rounded-lg shadow-md p-5 border border-[#e6d7c3] transition-all duration-300"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#5d4037]">Male Users</h3>
                    <p className="text-3xl font-bold text-[#5d4037] mt-2">{totalMale}</p>
                    <p className="text-sm text-[#8d6e63]">
                      {totalUsers > 0 ? Math.round((totalMale / totalUsers) * 100) : 0}% of users
                    </p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Users size={24} className="text-blue-500" />
                  </div>
                </div>
              </div>

              <div
                ref={addToCardRefs}
                className="bg-white rounded-lg shadow-md p-5 border border-[#e6d7c3] transition-all duration-300"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#5d4037]">Female Users</h3>
                    <p className="text-3xl font-bold text-[#5d4037] mt-2">{totalFemale}</p>
                    <p className="text-sm text-[#8d6e63]">
                      {totalUsers > 0 ? Math.round((totalFemale / totalUsers) * 100) : 0}% of users
                    </p>
                  </div>
                  <div className="bg-pink-50 p-2 rounded-full">
                    <Users size={24} className="text-pink-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Logs Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#5d4037] flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-[#8d6e63]" />
                  Recent Actions
                </h3>
              </div>

              <div
                ref={addToCardRefs}
                className="bg-white rounded-lg shadow-md p-5 border border-[#e6d7c3] overflow-x-auto transition-all duration-300"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8f5f0]">
                      <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Action</th>
                      <th className="px-4 py-3 text-left text-[#5d4037] font-medium">User</th>
                      <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.length > 0 ? (
                      recentLogs.map((log: any, idx: number) => (
                        <tr key={idx} className="hover:bg-[#f8f5f0] border-b border-[#e6d7c3]/50">
                          <td className="px-4 py-3 text-[#5d4037]">{log.action}</td>
                          <td className="px-4 py-3 text-[#8d6e63]">{log.userId?.name || "N/A"}</td>
                          <td className="px-4 py-3 text-[#8d6e63]">{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center px-4 py-4 text-[#8d6e63]">
                          No recent actions.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "approvedEvents":
        return (
          <div className="space-y-6">
            {/* Success message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start success-message">
                <CheckCircle2 size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertTriangle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#5d4037] flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-[#8d6e63]" />
                Approved Events
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={handleRefresh}
                className="text-sm text-[#8d6e63] bg-[#f8f5f0] hover:bg-[#e6d7c3] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                onMouseEnter={handleRefreshButtonHover}
                onMouseLeave={handleRefreshButtonLeave}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div
              ref={addToCardRefs}
              className="bg-white rounded-lg shadow-md p-5 border border-[#e6d7c3] overflow-x-auto transition-all duration-300"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#f8f5f0]">
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Title</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Description</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Location</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Created By</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Approved By</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedEvents.length > 0 ? (
                    approvedEvents.map((event: any) => (
                      <tr key={event._id} className="hover:bg-[#f8f5f0] border-b border-[#e6d7c3]/50">
                        <td className="px-4 py-3 text-[#5d4037] font-medium">{event.title}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">
                          {(event.description || "").length > 50
                            ? (event.description || "").substring(0, 50) + "..."
                            : event.description || "No description"}
                        </td>
                        <td className="px-4 py-3 text-[#8d6e63]">
                          {new Date(event.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-[#8d6e63]">{event.location}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">{event.createdBy?.name || "N/A"}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">{event.approvedBy?.name || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center px-4 py-4 text-[#8d6e63]">
                        No approved events found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "logs":
        return (
          <div className="space-y-6">
            {/* Success message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start success-message">
                <CheckCircle2 size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertTriangle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#5d4037] flex items-center">
                <Clipboard className="mr-2 h-6 w-6 text-[#8d6e63]" />
                Event Logs
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={handleRefresh}
                className="text-sm text-[#8d6e63] bg-[#f8f5f0] hover:bg-[#e6d7c3] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                onMouseEnter={handleRefreshButtonHover}
                onMouseLeave={handleRefreshButtonLeave}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div
              ref={addToCardRefs}
              className="bg-white rounded-lg shadow-md p-5 border border-[#e6d7c3] overflow-x-auto transition-all duration-300"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#f8f5f0]">
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Action</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">User</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#f8f5f0] border-b border-[#e6d7c3]/50">
                        <td className="px-4 py-3 text-[#5d4037]">{log.action}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">{log.userId?.name || "N/A"}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center px-4 py-4 text-[#8d6e63]">
                        No logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "allUsers":
        return (
          <div className="space-y-6">
            {/* Success message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start success-message">
                <CheckCircle2 size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertTriangle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#5d4037] flex items-center">
                <Users className="mr-2 h-6 w-6 text-[#8d6e63]" />
                All Users
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={handleRefresh}
                className="text-sm text-[#8d6e63] bg-[#f8f5f0] hover:bg-[#e6d7c3] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                onMouseEnter={handleRefreshButtonHover}
                onMouseLeave={handleRefreshButtonLeave}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div
              ref={addToCardRefs}
              className="bg-white rounded-lg shadow-md p-5 border border-[#e6d7c3] overflow-x-auto transition-all duration-300"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#f8f5f0]">
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Gender</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Role</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Location</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length > 0 ? (
                    allUsers.map((user: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#f8f5f0] border-b border-[#e6d7c3]/50">
                        <td className="px-4 py-3 text-[#5d4037] font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">{user.email}</td>
                        <td className="px-4 py-3 text-[#8d6e63] capitalize">{user.gender}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">{user.role}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">{user.location}</td>
                        <td className="px-4 py-3">
                          {user.role !== "admin" && user.role !== "superadmin" && (
                            <button
                              ref={addToActionButtonRefs}
                              onClick={() => handleMakeAdmin(user._id)}
                              disabled={actionInProgress === user._id}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1 shadow-sm"
                              onMouseEnter={handleActionButtonHover}
                              onMouseLeave={handleActionButtonLeave}
                            >
                              {actionInProgress === user._id ? (
                                <>
                                  <RefreshCw size={14} className="animate-spin" />
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <UserPlus size={14} />
                                  <span>Make Admin</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center px-4 py-4 text-[#8d6e63]">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "admins":
        return (
          <div className="space-y-6">
            {/* Success message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start success-message">
                <CheckCircle2 size={20} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertTriangle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#5d4037] flex items-center">
                <Shield className="mr-2 h-6 w-6 text-[#8d6e63]" />
                Admins
              </h2>
              <button
                ref={refreshButtonRef}
                onClick={handleRefresh}
                className="text-sm text-[#8d6e63] bg-[#f8f5f0] hover:bg-[#e6d7c3] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                onMouseEnter={handleRefreshButtonHover}
                onMouseLeave={handleRefreshButtonLeave}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div
              ref={addToCardRefs}
              className="bg-white rounded-lg shadow-md p-5 border border-[#e6d7c3] overflow-x-auto transition-all duration-300"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#f8f5f0]">
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Gender</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Location</th>
                    <th className="px-4 py-3 text-left text-[#5d4037] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length > 0 ? (
                    admins.map((admin: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#f8f5f0] border-b border-[#e6d7c3]/50">
                        <td className="px-4 py-3 text-[#5d4037] font-medium">{admin.name}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">{admin.email}</td>
                        <td className="px-4 py-3 text-[#8d6e63] capitalize">{admin.gender}</td>
                        <td className="px-4 py-3 text-[#8d6e63]">{admin.location}</td>
                        <td className="px-4 py-3">
                          <button
                            ref={addToActionButtonRefs}
                            onClick={() => handleRemoveAdmin(admin._id)}
                            disabled={actionInProgress === admin._id}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1 shadow-sm"
                            onMouseEnter={handleActionButtonHover}
                            onMouseLeave={handleActionButtonLeave}
                          >
                            {actionInProgress === admin._id ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <UserMinus size={14} />
                                <span>Remove Admin</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center px-4 py-4 text-[#8d6e63]">
                        No admins found.
                      </td>
                    </tr>
                  )}
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f0e5]">
      {/* Decorative top silhouette */}
      <div className="absolute top-0 left-0 w-full h-12 overflow-hidden opacity-10 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'%3E%3Cpath d='M0,40 L25,40 L25,20 L35,20 L35,10 L45,10 L45,20 L55,20 L55,40 L75,40 L75,25 L85,25 L85,15 L95,15 L95,25 L105,25 L105,40 L125,40 L125,15 L135,15 L135,5 L145,5 L145,15 L155,15 L155,40 L175,40 L175,20 L185,20 L185,10 L195,10 L195,20 L205,20 L205,40 L225,40 L225,25 L235,25 L235,15 L245,15 L245,25 L255,25 L255,40 L275,40 L275,15 L285,15 L285,5 L295,5 L295,15 L305,15 L305,40 L325,40 L325,20 L335,20 L335,10 L345,10 L345,20 L355,20 L355,40 L375,40 L375,25 L385,25 L385,15 L395,15 L395,25 L405,25 L405,40 L425,40 L425,15 L435,15 L435,5 L445,5 L445,15 L455,15 L455,40 L475,40 L475,20 L485,20 L485,10 L495,10 L495,20 L505,20 L505,40 L525,40 L525,25 L535,25 L535,15 L545,15 L545,25 L555,25 L555,40 L575,40 L575,15 L585,15 L585,5 L595,5 L595,15 L605,15 L605,40 L625,40 L625,20 L635,20 L635,10 L645,10 L645,20 L655,20 L655,40 L675,40 L675,25 L685,25 L685,15 L695,15 L695,25 L705,25 L705,40 L725,40 L725,15 L735,15 L735,5 L745,5 L745,15 L755,15 L755,40 L775,40 L775,20 L785,20 L785,10 L795,10 L795,20 L805,20 L805,40 L825,40 L825,25 L835,25 L835,15 L845,15 L845,25 L855,25 L855,40 L875,40 L875,15 L885,15 L885,5 L895,5 L895,15 L905,15 L905,40 L925,40 L925,20 L935,20 L935,10 L945,10 L945,20 L955,20 L955,40 L975,40 L975,25 L985,25 L985,15 L995,15 L995,25 L1000,25 L1000,40 Z'/%3E%3C/svg%3E")`,
            backgroundSize: "1000px 40px",
          }}
        ></div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b border-[#e6d7c3] flex justify-between items-center shadow-sm">
        <h1 className="font-bold text-xl text-[#5d4037]">Super Admin Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-[#f8f5f0] hover:bg-[#e6d7c3] transition-colors"
        >
          {sidebarOpen ? <X size={24} className="text-[#5d4037]" /> : <Menu size={24} className="text-[#5d4037]" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white border-r border-[#e6d7c3] p-4 md:p-6 shadow-md`}
      >
        <div className="hidden md:block mb-8">
          <h1 className="font-bold text-2xl text-[#5d4037]">Super Admin</h1>
          <p className="text-[#8d6e63] text-sm">Dashboard &amp; Management</p>
        </div>

        <div className="space-y-3">
          <button
            ref={addToButtonRefs}
            onClick={() => {
              setActiveSection("overview");
              setSidebarOpen(false);
            }}
            className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === "overview"
                ? "bg-[#8d6e63] text-white shadow-md"
                : "text-[#5d4037] hover:bg-[#f8f5f0]"
            }`}
          >
            <LayoutDashboard size={18} className="inline mr-2" />
            Overview
          </button>
          <button
            ref={addToButtonRefs}
            onClick={() => {
              setActiveSection("approvedEvents");
              setSidebarOpen(false);
            }}
            className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === "approvedEvents"
                ? "bg-[#8d6e63] text-white shadow-md"
                : "text-[#5d4037] hover:bg-[#f8f5f0]"
            }`}
          >
            <Calendar size={18} className="inline mr-2" />
            Approved Events
          </button>
          <button
            ref={addToButtonRefs}
            onClick={() => {
              setActiveSection("logs");
              setSidebarOpen(false);
            }}
            className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === "logs"
                ? "bg-[#8d6e63] text-white shadow-md"
                : "text-[#5d4037] hover:bg-[#f8f5f0]"
            }`}
          >
            <Clipboard size={18} className="inline mr-2" />
            Logs
          </button>
          <button
            ref={addToButtonRefs}
            onClick={() => {
              setActiveSection("allUsers");
              setSidebarOpen(false);
            }}
            className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === "allUsers"
                ? "bg-[#8d6e63] text-white shadow-md"
                : "text-[#5d4037] hover:bg-[#f8f5f0]"
            }`}
          >
            <Users size={18} className="inline mr-2" />
            All Users
          </button>
          <button
            ref={addToButtonRefs}
            onClick={() => {
              setActiveSection("admins");
              setSidebarOpen(false);
            }}
            className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === "admins"
                ? "bg-[#8d6e63] text-white shadow-md"
                : "text-[#5d4037] hover:bg-[#f8f5f0]"
            }`}
          >
            <Shield size={18} className="inline mr-2" />
            Admins
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">{renderContent()}</main>

      {/* Decorative bottom silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden opacity-10 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' fill='%23654321'%3E%3Cpath d='M0,0 L25,0 L25,20 L35,20 L35,30 L45,30 L45,20 L55,20 L55,0 L75,0 L75,15 L85,15 L85,25 L95,25 L95,15 L105,15 L105,0 L125,0 L125,25 L135,25 L135,35 L145,35 L145,25 L155,25 L155,0 L175,0 L175,20 L185,20 L185,30 L195,30 L195,20 L205,20 L205,0 L225,0 L225,15 L235,15 L235,25 L245,25 L245,15 L255,15 L255,0 L275,0 L275,25 L285,25 L285,35 L295,35 L295,25 L305,25 L305,0 L325,0 L325,20 L335,20 L335,30 L345,30 L345,20 L355,20 L355,0 L375,0 L375,15 L385,15 L385,25 L395,25 L395,15 L405,15 L405,0 L425,0 L425,25 L435,25 L435,35 L445,35 L445,25 L455,25 L455,0 L475,0 L475,20 L485,20 L485,30 L495,30 L495,20 L505,20 L505,0 L525,0 L525,15 L535,15 L535,25 L545,25 L545,15 L555,15 L555,0 L575,0 L575,25 L585,25 L585,35 L595,35 L595,25 L605,25 L605,0 L625,0 L625,20 L635,20 L635,30 L645,30 L645,20 L655,20 L655,0 L675,0 L675,15 L685,15 L685,25 L695,25 L695,15 L705,15 L705,0 L725,0 L725,25 L735,25 L735,35 L745,35 L745,25 L755,25 L755,0 L775,0 L775,20 L785,20 L785,30 L795,30 L795,20 L805,20 L805,0 L825,0 L825,15 L835,15 L835,25 L845,25 L845,15 L855,15 L855,0 L875,0 L875,25 L885,25 L885,35 L895,35 L895,25 L905,25 L905,0 L925,0 L925,20 L935,20 L935,30 L945,30 L945,20 L955,20 L955,0 L975,0 L975,15 L985,15 L985,25 L995,25 L995,15 L1000,15 L1000,0 Z'/%3E%3C/svg%3E")`,
            backgroundSize: "1000px 40px",
            transform: "rotate(180deg)",
          }}
        ></div>
      </div>
    </div>
  );
}
