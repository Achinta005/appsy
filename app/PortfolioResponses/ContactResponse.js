"use client";
import React from "react";
import { useState, useEffect } from "react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const ContactResponse = () => {
  const [contact, setcontact] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const data = await PortfolioApiService.ContactResponses();
        const contact = data?.data || [];
        setcontact(contact);
      } catch (error) {
        console.error("Error fetching Contacts:", error);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755757547/response_arjl1x.webp)] bg-cover border-2 border-white rounded-2xl w-full p-3 sm:p-5">
      <header className="text-center lg:text-left lg:ml-[40vw] text-xl sm:text-2xl font-bold text-green-600 mb-4 sm:mb-5">
        Contact Responses
      </header>

      {/* Desktop Table View */}
      <section className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full border border-gray-400 rounded-b-4xl shadow-md text-black bg-white/90">
          <thead className="bg-green-400 text-amber-50">
            <tr>
              <th className="border px-4 py-2 text-sm lg:text-base">Name</th>
              <th className="border px-4 py-2 text-sm lg:text-base">Email</th>
              <th className="border px-4 py-2 text-sm lg:text-base">Subject</th>
              <th className="border px-4 py-2 text-sm lg:text-base">Message</th>
            </tr>
          </thead>
          <tbody>
            {contact.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="border px-4 py-8 text-center text-gray-500"
                >
                  No contact responses found
                </td>
              </tr>
            ) : (
              contact.map((post, index) => (
                <tr key={index} className="hover:bg-yellow-500 transition">
                  <td className="border px-4 py-2 text-sm lg:text-base">
                    {post.name}
                  </td>
                  <td className="border px-4 py-2 text-sm lg:text-base">
                    {post.email}
                  </td>
                  <td className="border px-4 py-2 text-sm lg:text-base">
                    {post.subject}
                  </td>
                  <td className="border px-4 py-2 break-words text-sm lg:text-base">
                    {post.message}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Mobile Card View */}
      <section className="md:hidden space-y-4">
        {contact.length === 0 ? (
          <div className="bg-white/90 rounded-lg shadow-lg p-6 text-center text-gray-500">
            No contact responses found
          </div>
        ) : (
          contact.map((post, index) => (
            <div
              key={index}
              className="bg-white/90 rounded-lg shadow-lg overflow-hidden border-2 border-green-400"
            >
              <div className="bg-green-400 px-4 py-3">
                <h3 className="text-amber-50 font-semibold text-sm">
                  Response #{index + 1}
                </h3>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-600 uppercase mb-1">
                    Name
                  </span>
                  <span className="text-sm text-black font-medium">
                    {post.name}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-600 uppercase mb-1">
                    Email
                  </span>
                  <span className="text-sm text-black break-all">
                    {post.email}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-600 uppercase mb-1">
                    Subject
                  </span>
                  <span className="text-sm text-black font-medium">
                    {post.subject}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-600 uppercase mb-1">
                    Message
                  </span>
                  <span className="text-sm text-black break-words leading-relaxed">
                    {post.message}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ContactResponse;
