
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

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  "Under Review": "bg-blue-100 text-blue-800",
  Shortlisted: "bg-purple-100 text-purple-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/opportunities"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Browse Opportunities
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          My Applications
        </h1>

        <p className="mt-2 text-gray-600">
          Track the progress of your job, internship, and gig applications.
        </p>

        {!loaded ? (
          <p className="mt-8 text-gray-600">Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="mt-8 rounded-xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No applications yet
            </h2>
            <p className="mt-2 text-gray-600">
              When you apply for an opportunity, it will appear here.
            </p>
            <Link
              href="/opportunities"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Find Opportunities
            </Link>
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
                      Opportunity: {application.opportunityId}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Application ID: {application.id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      statusStyles[application.status] ??
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                  <p>
                    <strong>Applicant:</strong> {application.learnerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {application.learnerEmail}
                  </p>
                  <p>
                    <strong>Date submitted:</strong>{" "}
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">Cover Letter</h3>
                  <p className="mt-1 whitespace-pre-wrap text-gray-600">
                    {application.coverLetter}
                  </p>
                </div>

                <Link
                  href={`/opportunities/${application.opportunityId}`}
                  className="mt-5 inline-block font-semibold text-blue-600 hover:underline"
                >
                  View Opportunity →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
