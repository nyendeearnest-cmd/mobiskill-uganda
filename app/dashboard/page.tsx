
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Target,
  TrendingUp,
  Trophy,
  ArrowRight,
  PlayCircle,
  Lightbulb,
  BriefcaseBusiness,
  History,
} from "lucide-react";

import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const [enrollments, skillsCount] = await Promise.all([
    prisma.enrollment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        startedAt: "desc",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            level: true,
            skill: {
              select: {
                name: true,
              },
            },
            modules: {
              include: {
                lessons: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.userSkill.count({
      where: {
        userId: user.id,
      },
    }),
  ]);

  const allLessonIds = enrollments.flatMap((enrollment) =>
    enrollment.course.modules.flatMap((module) =>
      module.lessons.map((lesson) => lesson.id)
    )
  );

  const completedRecords =
    allLessonIds.length > 0
      ? await prisma.learningProgress.findMany({
          where: {
            userId: user.id,
            lessonId: {
              in: allLessonIds,
            },
            completed: true,
          },
          select: {
            lessonId: true,
          },
        })
      : [];

  const completedLessonIds = new Set(
    completedRecords.map((record) => record.lessonId)
  );

  const completedLessons = completedLessonIds.size;
  const totalLessons = allLessonIds.length;

  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (sum, enrollment) => sum + enrollment.progress,
            0
          ) / enrollments.length
        )
      : 0;

  const completedCourses = enrollments.filter(
    (enrollment) => enrollment.progress >= 100
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-100">
                LEARN • PRACTICE • EARN
              </p>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Welcome back, {user.name?.split(" ")[0] || "Learner"}!
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                Continue building your digital skills, practise what you learn,
                and prepare for new opportunities.
              </p>

              <Link
                href="/learn"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-800 hover:bg-blue-50"
              >
                Explore courses
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="hidden rounded-2xl bg-white/10 p-5 md:block">
              <GraduationCap size={64} />
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Your learning overview
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Courses Enrolled"
              value={enrollments.length}
              description={completedCourses + " completed"}
              icon={<BookOpen size={22} />}
            />

            <StatCard
              title="Learning Progress"
              value={averageProgress + "%"}
              description="Average course progress"
              icon={<TrendingUp size={22} />}
            />

            <StatCard
              title="Lessons Completed"
              value={completedLessons}
              description={totalLessons + " lessons in your courses"}
              icon={<CheckCircle2 size={22} />}
            />

            <StatCard
              title="Skills Developed"
              value={skillsCount}
              description="Skills in your profile"
              icon={<Trophy size={22} />}
            />
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                My Learning
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Continue where you left off.
              </p>
            </div>

            <Link
              href="/learn"
              className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
            >
              Browse courses
              <ArrowRight size={17} />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <BookOpen
                size={36}
                className="mx-auto mb-4 text-blue-700"
              />

              <h3 className="text-lg font-bold text-slate-900">
                Start your learning journey
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You have no enrolled courses yet. Explore available courses
                and start developing your digital skills.
              </p>

              <Link
                href="/learn"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Find a course
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {enrollments.map((enrollment) => {
                const course = enrollment.course;

                const lessons = course.modules.flatMap(
                  (module) => module.lessons
                );

                const completedCount = lessons.filter((lesson) =>
                  completedLessonIds.has(lesson.id)
                ).length;

                const lessonCount = lessons.length;

                const progress =
                  lessonCount > 0
                    ? Math.round((completedCount / lessonCount) * 100)
                    : 0;

                const nextLesson = lessons.find(
                  (lesson) => !completedLessonIds.has(lesson.id)
                );

                const targetLesson = nextLesson || lessons[0];

                return (
                  <article
                    key={enrollment.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <GraduationCap size={25} />
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {course.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {course.description ||
                        "Develop practical digital skills."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen size={14} />
                        {lessonCount} lessons
                      </span>

                      {course.skill?.name && (
                        <span className="inline-flex items-center gap-1">
                          <Target size={14} />
                          {course.skill.name}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        {completedCount}/{lessonCount} completed
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium text-slate-600">
                          Course progress
                        </span>

                        <span className="font-bold text-blue-700">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: progress + "%" }}
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      {progress >= 100 ? (
                        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                          <CheckCircle2 size={18} />
                          Course completed
                        </div>
                      ) : targetLesson ? (
                        <Link
                          href={
                            "/learn/" + course.id + "/" + targetLesson.id
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800"
                        >
                          <PlayCircle size={18} />
                          Continue learning
                        </Link>
                      ) : (
                        <Link
                          href={"/learn/" + course.id}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800"
                        >
                          View course
                          <ArrowRight size={18} />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Continue growing
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ActionCard
              title="Assess Your Skills"
              description="Take digital skills assessments, get your score, and identify areas for improvement."
              icon={<Target size={24} />}
              href="/assessments"
              buttonText="Take assessment"
              iconColor="bg-purple-50 text-purple-700"
            />

            <ActionCard
              title="Assessment History"
              description="Review your previous assessment attempts, scores, and pass or fail results."
              icon={<History size={24} />}
              href="/assessments/history"
              buttonText="View history"
              iconColor="bg-blue-50 text-blue-700"
            />

            <ActionCard
              title="Practical Challenges"
              description="Apply your knowledge by working through practical tasks."
              icon={<Lightbulb size={24} />}
              href="/challenges"
              buttonText="Explore challenges"
              iconColor="bg-amber-50 text-amber-700"
            />

            <ActionCard
              title="Career Opportunities"
              description="Explore opportunities to put your skills into practice."
              icon={<BriefcaseBusiness size={24} />}
              href="/opportunities"
              buttonText="View opportunities"
              iconColor="bg-green-50 text-green-700"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white p-3 text-blue-700 shadow-sm">
              <Trophy size={23} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Build your skills profile
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Track your skills and demonstrate what you have learned.
                Completing lessons and practical challenges helps you progress.
              </p>

              <Link
                href="/profile/skills"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                View my skills
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  icon,
  href,
  buttonText,
  iconColor,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  buttonText: string;
  iconColor: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={
          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl " +
          iconColor
        }
      >
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-900">{title}</h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
      >
        {buttonText}
        <ArrowRight size={17} />
      </Link>
    </article>
  );
}
