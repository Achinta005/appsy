"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Tag,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from "lucide-react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const ContactResponse = () => {
  const [contacts, setContacts] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getContacts = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const data = await PortfolioApiService.ContactResponses();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching Contacts:", error);
      } finally {
        setLoading(false);
      }
    };
    getContacts();
  }, []);

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-800/95 to-purple-800/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageSquare className="w-6 h-6 text-green-400" />
            <h1 className="text-xl font-bold text-white">Contact Responses</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 py-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Total Messages</span>
            <span className="text-green-400 font-bold text-lg">
              {filteredContacts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="px-4 pb-6 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-white text-sm">Loading messages...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-sm">No messages found</p>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isExpanded = expandedCard === contact.id;

            return (
              <div
                key={contact.id}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:border-white/40 transition-all shadow-lg"
              >
                {/* Card Header - Always Visible */}
                <button
                  onClick={() => toggleCard(contact.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <h3 className="text-white font-semibold text-base truncate">
                          {contact.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <p className="text-gray-300 text-xs truncate">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                    <span className="text-yellow-300 text-sm font-medium truncate">
                      {contact.subject}
                    </span>
                  </div>
                </button>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 animate-fadeIn">
                    <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-purple-300 text-xs font-medium">
                          Message:
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed pl-6">
                        {contact.message}
                      </p>
                    </div>

                    {contact.date && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          Received:{" "}
                          {new Date(contact.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-6"></div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactResponse;
