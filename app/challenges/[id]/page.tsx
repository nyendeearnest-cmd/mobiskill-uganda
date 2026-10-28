
import Link from "next/link";
import { notFound } from "next/navigation";
import { challenges } from "@/lib/member2";

type ChallengeDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChallengeDetailsPage({
  params,
}: ChallengeDetailsPageProps) {
  const { id } = await params;
  const challenge = challenges.find((item) => item.id === id);

  if (!challenge) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/challenges"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          â† All challenges
        </Link>

        <section className="mt-6 rounded-3xl bg-blue-700 p-7 text-white sm:p-9">
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
            {challenge.category}
          </span>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            {challenge.title}
          </h1>

          <p className="mt-4 leading-7 text-blue-50">
            {challenge.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-lg bg-white/15 px-3 py-2">
              {challenge.difficulty}
            </span>
            <span className="rounded-lg bg-white/15 px-3 py-2">
              Estimated time: {challenge.duration}
            </span>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">What you will practice</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {challenge.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">Instructions</h2>
          <ol className="mt-5 space-y-4">
            {challenge.instructions.map((instruction, index) => (
              <li key={instruction} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-800">
                  {index + 1}
                </span>
                <p className="pt-0.5 leading-6 text-slate-700">
                  {instruction}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
          <h2 className="font-bold text-green-950">What to submit</h2>
          <p className="mt-2 leading-6 text-green-900">
            {challenge.deliverable}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">Ready to submit your work?</h2>
          <p className="mt-2 leading-6 text-slate-600">
            The submission form and evaluation feedback will be added in the
            next batch. Your work is not uploaded or saved by this preview yet.
          </p>
          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-500 sm:w-auto"
          >
            Submission form coming next
          </button>
        </section>
      </div>
    </main>
  );
}
