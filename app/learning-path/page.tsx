
import Link from "next/link";
import { learningSteps } from "@/lib/member2";

export default function LearningPathPage() {
  const completed = learningSteps.filter((step) => step.completed).length;
  const progress = Math.round((completed / learningSteps.length) * 100);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/recommendations"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          â† Back to recommendations
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Your learning journey
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            My learning path
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Follow these activities in order. Complete the foundations first,
            then apply what you learn through a practical challenge.
          </p>
        </header>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Digital skills foundation</h2>
              <p className="mt-1 text-sm text-slate-600">
                {completed} of {learningSteps.length} activities completed
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              {progress}%
            </span>
          </div>

          <div
            className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Learning path progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-green-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section className="mt-7 space-y-4">
          {learningSteps.map((step, index) => (
            <article
              key={step.id}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  step.completed
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-50 text-blue-800"
                }`}
                aria-label={step.completed ? "Completed" : `Step ${index + 1}`}
              >
                {step.completed ? "âœ“" : index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {step.type}
                  </span>
                  {step.completed && (
                    <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                      Completed
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Estimated time: {step.duration}
                </p>

                {step.type === "Challenge" && (
                  <Link
                    href="/challenges/personal-portfolio"
                    className="mt-4 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    Open challenge â†’
                  </Link>
                )}

                {!step.completed && step.type !== "Challenge" && (
                  <Link
                    href="/challenges"
                    className="mt-4 inline-flex font-semibold text-blue-700 hover:underline"
                  >
                    Explore learning activities â†’
                  </Link>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl bg-blue-50 p-6">
          <h2 className="font-bold text-blue-950">Keep moving forward</h2>
          <p className="mt-2 text-sm leading-6 text-blue-900">
            Consistent practice helps you turn knowledge into demonstrable
            skills. Your saved progress will be connected when the backend is
            ready.
          </p>
          <Link
            href="/challenges"
            className="mt-4 inline-flex font-semibold text-blue-800 hover:underline"
          >
            Find your next challenge â†’
          </Link>
        </section>
      </div>
    </main>
  );
}
