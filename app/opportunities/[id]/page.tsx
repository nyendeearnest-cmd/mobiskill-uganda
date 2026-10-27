
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { opportunities } from "@/lib/mock/opportunities";

type Opportunity = (typeof opportunities)[number];

export default function OpportunityDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mobiskill-opportunities");
      const savedOpportunities: Opportunity[] = saved
        ? JSON.parse(saved)
        : [];

      const foundOpportunity =
        savedOpportunities.find((item) => item.id === id) ??
        opportunities.find((item) => item.id === id);

      setOpportunity(foundOpportunity ?? null);
    } catch (error) {
      console.error("Could not load opportunity:", error);

      const mockOpportunity = opportunities.find(
        (item) => item.id === id
      );

      setOpportunity(mockOpportunity ?? null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8">
          Loading opportunity...
        </div>
      </main>
    );
  }

  if (!opportunity) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Opportunity Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            The opportunity you are looking for does not exist.
          </p>

          <Link
            href="/opportunities"
            className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            Back to Opportunities
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/opportunities"
          className="mb-6 inline-block text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Opportunities
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="border-b border-gray-200 pb-6">
            <p className="text-sm font-medium text-gray-500">
              {opportunity.type}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {opportunity.title}
            </h1>

            <p className="mt-2 text-lg font-medium text-gray-600">
              {opportunity.businessName}
            </p>
          </div>

          <section className="py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              About This Opportunity
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {opportunity.description}
            </p>
          </section>

          <section className="border-t border-gray-200 py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Opportunity Information
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Location</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {opportunity.location}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Opportunity Type
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {opportunity.type}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Payment</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {opportunity.payment || "Not specified"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Application Deadline
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {opportunity.deadline}
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Required Skills
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {opportunity.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="border-t border-gray-200 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Interested in this opportunity?
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Apply and take the next step toward gaining practical
                  experience.
                </p>
              </div>

              <Link
                href={`/opportunities/${opportunity.id}/apply`}
                className="rounded-lg bg-black px-6 py-3 text-center font-medium text-white hover:bg-gray-800"
              >
                Apply Now
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
