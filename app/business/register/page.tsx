"use client";

import { useState } from "react";
import Link from "next/link";

export default function BusinessRegisterPage() {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const business = {
      id: `business-${Date.now()}`,
      businessName,
      email,
      phone,
      location,
      description,
      registeredAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "mobiskill-business",
      JSON.stringify(business)
    );

    setMessage("Business registration completed successfully!");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-blue-600">
          MOBISKILL UGANDA
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Register Your Business
        </h1>

        <p className="mt-2 text-gray-600">
          Register your business to connect with learners and post jobs,
          internships, and gigs.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Business Name
            </label>
            <input
              required
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Enter business name"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Business Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="business@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Phone Number
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Business Location
            </label>
            <input
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="e.g. Kampala, Uganda"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Business Description
            </label>
            <textarea
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              rows={4}
              placeholder="Describe your business and what it does"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Register Business
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-lg bg-green-50 p-4 text-green-700">
            {message}
          </p>
        )}

        <Link
          href="/business/dashboard"
          className="mt-6 inline-block font-semibold text-blue-600 hover:underline"
        >
          Go to Business Dashboard →
        </Link>
      </div>
    </main>
  );
}
