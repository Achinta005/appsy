import React, { useState, useEffect } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Calendar,
  Bot,
  Eye,
  X,
  Search,
  Trash2,
} from "lucide-react";
import useApi from "@/services/authservices";

const ContactResponse = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const apiFetch = useApi();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await apiFetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/contact/contact_responses`
        );
        const data = await res.json();
        const contactData = data?.data || [];
        setContacts(contactData);
      } catch (error) {
        console.error("Error fetching Contacts:", error);
      } finally {
        setLoading(false);
      }
    };
    getContacts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (contactId) => {
    try {

      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/contact/delete_response/${contactId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      const result = await response.json();

      if (result.success) {
        setContacts(contacts.filter((c) => c._id !== contactId));
        setDeleteConfirm(null);
        setSelectedContact(null);

        console.log("Successfully deleted contact:", contactId);
      } else {
        throw new Error(result.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Contact Responses
              </h1>
              <p className="text-slate-400 text-base sm:text-lg">
                {filteredContacts.length}{" "}
                {filteredContacts.length === 1 ? "response" : "responses"}{" "}
                available
              </p>
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none w-full sm:w-64 text-white placeholder-slate-500 transition-all"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400">Loading responses...</p>
          </div>
        ) : (
          <>
            <section className="hidden md:grid gap-4">
              {filteredContacts.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    No contact responses found
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact, index) => (
                  <div
                    key={contact._id || index}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="flex items-center p-5">
                      <div className="flex-shrink-0 mr-5">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                            Name
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {contact.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                            Email
                          </p>
                          <p className="text-sm text-slate-300 break-all">
                            {truncateText(contact.email, 25)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                            Subject
                          </p>
                          <p className="text-sm text-slate-300">
                            {truncateText(contact.subject, 30)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                            Date
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(contact.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-5 flex gap-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md font-semibold text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(contact._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md font-semibold text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>

            <section className="md:hidden space-y-4">
              {filteredContacts.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    No contact responses found
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact, index) => (
                  <div
                    key={contact._id || index}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {contact.name}
                            </h3>
                            <p className="text-xs text-slate-400">
                              {formatDate(contact.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-md"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(contact._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-md"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 uppercase">
                            Email
                          </span>
                          <p className="text-sm text-slate-300 break-all">
                            {contact.email}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-slate-500 uppercase">
                            Subject
                          </span>
                          <p className="text-sm text-slate-300">
                            {truncateText(contact.subject, 50)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {selectedContact && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedContact(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {selectedContact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {selectedContact.name}
                      </h2>
                      <div className="flex items-center gap-2 text-green-100">
                        <Mail className="w-4 h-4" />
                        <p className="text-sm break-all">
                          {selectedContact.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-white text-sm mt-2 bg-white/20 px-3 py-1 rounded-full w-fit">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedContact.created_at)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-220px)]">
                <div className="flex justify-end">
                  <button
                    onClick={() => setDeleteConfirm(selectedContact._id)}
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-5 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md font-semibold text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Response
                  </button>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <h3 className="text-xs font-bold text-gray-600 uppercase mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Subject
                  </h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedContact.subject}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Original Message
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-700 leading-relaxed border border-gray-200">
                    {formatMessage(selectedContact.message)}
                  </div>
                </div>

                {selectedContact.aiResponse && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-green-600" />
                      AI Response
                    </h3>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 text-sm text-gray-700 leading-relaxed border-2 border-green-200">
                      {formatMessage(selectedContact.aiResponse)}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-mono">
                    ID: {selectedContact._id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Confirm Delete</h2>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this contact response? This
                  action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactResponse;
