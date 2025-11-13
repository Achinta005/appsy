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
        setcontact(data);
      } catch (error) {
        console.error("Error fetching Contacts:", error);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755757547/response_arjl1x.webp)] bg-cover border-2 border-white rounded-2xl w-full">
      <header className="text-center lg:text-left lg:ml-[40vw] text-2xl font-bold text-green-600 mt-5">
        Contact Responses
      </header>
      <section className="w-full overflow-x-auto">
        <table className="min-w-full border border-gray-400 rounded-b-4xl shadow-md text-black">
          <thead className="bg-green-400 text-amber-50">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {contact.map((post, index) => (
              <tr key={index} className="hover:bg-yellow-500 transition">
                <td className="border px-4 py-2">{post.name}</td>
                <td className="border px-4 py-2">{post.email}</td>
                <td className="border px-4 py-2">{post.subject}</td>
                <td className="border px-4 py-2 break-words">{post.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ContactResponse;
