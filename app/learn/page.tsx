"use client";

import { useEffect, useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  description: string;
  level: string;
  thumbnail: string | null;
  skill: {
    id: string;
    name: string;
    category: string;
  };
  modulesCount: number;
  lessonsCount: number;
};

export default function LearnPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All levels");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/courses");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load courses.");
        }

        setCourses(data.courses);
      } catch (error) {
        console.error("Load courses error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load courses."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        course.title.toLowerCase().includes(searchText) ||
        course.description.toLowerCase().includes(searchText) ||
        course.skill.name.toLowerCase().includes(searchText) ||
        course.skill.category.toLowerCase().includes(searchText);

      const matchesLevel =
        level === "All levels" || course.level === level;

      return matchesSearch && matchesLevel;
    });
  }, [courses, search, level]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              MobiSkill Uganda
            </h1>

            <p className="text-sm text-slate-500">
              Learn. Practice. Earn.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            L
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Heading */}
        <section className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            LEARNING HUB
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Build skills that matter
          </h2>

          <p className="mt-3 max-w-2xl text-slate-500">
            Explore practical courses designed to help you develop useful
            digital skills for school, work, business, and everyday life.
          </p>
        </section>

        {/* Search */}
        <section className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label
                htmlFor="course-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Search courses
              </label>

              <input
                id="course-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for a skill or course..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:w-48">
              <label
                htmlFor="level"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Level
              </label>

              <select
                id="level"
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option>All levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
        </section>

        {/* Course heading */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Available Courses
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Start learning at your own pace.
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
            {filteredCourses.length} courses
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <section className="rounded-xl border bg-white p-10 text-center shadow-sm">
            <div className="text-4xl">📚</div>

            <h3 className="mt-3 text-lg font-bold text-slate-900">
              Loading courses...
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Getting the latest learning content.
            </p>
          </section>
        )}

        {/* Error */}
        {!loading && error && (
          <section className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="text-4xl">⚠️</div>

            <h3 className="mt-3 text-lg font-bold text-red-800">
              Unable to load courses
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </section>
        )}

        {/* Empty search result */}
        {!loading &&
          !error &&
          filteredCourses.length === 0 && (
            <section className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <div className="text-4xl">🔎</div>

              <h3 className="mt-3 text-lg font-bold text-slate-900">
                No courses found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another search term or select a different level.
              </p>
            </section>
          )}

        {/* Course cards */}
        {!loading &&
          !error &&
          filteredCourses.length > 0 && (
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <article
                  key={course.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Banner */}
                  <div className="flex h-32 items-center justify-center bg-blue-600">
                    <span className="text-5xl">📚</span>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {course.skill.category || course.skill.name}
                      </span>

                      <span className="text-xs font-medium text-slate-500">
                        {course.level}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-slate-900">
                      {course.title}
                    </h4>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {course.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                      <span>
                        {course.lessonsCount} lessons
                      </span>

                      <span>
                        {course.modulesCount} modules
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: "0%" }}
                      />
                    </div>

                    <div className="mt-1 text-right text-xs text-slate-400">
                      0% complete
                    </div>

                    {/* Navigation */}
                    <a
                      href={`/learn/${course.id}`}
                      className="mt-6 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Start Course
                    </a>
                  </div>
                </article>
              ))}
            </section>
          )}

        {/* Learning message */}
        <section className="mt-10 rounded-xl border border-dashed bg-white p-8 text-center">
          <div className="text-4xl">🎯</div>

          <h3 className="mt-3 text-lg font-bold text-slate-900">
            Learn by doing
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            MobiSkill is designed around practical learning. After completing
            lessons, you will be able to practice your skills through
            challenges and build a stronger skills profile.
          </p>
        </section>
      </div>
    </main>
  );
}