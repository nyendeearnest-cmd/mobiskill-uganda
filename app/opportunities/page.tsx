
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { opportunities as mockOpportunities } from "@/lib/mock/opportunities";
import type { Opportunity } from "@/lib/mock/opportunities";
import { matchJobsToSkills } from "@/lib/matching/jobMatching";

const DEMO_LEARNER_SKILLS = ["HTML", "CSS", "JavaScript"];

export default function OpportunitiesPage() {
  const [allOpportunities, setAllOpportunities] =
    useState<Opportunity[]>(mockOpportunities);

  const [learnerSkills, setLearnerSkills] = useState<string[]>(
    DEMO_LEARNER_SKILLS
  );

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mobiskill-opportunities");

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const savedOpportunities = parsed as Opportunity[];
          const existingIds = new Set(
            savedOpportunities.map((item) => item.id)
          );

          setAllOpportunities([
            ...savedOpportunities,
            ...mockOpportunities.filter(
              (item) => !existingIds.has(item.id)
            ),
          ]);
        }
      }

      const savedSkills = localStorage.getItem("mobiskill-learner-skills");

      if (savedSkills) {
        const parsedSkills: unknown = JSON.parse(savedSkills);

        if (
          Array.isArray(parsedSkills) &&
          parsedSkills.every((skill) => typeof skill === "string")
        ) {
          setLearnerSkills(parsedSkills);
        }
      }
    } catch (error) {
      console.error("Could not load matching data:", error);
    }
  }, []);

  const jobMatches = matchJobsToSkills(
    learnerSkills,
    allOpportunities
  );

  function addSkill() {
    const skill = skillInput.trim();

    if (
      !skill ||
      learnerSkills.some(
        (existing) => existing.toLowerCase() === skill.toLowerCase()
      )
    ) {
      return;
    }

    const updatedSkills = [...learnerSkills, skill];

    setLearnerSkills(updatedSkills);
    localStorage.setItem(
      "mobiskill-learner-skills",
      JSON.stringify(updatedSkills)
    );
    setSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    const updatedSkills = learnerSkills.filter(
      (skill) => skill !== skillToRemove
    );

    setLearnerSkills(updatedSkills);
    localStorage.setItem(
      "mobiskill-learner-skills",
      JSON.stringify(updatedSkills)
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Jobs Matching
        </h1>

        <p className="mt-2 text-gray-600">
          Discover jobs, internships, and gigs that match your skills.
        </p>

        <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            My Skills
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Add the skills you have to see how well you match available
            opportunities. Your current skills are saved in this browser.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {learnerSkills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="font-bold hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form
            className="mt-5 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              addSkill();
            }}
          >
            <input
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              placeholder="Enter a skill, e.g. React"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
            />

            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
            >
              Add Skill
            </button>
          </form>
        </section>

        <div className="mb-5 mt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Recommended Opportunities
          </h2>

          <p className="mt-2 text-gray-600">
            Opportunities are ranked by the percentage of required skills
            you currently have.
          </p>
        </div>

        {jobMatches.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-gray-600">
            No opportunities are available yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobMatches.map((match) => {
              const opportunity = match.opportunity;

              return (
                <article
                  key={opportunity.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {opportunity.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {opportunity.businessName}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-lg bg-green-50 px-3 py-2 text-lg font-bold text-green-700">
                      {match.matchPercentage}%
                    </span>
                  </div>

                  <p className="mt-4 text-gray-600">
                    {opportunity.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      <strong className="text-gray-900">Type:</strong>{" "}
                      {opportunity.type}
                    </p>

                    <p>
                      <strong className="text-gray-900">Location:</strong>{" "}
                      {opportunity.location}
                    </p>

                    {opportunity.payment && (
                      <p>
                        <strong className="text-gray-900">Payment:</strong>{" "}
                        {opportunity.payment}
                      </p>
                    )}

                    <p>
                      <strong className="text-gray-900">Deadline:</strong>{" "}
                      {opportunity.deadline}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-gray-900">
                      Skills you have ({match.matchedSkills.length})
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {match.matchedSkills.length > 0 ? (
                        match.matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-800"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No matching skills yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-gray-900">
                      Skills to learn ({match.missingSkills.length})
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {match.missingSkills.length > 0 ? (
                        match.missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-800"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-green-700">
                          You have all the listed required skills!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-green-600"
                      style={{ width: `${match.matchPercentage}%` }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {match.matchedSkills.length} of{" "}
                    {opportunity.requiredSkills.length} required skills match
                  </p>

                  <Link
                    href={`/opportunities/${opportunity.id}`}
                    className="mt-6 block w-full rounded-lg bg-black px-4 py-3 text-center font-medium text-white hover:bg-gray-800"
                  >
                    View Opportunity
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
