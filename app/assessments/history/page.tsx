
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Attempt = {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startedAt: string;
  completedAt: string | null;
  assessment: {
    id: string;
    title: string;
    description: string | null;
  };
};

export default function AssessmentHistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch("/api/assessments/history");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to load your history.");
        }

        setAttempts(data.attempts || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load your history."
        );
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
            attempts.length
        )
      : 0;

  const passedCount = attempts.filter((attempt) => attempt.score >= 50).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/assessments"
          className="mb-6 inline-block text-sm font-medium text-blue-700 hover:underline"
        >
          ← Back to assessments
        </Link>

        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            MobiSkill Uganda · Your progress
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Assessment history
          </h1>
          <p className="mt-3 text-slate-600">
            Review your previous attempts and track your learning progress.
          </p>
        </header>

        {loading ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            Loading your assessment history...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-6 text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Total attempts</p>
                <p className="mt-2 text-3xl font-bold">{attempts.length}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Average score</p>
                <p className="mt-2 text-3xl font-bold">{averageScore}%</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Passed attempts</p>
                <p className="mt-2 text-3xl font-bold">{passedCount}</p>
              </div>
            </div>

            {attempts.length === 0 ? (
              <section className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <h2 className="text-xl font-bold">No attempts yet</h2>
                <p className="mt-2 text-slate-600">
                  Complete an assessment to see your results here.
                </p>
                <Link
                  href="/assessments"
                  className="mt-5 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                >
                  Start an assessment
                </Link>
              </section>
            ) : (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 p-5">
                  <h2 className="text-xl font-bold">Previous attempts</h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {attempts.map((attempt) => (
                    <article key={attempt.id} className="p-5 sm:p-6">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="font-bold">
                            {attempt.assessment.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {attempt.completedAt
                              ? new Date(attempt.completedAt).toLocaleString()
                              : "Completion date unavailable"}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            {attempt.correctAnswers} correct ·{" "}
                            {attempt.incorrectAnswers} incorrect ·{" "}
                            {attempt.totalQuestions} questions
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              attempt.score >= 50
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {attempt.score >= 50 ? "Passed" : "Keep practising"}
                          </span>
                          <span className="text-2xl font-bold">
                            {attempt.score}%
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-6">
              <Link
                href="/assessments"
                className="inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Take another assessment
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
