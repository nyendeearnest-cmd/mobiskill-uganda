"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Lesson = {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
};

type CourseModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  level: string;
  thumbnail: string | null;

  skill: {
    id: string;
    name: string;
    description: string;
    category: string;
  };

  modulesCount: number;
  lessonsCount: number;

  modules: CourseModule[];
};

export default function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        const { courseId } = await params;

        const response = await fetch(`/api/courses/${courseId}`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load course.");
        }

        setCourse(data.course);
      } catch (error) {
        console.error("Load course error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load course."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <div className="text-5xl">📚</div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Loading course...
          </h1>

          <p className="mt-2 text-slate-500">
            Getting the course content.
          </p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <div className="text-5xl">⚠️</div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Course not found
          </h1>

          <p className="mt-2 text-slate-500">
            {error || "The course could not be loaded."}
          </p>

          <Link
            href="/learn"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Learning Hub
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/learn"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Learning Hub
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              MobiSkill Uganda
            </h1>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            L
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Course Hero */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex min-h-64 items-center justify-center bg-blue-600">
            <span className="text-7xl">📚</span>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                {course.skill.category || course.skill.name}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {course.level}
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {course.title}
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-slate-500">
              {course.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
              <span>
                📚 {course.modulesCount} modules
              </span>

              <span>
                📖 {course.lessonsCount} lessons
              </span>

              <span>
                🎯 {course.skill.name}
              </span>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold text-blue-600">
              COURSE CONTENT
            </p>

            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              What you will learn
            </h3>
          </div>

          <div className="space-y-5">
            {course.modules.map((module, moduleIndex) => (
              <article
                key={module.id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <div className="border-b bg-slate-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                      {moduleIndex + 1}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {module.title}
                      </h4>

                      {module.description && (
                        <p className="mt-1 text-sm text-slate-500">
                          {module.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="divide-y">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between gap-4 p-5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                          {lessonIndex + 1}
                        </div>

                        <div>
                          <h5 className="font-semibold text-slate-900">
                            {lesson.title}
                          </h5>

                          <p className="mt-1 text-xs text-slate-500">
                            Lesson {lessonIndex + 1}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/learn/${course.id}/${lesson.id}`}
                        className="shrink-0 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                      >
                        Open
                      </Link>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Start Learning */}
        {course.modules.length > 0 &&
          course.modules[0].lessons.length > 0 && (
            <section className="mt-8 rounded-xl bg-blue-600 p-8 text-center text-white">
              <div className="text-4xl">🚀</div>

              <h3 className="mt-3 text-2xl font-bold">
                Ready to start learning?
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-blue-100">
                Start with the first lesson and build your skills step by
                step.
              </p>

              <Link
                href={`/learn/${course.id}/${course.modules[0].lessons[0].id}`}
                className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
              >
                Start First Lesson
              </Link>
            </section>
          )}
      </div>
    </main>
  );
}