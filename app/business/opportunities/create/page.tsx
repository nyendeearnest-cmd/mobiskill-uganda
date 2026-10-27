
"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateOpportunityPage() {
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    businessName: "",
    type: "Internship",
    location: "Kampala",
    description: "",
    payment: "",
    deadline: "",
    requiredSkills: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const existing = JSON.parse(
        localStorage.getItem("mobiskill-opportunities") || "[]"
      );

      const opportunity = {
        ...form,
        id: `opp-${Date.now()}`,
        requiredSkills: form.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      localStorage.setItem(
        "mobiskill-opportunities",
        JSON.stringify([...existing, opportunity])
      );

      setMessage("Opportunity saved successfully!");
    } catch {
      setMessage("Unable to save the opportunity. Please try again.");
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900";

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/business/dashboard"
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-5 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Post an Opportunity
          </h1>

          <p className="mt-2 text-gray-600">
            Connect Ugandan learners to jobs, internships and gigs.
          </p>

          {message && (
            <p role="status" className="mt-4 rounded-lg bg-green-100 p-3 text-green-800">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="font-medium">Opportunity Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className={fieldClass}
                placeholder="Junior Web Developer"
                required
              />
            </div>

            <div>
              <label className="font-medium">Business Name *</label>
              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                className={fieldClass}
                placeholder="Your business name"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="font-medium">Opportunity Type *</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  <option>Job</option>
                  <option>Internship</option>
                  <option>Gig</option>
                  <option>Apprenticeship</option>
                </select>
              </div>

              <div>
                <label className="font-medium">Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-medium">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={fieldClass}
                rows={4}
                required
              />
            </div>

            <div>
              <label className="font-medium">Payment or Allowance</label>
              <input
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className={fieldClass}
                placeholder="e.g. UGX 300,000 per month"
              />
            </div>

            <div>
              <label className="font-medium">Application Deadline *</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label className="font-medium">Required Skills *</label>
              <input
                name="requiredSkills"
                value={form.requiredSkills}
                onChange={handleChange}
                className={fieldClass}
                placeholder="HTML, CSS, JavaScript"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate skills with commas.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Save Opportunity
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
