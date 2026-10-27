"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { opportunities as sampleOpportunities } from "@/lib/mock/opportunities";

type Opportunity = {
  id: string;
  title: string;
  businessName: string;
  type: string;
  location: string;
  description: string;
  payment?: string;
  deadline: string;
  requiredSkills: string[];
};

type Business = {
  businessName: string;
  email: string;
  phone: string;
  location: string;
  description: string;
};

export default function BusinessDashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [allOpportunities, setAllOpportunities] =
    useState<Opportunity[]>(sampleOpportunities);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedBusiness = localStorage.getItem("mobiskill-business");

      if (savedBusiness) {
        setBusiness(JSON.parse(savedBusiness) as Business);
      }

      const savedOpportunities = JSON.parse(
        localStorage.getItem("mobiskill-opportunities") || "[]"
      ) as Opportunity[];

      const combined = [...savedOpportunities, ...sampleOpportunities];
      const unique = combined.filter(
        (item, index, array) =>
          array.findIndex((other) => other.id === item.id) === index
      );

      setAllOpportunities(unique);
    } catch {
      setAllOpportunities(sampleOpportunities);
    } finally {
      setLoaded(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              MOBISKILL UGANDA
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Business Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your business and connect with skilled learners.
            </p>
          </div>

          <Link
            href="/business/opportunities/create"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            + Post an Opportunity
          </Link>
        </header>

        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Listed Opportunities</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loaded ? allOpportunities.length : "..."}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Registered Business</p>
            <p className="mt-2 text-xl font-bold text-gray-900">
              {business ? business.businessName : "Not registered"}
            </p>
            <Link
              href="/business/register"
              className="mt-3 inline-block font-semibold text-blue-600 hover:underline"
            >
              View registration page →
            </Link>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Application Tracking</p>
            <p className="mt-2 text-xl font-bold text-gray-900">
              Manage Applications
            </p>
            <Link
              href="/business/applications"
              className="mt-3 inline-block font-semibold text-blue-600 hover:underline"
            >
              Review Applicants →
            </Link>
          </div>
        </section>

        {business && (
          <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Your Business Profile
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Business Name</p>
                <p className="font-semibold">{business.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{business.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{business.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold">{business.location}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">{business.description}</p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              Posted Opportunities
            </h2>
            <Link
              href="/opportunities"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View learner opportunities
            </Link>
          </div>

          {!loaded ? (
            <p className="text-gray-600">Loading opportunities...</p>
          ) : allOpportunities.length === 0 ? (
            <p className="text-gray-600">
              No opportunities yet. Post your first opportunity.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3">Opportunity</th>
                    <th className="p-3">Business</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Deadline</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allOpportunities.map((opportunity) => (
                    <tr key={opportunity.id} className="border-b last:border-0">
                      <td className="p-3 font-semibold text-gray-900">
                        {opportunity.title}
                      </td>
                      <td className="p-3">{opportunity.businessName}</td>
                      <td className="p-3">{opportunity.type}</td>
                      <td className="p-3">{opportunity.location}</td>
                      <td className="p-3">{opportunity.deadline}</td>
                      <td className="p-3">
                        <Link
                          href={`/opportunities/${opportunity.id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-5 text-sm text-gray-500">
          MobiSkill Uganda business management demonstration.
        </p>
      </div>
    </main>
  );
}
