
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Laptop,
  Menu,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Learn practical skills",
    description:
      "Build digital skills through structured courses and lessons designed to help you grow from beginner to confident learner.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Practice and prove yourself",
    description:
      "Test your knowledge with assessments, get your scores, track your progress, and discover where you can improve.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Turn skills into opportunities",
    description:
      "Prepare to pursue jobs, internships, freelance gigs, and business opportunities with practical digital skills.",
    icon: BriefcaseBusiness,
  },
];

const benefits = [
  "Learn at your own pace",
  "Track your learning progress",
  "Assess your knowledge",
  "Identify skills to improve",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <GraduationCap size={25} />
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-tight">
                MobiSkill <span className="text-emerald-600">UG</span>
              </span>
              <span className="block text-xs text-slate-500">
                Skills for your future
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-emerald-700">
              How it works
            </a>
            <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-emerald-700">
              Why MobiSkill
            </a>
            <Link href="/learn" className="text-sm font-medium text-slate-600 hover:text-emerald-700">
              Explore learning
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
              <Sparkles size={16} />
              Empowering Uganda through digital skills
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your future is{" "}
              <span className="text-emerald-600">digital.</span>
              <br />
              Start building it today.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Learn practical digital skills, test what you know, track your
              growth, and prepare to turn your knowledge into real-world
              opportunities.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-7 py-4 font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Start learning for free <ArrowRight size={19} />
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <BookOpen size={19} /> Explore courses
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                Learn at your pace
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                Track your progress
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-emerald-200/60 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-teal-200/60 blur-3xl" />

            <div className="relative rounded-3xl border border-white bg-white p-5 shadow-2xl shadow-emerald-900/10 sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    YOUR LEARNING JOURNEY
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold">
                    Small steps. Big progress.
                  </h2>
                </div>
                <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <TrendingUp size={24} />
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-emerald-50 p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <BookOpen size={23} />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold">LEARN</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Build your digital foundation
                    </p>
                  </div>
                  <CheckCircle2 className="text-emerald-600" size={21} />
                </div>

                <div className="ml-5 h-5 border-l-2 border-dashed border-emerald-300" />

                <div className="flex items-center gap-4 rounded-2xl bg-blue-50 p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Target size={23} />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold">PRACTICE</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Assess knowledge and improve
                    </p>
                  </div>
                  <ArrowRight className="text-blue-600" size={21} />
                </div>

                <div className="ml-5 h-5 border-l-2 border-dashed border-emerald-300" />

                <div className="flex items-center gap-4 rounded-2xl bg-amber-50 p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                    <BriefcaseBusiness size={23} />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold">EARN</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Prepare for real opportunities
                    </p>
                  </div>
                  <Zap className="text-amber-600" size={21} />
                </div>
              </div>

              <p className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center text-sm leading-6 text-slate-600">
                One platform to help you move from learning to practical
                confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8">
          <div className="flex items-center justify-center gap-3 py-3">
            <BookOpen className="text-emerald-600" size={25} />
            <span className="font-semibold">Structured learning</span>
          </div>
          <div className="flex items-center justify-center gap-3 py-3">
            <BrainCircuit className="text-emerald-600" size={25} />
            <span className="font-semibold">Knowledge assessments</span>
          </div>
          <div className="flex items-center justify-center gap-3 py-3">
            <TrendingUp className="text-emerald-600" size={25} />
            <span className="font-semibold">Personal progress tracking</span>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-700">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            From digital beginner to opportunity seeker
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Build knowledge, measure your progress, and take the next step
            toward your goals.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={27} />
                  </span>
                  <span className="text-sm font-extrabold tracking-widest text-slate-300">
                    {feature.number}
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-extrabold">{feature.title}</h3>
                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="benefits" className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-24">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              Designed around your growth
            </span>
            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight sm:text-4xl">
              Your skills. Your progress. Your next opportunity.
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-slate-300">
              MobiSkill Uganda brings learning and assessment together so you
              can understand what you know, identify what to improve, and
              prepare for the digital economy.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Create your account <ArrowRight size={18} />
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h3 className="text-xl font-extrabold">Built to support learners</h3>
            <div className="mt-6 space-y-5">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0 text-emerald-400" size={21} />
                  <span className="text-slate-200">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <Laptop className="mb-3 text-emerald-400" size={25} />
                <p className="font-bold">Digital readiness</p>
                <p className="mt-1 text-sm text-slate-400">
                  Practical foundations
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <Users className="mb-3 text-emerald-400" size={25} />
                <p className="font-bold">Inclusive learning</p>
                <p className="mt-1 text-sm text-slate-400">
                  Skills for more people
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 text-center sm:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-700">
            Start today
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Take the first step toward your digital future.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Start learning, test your knowledge, and keep building skills that
            can open doors.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Join MobiSkill Uganda <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:px-8 md:flex-row md:text-left">
          <div>
            <p className="font-extrabold">
              MobiSkill <span className="text-emerald-600">UG</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Digital skills for a more inclusive future.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Built for Uganda. Designed for opportunity.
          </p>
        </div>
      </footer>
    </main>
  );
}
