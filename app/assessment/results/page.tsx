
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { mockAssessment } from "@/lib/mock/assessment";
import type { AssessmentScore } from "@/lib/assessment/scoring";

export default function AssessmentResultsPage() {
  const [score, setScore] = useState<AssessmentScore | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      try {
        const savedScore = sessionStorage.getItem(
          "mobiskill-assessment-score"
        );

        if (!savedScore) {
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
          }
          return;
        }

        const parsed: unknown = JSON.parse(savedScore);

        if (
          typeof parsed !== "object" ||
          parsed === null ||
          !("correct" in parsed) ||
          typeof parsed.correct !== "number" ||
          !("total" in parsed) ||
          typeof parsed.total !== "number" ||
          !("percentage" in parsed) ||
          typeof parsed.percentage !== "number" ||
          !("skillScores" in parsed) ||
          !Array.isArray(parsed.skillScores) ||
          parsed.correct < 0 ||
          parsed.total <= 0 ||
          parsed.correct > parsed.total ||
          parsed.percentage < 0 ||
          parsed.percentage > 100
        ) {
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setScore(parsed as AssessmentScore);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  function handleRetake() {
    sessionStorage.removeItem("mobiskill-assessment-answers");
    sessionStorage.removeItem("mobiskill-assessment-score");
  }

  function getSkillName(skillId: string): string {
    const skill = mockAssessment.skills.find(
      (item) => item.id === skillId
    );

    return skill?.name ?? skillId.replace(/-/g, " ");
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-slate-600">
            Loading your assessment results...
          </p>
        </div>
      </main>
    );
  }

  if (hasError || !score) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="mb-3 text-2xl font-bold text-slate-900">
            Results unavailable
          </h1>
          <p className="mb-6 text-slate-600">
            We could not find valid results for your assessment. Please take
            the assessment again to see your score.
          </p>
          <Link
            href="/assessment/start"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Start Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const percentage = Math.round(score.percentage);
  const skillScores = score.skillScores;

  const strongestSkill =
    skillScores.length > 0
      ? [...skillScores].sort((a, b) => b.percentage - a.percentage)[0]
      : null;

  const weakestSkill =
    skillScores.length > 0
      ? [...skillScores].sort((a, b) => a.percentage - b.percentage)[0]
      : null;

  let performanceMessage =
    "Keep practising and building your digital skills.";

  if (percentage >= 80) {
    performanceMessage =
      "Excellent work! You have demonstrated a strong understanding of these skills.";
  } else if (percentage >= 60) {
    performanceMessage =
      "Good progress! Keep practising to strengthen your digital skills.";
  } else if (percentage >= 40) {
    performanceMessage =
      "You have a foundation to build on. Regular practice will help you improve.";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/assessment"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessment
        </Link>

        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Award className="h-8 w-8 text-blue-600" />
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Assessment complete
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Your Digital Skills Results
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            {performanceMessage}
          </p>
        </header>

        <section
          aria-label="Overall assessment score"
          className="mb-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="text-center">
              <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-blue-100">
                <div className="text-center">
                  <p className="text-5xl font-bold text-blue-600">
                    {percentage}%
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Overall score
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Assessment summary
              </h2>

              <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm text-slate-500">
                    Correct answers
                  </p>
                  <p className="font-semibold text-slate-900">
                    {score.correct} out of {score.total}
                  </p>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <Target className="h-6 w-6 shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500">Skills assessed</p>
                  <p className="font-semibold text-slate-900">
                    {skillScores.length}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                Your result is a starting point for identifying what you know
                and what you can practise next.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Skill performance
              </h2>
              <p className="text-sm text-slate-500">
                Your results across the assessed skill areas.
              </p>
            </div>
          </div>

          {skillScores.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-slate-600">
              No individual skill breakdown is available for this assessment.
            </p>
          ) : (
            <div className="space-y-6">
              {skillScores.map((skill) => (
                <div key={skill.skillId}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="font-medium capitalize text-slate-800">
                      {getSkillName(skill.skillId)}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {Math.round(skill.percentage)}%
                    </span>
                  </div>
                  <div
                    className="h-3 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={`${getSkillName(skill.skillId)} score`}
                    aria-valuenow={Math.round(skill.percentage)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, skill.percentage)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-green-100 bg-green-50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Strongest area
              </h2>
            </div>
            {strongestSkill ? (
              <>
                <p className="mb-2 text-xl font-semibold capitalize text-green-800">
                  {getSkillName(strongestSkill.skillId)}
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  You achieved {Math.round(strongestSkill.percentage)}% in this
                  area. Keep practising to maintain and improve this skill.
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-600">
                Complete an assessment with skill breakdowns to identify your
                strongest area.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-amber-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Area to practise
              </h2>
            </div>
            {weakestSkill ? (
              <>
                <p className="mb-2 text-xl font-semibold capitalize text-amber-800">
                  {getSkillName(weakestSkill.skillId)}
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  You achieved {Math.round(weakestSkill.percentage)}% in this
                  area. Consider focusing on it as you continue learning.
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-600">
                Your skill breakdown will help identify areas to practise.
              </p>
            )}
          </section>
        </div>

        <section className="mb-8 rounded-2xl bg-blue-50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Ready for your next step?
                </h2>
                <p className="mt-2 max-w-xl text-slate-600">
                  Explore suggested learning directions and practical
                  opportunities based on your skills.
                </p>
              </div>
            </div>

            <Link
              href="/recommendations"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View Recommendations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/assessment/start"
            onClick={handleRetake}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Assessment
          </Link>

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-slate-500">
          These results are intended to guide your learning. They do not
          determine your career or employment eligibility.
        </p>
      </div>
    </main>
  );
}
