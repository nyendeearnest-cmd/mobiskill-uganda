
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardCheck,
} from "lucide-react";
import { publicAssessmentQuestions } from "@/lib/mock/publicAssessmentQuestions";

export default function AssessmentStartPage() {
  const router = useRouter();
  const questions = publicAssessmentQuestions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id];

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const progress =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  function handleAnswerSelect(answer: string) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: answer,
    }));

    setSubmitError("");
  }

  function handlePrevious() {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((previousIndex) => previousIndex - 1);
      setSubmitError("");
    }
  }

  function handleNext() {
    if (!isLastQuestion && selectedAnswer) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
      setSubmitError("");
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    if (questions.some((question) => !answers[question.id])) {
      setSubmitError("Please answer every question before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "We couldn't submit your assessment."
        );
      }

      sessionStorage.setItem(
        "mobiskill-assessment-answers",
        JSON.stringify(answers)
      );

      sessionStorage.setItem(
        "mobiskill-assessment-score",
        JSON.stringify(data.score)
      );

      router.push("/assessment/results");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
            Digital Skills Assessment
          </div>
        </div>

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Assessment progress
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            <p className="text-sm font-semibold text-blue-600">
              {Math.round(progress)}%
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-medium capitalize text-blue-600">
              {currentQuestion.skillId.replace("-", " ")}
            </p>

            <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 md:text-3xl">
              {currentQuestion.question}
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Select the answer that you think is correct.
            </p>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswerSelect(option)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400" />
                    )}
                  </span>

                  <span
                    className={`text-sm leading-6 ${
                      isSelected
                        ? "font-semibold text-slate-900"
                        : "font-medium text-slate-700"
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {submitError && (
            <p role="alert" className="mt-5 text-sm font-medium text-red-600">
              {submitError}
            </p>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isFirstQuestion || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {!isLastQuestion ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedAnswer || isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedAnswer || isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting ? "Submitting..." : "Submit Assessment"}
                <CheckCircle2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
