
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Question = {
  id: string;
  question: string;
  options: string[];
  order: number;
};

type Assessment = {
  id: string;
  title: string;
  description?: string | null;
  questions: Question[];
};

type Result = {
  attemptId: string;
  assessmentId: string;
  title: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  passed: boolean;
};

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAssessments() {
      try {
        const response = await fetch("/api/assessments");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load assessments.");
        }

        const list: Assessment[] = data.assessments || [];
        setAssessments(list);

        const preferred = list.find(
          (item) =>
            item.title.toLowerCase() === "digital literacy fundamentals"
        );

        if (preferred) {
          setSelectedAssessment(preferred);
        } else if (list.length > 0) {
          setSelectedAssessment(list[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load assessments."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAssessments();
  }, []);

  function selectAssessment(assessment: Assessment) {
    setSelectedAssessment(assessment);
    setAnswers({});
    setResult(null);
    setError("");
  }

  async function submitAnswers() {
    if (!selectedAssessment || submitting) return;

    if (
      selectedAssessment.questions.some(
        (question) => !answers[question.id]
      )
    ) {
      setError("Please answer every question before submitting.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/assessments/${selectedAssessment.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Assessment submission failed.");
      }

      setResult(data.result as Result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit assessment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function retryAssessment() {
    setAnswers({});
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm font-medium text-blue-700 hover:underline"
        >
          ← Back to dashboard
        </Link>

        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            MobiSkill Uganda · Practice
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Skills assessments
          </h1>
          <p className="mt-3 text-slate-600">
            Test your knowledge and build confidence in your digital skills.
          </p>
        </header>

        {loading ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            Loading assessments...
          </div>
        ) : error && assessments.length === 0 ? (
          <div className="rounded-xl border border-red-200 bg-white p-6 text-red-700">
            {error}
          </div>
        ) : assessments.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            No published assessments are available yet.
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {assessments.map((assessment) => (
                <button
                  key={assessment.id}
                  onClick={() => selectAssessment(assessment)}
                  className={`rounded-xl border p-5 text-left transition ${
                    selectedAssessment?.id === assessment.id
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <span className="text-sm font-medium text-blue-700">
                    {assessment.questions.length} questions
                  </span>
                  <h2 className="mt-2 text-lg font-bold">
                    {assessment.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {assessment.description || "Test your skills and knowledge."}
                  </p>
                </button>
              ))}
            </div>

            {selectedAssessment && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                {result ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-blue-700">
                      {result.score}%
                    </div>

                    <h2 className="mt-5 text-2xl font-bold">
                      {result.passed ? "Well done!" : "Keep practising!"}
                    </h2>
                    <p className="mt-2 text-slate-600">{result.title}</p>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Correct</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-700">
                          {result.correctAnswers}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Incorrect</p>
                        <p className="mt-1 text-2xl font-bold text-red-600">
                          {result.incorrectAnswers}
                        </p>
                      </div>
                      <div className="col-span-2 rounded-xl bg-slate-50 p-4 sm:col-span-1">
                        <p className="text-sm text-slate-500">Total</p>
                        <p className="mt-1 text-2xl font-bold">
                          {result.totalQuestions}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm text-slate-600">
                      {result.passed
                        ? "You achieved the passing score of 50% or higher."
                        : "You need at least 50% to pass. Review your learning materials and try again."}
                    </p>

                    <button
                      onClick={retryAssessment}
                      className="mt-6 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 border-b border-slate-100 pb-5">
                      <h2 className="text-2xl font-bold">
                        {selectedAssessment.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Answer all {selectedAssessment.questions.length} questions.
                      </p>
                      <p className="mt-2 text-sm font-medium text-blue-700">
                        Answered: {Object.keys(answers).length} /{" "}
                        {selectedAssessment.questions.length}
                      </p>
                    </div>

                    <div className="space-y-8">
                      {selectedAssessment.questions.map((question, index) => (
                        <fieldset
                          key={question.id}
                          className="border-b border-slate-100 pb-6 last:border-0"
                        >
                          <legend className="mb-4 font-semibold leading-7">
                            {index + 1}. {question.question}
                          </legend>

                          <div className="space-y-3">
                            {question.options.map((option) => (
                              <label
                                key={option}
                                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                                  answers[question.id] === option
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={option}
                                  checked={answers[question.id] === option}
                                  disabled={submitting}
                                  onChange={() =>
                                    setAnswers((previous) => ({
                                      ...previous,
                                      [question.id]: option,
                                    }))
                                  }
                                  className="mt-1 accent-blue-600"
                                />
                                <span className="text-sm leading-6">
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      ))}
                    </div>

                    {error && (
                      <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                      </p>
                    )}

                    <button
                      onClick={submitAnswers}
                      disabled={submitting}
                      className="mt-6 w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {submitting ? "Submitting..." : "Submit answers"}
                    </button>
                  </>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
