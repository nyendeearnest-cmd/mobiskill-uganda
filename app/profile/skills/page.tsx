"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Skill = {
  id: string;
  skillId: string;
  name: string;
  description: string;
  category: string;
  level: string;
  score: number | null;
  verified: boolean;
};

type SkillsResponse = {
  success: boolean;
  summary?: {
    skillsDeveloped: number;
    verifiedSkills: number;
    averageScore: number | null;
    averageSkillLevel: string;
  };
  skills?: Skill[];
  message?: string;
};

export default function SkillsProfilePage() {
  const [data, setData] = useState<SkillsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const response = await fetch("/api/profile/skills");

        const result: SkillsResponse = await response.json();

        setData(result);
      } catch (error) {
        console.error("Failed to load skills:", error);

        setData({
          success: false,
          message: "Failed to load skills profile.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  const summary = data?.summary;
  const skills = data?.skills ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              MobiSkill Uganda
            </h1>

            <p className="text-sm text-slate-500">
              Learn. Practice. Earn.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <section className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            SKILLS PROFILE
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Your Skills
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Track the digital skills you have developed, your current
            proficiency levels, and the skills you can continue improving.
          </p>
        </section>

        {loading && (
          <section className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading your skills profile...
              </p>
            </div>
          </section>
        )}

        {!loading && !data?.success && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-red-800">
              Unable to load skills
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {data?.message ?? "Something went wrong."}
            </p>
          </section>
        )}

        {!loading && data?.success && (
          <>
            {skills.length === 0 && (
              <section className="rounded-2xl border bg-white p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                    🎯
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    Build Your Skills Profile
                  </h3>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                    Your skills will appear here as you complete assessments,
                    courses, and practical challenges on MobiSkill Uganda.
                  </p>

                  <Link
                    href="/learn"
                    className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Start Learning
                  </Link>
                </div>
              </section>
            )}

            <section className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Skills Developed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {summary?.skillsDeveloped ?? 0}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Skills currently recorded
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Verified Skills
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {summary?.verifiedSkills ?? 0}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Skills verified through assessment
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Average Skill Level
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {summary?.averageSkillLevel ?? "—"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Based on your current skills
                </p>
              </div>
            </section>

            <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Skill Breakdown
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your current digital skills and proficiency levels.
                </p>
              </div>

              {skills.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
                  <p className="font-medium text-slate-700">
                    No skills recorded yet.
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Complete an assessment or learning activity to start
                    building your skills profile.
                  </p>

                  <Link
                    href="/learn"
                    className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Explore courses →
                  </Link>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {skill.name}
                          </h4>

                          {skill.category && (
                            <p className="mt-1 text-xs font-medium text-blue-600">
                              {skill.category}
                            </p>
                          )}
                        </div>

                        {skill.verified && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      {skill.description && (
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          {skill.description}
                        </p>
                      )}

                      <div className="mt-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400">
                            Skill Level
                          </p>

                          <p className="mt-1 font-semibold text-slate-800">
                            {skill.level}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            Score
                          </p>

                          <p className="mt-1 font-semibold text-slate-800">
                            {skill.score !== null
                              ? `${skill.score}%`
                              : "Not scored"}
                          </p>
                        </div>
                      </div>

                      {skill.score !== null && (
                        <div className="mt-4">
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${Math.min(
                                  Math.max(skill.score, 0),
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}