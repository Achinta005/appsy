"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUserFromToken,
  removeAuthToken,
  getAuthToken,
} from "../../../lib/auth";
import Project from "../Components/Project";
import ContactResponse from "../Components/ContactResponse";
import Notepad from "../Components/Notepad";
import Image from "next/image";
import PythonFlask from "../Components/PythonFlask";
import Blog from "../Components/Blog";
import Ipaddress from "../Components/Ipaddress";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [documents, setDocuments] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [ipAddress, setipAddress] = useState();
  const router = useRouter();

  const handleClick = () => {
    router.push("/anime-list");
  };

  useEffect(() => {
    const userData = getUserFromToken();
    if (userData) {
      setUser(userData);
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const userData = getUserFromToken();
    PortfolioApiService.Fetch_IP(userData.userId)
      .then((data) => setipAddress(data.ip))
      .catch((error) => {
        console.error("Error fetching IP:", error);
        setipAddress("Currently not Available !");
      });
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  const handleNewDocument = (newDoc) => {
    setDocuments((prevDocs) => [newDoc, ...prevDocs]);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role === "admin" && activeView === "projects") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-tr from-blue-700 via-pink-600 to-yellow-300">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 cursor-pointer bg-white/40 backdrop-blur-3xl text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Project />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "messages") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755757547/response_arjl1x.webp)] bg-cover bg-center">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/20 backdrop-blur-3xl text-black cursor-pointer rounded-lg hover:bg-white/30 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <ContactResponse />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Notepad") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755758676/notepad_e5ey08.jpg)] bg-cover bg-center">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/10 backdrop-blur-3xl text-white cursor-pointer rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Notepad onDocumentSaved={handleNewDocument} />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Flask") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-600">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/10 backdrop-blur-3xl text-white cursor-pointer rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <PythonFlask />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Blog") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-bl from-pink-600 via-yellow-400 to-purple-700">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/30 backdrop-blur-3xl text-white cursor-pointer rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Blog />
      </div>
    );
  }
  if (user.role === "admin" && activeView === "IP") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-bl from-pink-600 via-yellow-400 to-purple-700">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/30 backdrop-blur-3xl text-white cursor-pointer rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Ipaddress />
      </div>
    );
  }

  if (user.role === "editor" && activeView === "Notepad") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 to-slate-800">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Notepad onDocumentSaved={handleNewDocument} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage:
          "url('https://wallpapers.com/images/hd/desktop-background-6v9qjuvtrckgn4mm.jpg')",
      }}
    >
      <div className="min-h-screen bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col gap-4">
                <div className="bg-white/10 backdrop-blur-2xl px-4 py-2 rounded-lg">
                  <p className="text-green-400 font-bold text-lg sm:text-xl text-center sm:text-left">
                    Welcome {user.username}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-2xl px-2 py-0.5 rounded-lg w-fit">
                  <p className="text-red-600 font-bold text-lg sm:text-xl text-center sm:text-left">
                    IP :{" "}
                    <span className="text-green-400 font-semibold">
                      {ipAddress}
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-2xl px-4 py-2 rounded-lg flex-1 sm:flex-initial -ml-20">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 text-center">
                  Dashboard
                </h1>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors self-center sm:self-auto"
              >
                Logout
              </button>
            </div>
          </header>

          {fetchError && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
              <p className="text-red-200">{fetchError}</p>
            </div>
          )}

          {user.role === "admin" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-3xl flex flex-col items-center space-y-4 hover:bg-white/25 transition-colors">
                <div className="w-full max-w-[280px] aspect-[4/3] relative">
                  <Image
                    src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a1_cqsx8x.jpg"
                    alt="Project Management"
                    fill
                    className="rounded-lg border-2 border-white object-cover"
                  />
                </div>
                <button
                  className="relative inline-flex h-10 w-full max-w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={() => setActiveView("projects")}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Manage Projects →
                  </span>
                </button>
              </div>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-3xl flex flex-col items-center space-y-4 hover:bg-white/25 transition-colors">
                <div className="w-full max-w-[280px] aspect-[4/3] relative">
                  <Image
                    src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1760892290/background-desktop_r4pccr.jpg"
                    alt="Project Management"
                    fill
                    className="rounded-lg border-2 border-white object-cover"
                  />
                </div>
                <button
                  className="relative inline-flex h-10 w-full max-w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={handleClick}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    AnimeList →
                  </span>
                </button>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-3xl flex flex-col items-center space-y-4 hover:bg-white/25 transition-colors">
                <div className="w-full max-w-[280px] aspect-[4/3] relative">
                  <Image
                    src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1761317160/ip-address-lookup_czcb34.jpg"
                    alt="Python Flask"
                    fill
                    className="rounded-lg border-2 border-white object-cover"
                  />
                </div>
                <button
                  className="relative inline-flex h-10 w-full max-w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={() => setActiveView("IP")}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    IP Adresses →
                  </span>
                </button>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-3xl flex flex-col items-center space-y-4 hover:bg-white/25 transition-colors">
                <div className="w-full max-w-[280px] aspect-[4/3] relative">
                  <Image
                    src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755834332/flask_o3qe55.jpg"
                    alt="Python Flask"
                    fill
                    className="rounded-lg border-2 border-white object-cover"
                  />
                </div>
                <button
                  className="relative inline-flex h-10 w-full max-w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={() => setActiveView("Flask")}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Python Flask →
                  </span>
                </button>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-3xl flex flex-col items-center space-y-4 hover:bg-white/25 transition-colors">
                <div className="w-full max-w-[280px] aspect-[4/3] relative">
                  <Image
                    src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a2_jjgzr3.png"
                    alt="Messages"
                    fill
                    className="rounded-lg border-2 border-white object-contain"
                  />
                </div>
                <button
                  className="relative inline-flex h-10 w-full max-w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={() => setActiveView("messages")}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    View Messages →
                  </span>
                </button>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-3xl flex flex-col items-center space-y-4 hover:bg-white/25 transition-colors">
                <div className="w-full max-w-[280px] aspect-[4/3] relative">
                  <Image
                    src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a3_uutdd3.avif"
                    alt="Notepad"
                    fill
                    className="rounded-lg border-2 border-white object-cover"
                  />
                </div>
                <button
                  className="relative inline-flex h-10 w-full max-w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={() => setActiveView("Notepad")}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Go To Notepad →
                  </span>
                </button>
              </div>

              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-3xl flex flex-col items-center space-y-4 hover:bg-white/25 transition-colors">
                <div className="w-full max-w-[280px] aspect-[4/3] relative">
                  <Image
                    src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1756037563/write-a-great-blog-post_ivsbz9.jpg"
                    alt="Blog Management"
                    fill
                    className="rounded-lg border-2 border-white object-cover"
                  />
                </div>
                <button
                  className="relative inline-flex h-10 w-full max-w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={() => setActiveView("Blog")}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Blog Upload →
                  </span>
                </button>
              </div>
            </div>
          )}

          {user.role === "editor" && (
            <div className="flex justify-center">
              <div className="bg-white/20 rounded-lg backdrop-blur-3xl p-6 w-full max-w-sm flex flex-col items-center space-y-4 hover:bg-white/25 transition-colors">
                <div className="w-full max-w-[280px] aspect-[4/3] relative">
                  <Image
                    src="/a3.jpeg"
                    alt="Notepad"
                    fill
                    className="rounded-lg border-2 border-white object-contain"
                  />
                </div>
                <button
                  className="relative inline-flex h-10 w-full max-w-[200px] overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={() => setActiveView("Notepad")}
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Go To Notepad →
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
