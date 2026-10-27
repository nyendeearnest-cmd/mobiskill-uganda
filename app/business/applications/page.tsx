
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Application = {
  id: string;
  opportunityId: string;
  learnerName: string;
  learnerEmail: string;
  coverLetter: string;
  status: string;
  submittedAt: string;
};

const statuses = [
  "Pending",
  "Under Review",
  "Shortlisted",
  "Accepted",
  "Rejected",
];

export default function BusinessApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mobiskill-applications");
      const parsed = saved ? JSON.parse(saved) : [];

      if (Array.isArray(parsed)) {
        setApplications(parsed);
      }
    } catch {
      setApplications([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  function updateStatus(applicationId: string, newStatus: string) {
    try {
      const updated = applications.map((application) =>
        application.id === applicationId
          ? { ...application, status: newStatus }
          : application
      );

      localStorage.setItem(
        "mobiskill-applications",
        JSON.stringify(updated)
      );

      setApplications(updated);
      setMessage("Application status updated successfully.");
    } catch {
      setMessage("Unable to update the status. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/business/dashboard"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back to Business Dashboard
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          Manage Applications
        </h1>

        <p className="mt-2 text-gray-600">
          Review learners who have applied for opportunities.
        </p>

        {message && (
          <p
            role="status"
            className="mt-5 rounded-lg bg-green-50 p-3 text-green-800"
          >
            {message}
          </p>
        )}

        {!loaded ? (
          <p className="mt-8">Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="mt-8 rounded-xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No applications received yet
            </h2>
            <p className="mt-2 text-gray-600">
              Applications submitted by learners will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {applications.map((application) => (
              <article
                key={application.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {application.learnerName}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {application.learnerEmail}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Application ID: {application.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Opportunity ID: {application.opportunityId}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted:{" "}
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="min-w-48">
                    <label
                      htmlFor={`status-${application.id}`}
                      className="font-medium text-gray-800"
                    >
                      Application Status
                    </label>
                    <select
                      id={`status-${application.id}`}
                      value={application.status}
                      onChange={(e) =>
                        updateStatus(application.id, e.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-800">Cover Letter</h3>
                  <p className="mt-2 whitespace-pre-wrap text-gray-700">
                    {application.coverLetter}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
