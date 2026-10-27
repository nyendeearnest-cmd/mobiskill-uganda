
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Application = {
  id: string;
  opportunityId: string;
  learnerName: string;
  learnerEmail: string;
  coverLetter: string;
  status: string;
  submittedAt: string;
};

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();

  const opportunityId = Array.isArray(params.id)
    ? params.id[0]
    : String(params.id ?? "");

  const [learnerName, setLearnerName] = useState("");
  const [learnerEmail, setLearnerEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    try {
      const saved = localStorage.getItem("mobiskill-applications");
      const applications: Application[] = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(applications)) {
        throw new Error("Invalid application data");
      }

      const email = learnerEmail.trim().toLowerCase();
      const name = learnerName.trim();

      // Prevent another application for this opportunity
      // from the same email address.
      const duplicate = applications.some((application) => {
        return (
          String(application.opportunityId) === opportunityId &&
          String(application.learnerEmail).trim().toLowerCase() === email
        );
      });

      if (duplicate) {
        setMessage(
          "You have already applied for this opportunity with this email address. You cannot submit it again."
        );
        return;
      }

      const application: Application = {
        id: `app-${Date.now()}`,
        opportunityId,
        learnerName: name,
        learnerEmail: email,
        coverLetter: coverLetter.trim(),
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };

      applications.push(application);

      localStorage.setItem(
        "mobiskill-applications",
        JSON.stringify(applications)
      );

      setSubmitted(true);
    } catch {
      setMessage("We could not save your application. Please try again.");
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-blue-500";

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
          <h1 className="mb-4 text-2xl font-bold text-green-700">
            Application Submitted!
          </h1>

          <p className="mb-4 text-gray-600">
            Your application has been saved successfully.
          </p>

          <div className="mb-6 space-y-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <p><strong>Opportunity ID:</strong> {opportunityId}</p>
            <p><strong>Applicant:</strong> {learnerName.trim()}</p>
            <p><strong>Status:</strong> Pending</p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/applications")}
            className="mr-3 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            Track My Applications
          </button>

          <button
            type="button"
            onClick={() => router.push("/opportunities")}
            className="mt-3 rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-100"
          >
            Browse Opportunities
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Apply for Opportunity
        </h1>

        <p className="mb-8 mt-2 text-gray-600">
          Complete the form to apply for this opportunity.
        </p>

        {message && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-yellow-50 p-4 text-yellow-800"
          >
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl bg-white p-8 shadow"
        >
          <div>
            <label htmlFor="learnerName" className="font-medium text-gray-800">
              Full Name *
            </label>
            <input
              id="learnerName"
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              className={fieldClass}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="learnerEmail" className="font-medium text-gray-800">
              Email Address *
            </label>
            <input
              id="learnerEmail"
              type="email"
              value={learnerEmail}
              onChange={(e) => setLearnerEmail(e.target.value)}
              className={fieldClass}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="coverLetter" className="font-medium text-gray-800">
              Cover Letter *
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className={fieldClass}
              placeholder="Explain your interest, skills, and suitability for this opportunity."
              rows={7}
              required
            />
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <p><strong>Opportunity ID:</strong> {opportunityId}</p>
            <p className="mt-2">
              Your application will initially have Pending status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Submit Application
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
