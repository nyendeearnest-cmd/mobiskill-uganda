import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";
import { mockAssessment } from "@/lib/mock/assessment";

export default function AssessmentPage() {
  const assessment = mockAssessment;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <section className="mb-8">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
          </div>

          <p className="mb-2 text-sm font-semibold text-blue-600">
            MobiSkill Uganda
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {assessment.title}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            {assessment.description}
          </p>
        </section>

        {/* Assessment overview */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Questions
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {assessment.questionCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Questions to complete
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <Clock3 className="h-5 w-5 text-blue-600" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Estimated time
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {assessment.estimatedMinutes} min
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Take your time and read carefully
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Assessment type
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              Skills
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Digital skills baseline
            </p>
          </div>
        </section>

        {/* Skills being assessed */}
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Skills being assessed
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your answers will help MobiSkill understand your current
              strengths and identify areas where additional learning may
              be useful.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {assessment.skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {skill.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {skill.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Before you start */}
        <section className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Before you start
          </h2>

          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3 text-sm leading-6 text-slate-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <span>Answer each question as accurately as you can.</span>
            </li>

            <li className="flex items-start gap-3 text-sm leading-6 text-slate-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <span>
                Your results will help identify your current skill level.
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm leading-6 text-slate-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <span>
                Your results can be used to generate personalized learning
                recommendations.
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm leading-6 text-slate-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <span>There are no penalties for incorrect answers.</span>
            </li>
          </ul>
        </section>

        {/* Action */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/assessment/start"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}