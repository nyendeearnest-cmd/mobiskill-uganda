
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CirclePlay,
  FileText,
  Lock,
  Play,
  Trophy,
} from "lucide-react";

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

export default function LessonPage({
  params,
}: {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}) {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(true);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");
  const [progressError, setProgressError] = useState("");
  const [courseProgress, setCourseProgress] = useState<number | null>(null);

  // Read route parameters.
  useEffect(() => {
    let cancelled = false;

    async function getParams() {
      try {
        const routeParams = await params;

        if (!cancelled) {
          setCourseId(routeParams.courseId);
          setLessonId(routeParams.lessonId);
        }
      } catch (err) {
        console.error("Route parameters error:", err);

        if (!cancelled) {
          setError("Could not load the lesson URL.");
          setLoading(false);
        }
      }
    }

    getParams();

    return () => {
      cancelled = true;
    };
  }, [params]);

  // Load course details.
  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;

    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/courses/${courseId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load course.");
        }

        if (!cancelled) {
          setCourse(data.course);
        }
      } catch (err) {
        console.error("Load course error:", err);

        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load course."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  // Load saved completion status and progress from PostgreSQL.
  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;

    async function loadProgress() {
      try {
        setProgressLoading(true);
        setProgressError("");

        const response = await fetch(
          `/api/courses/${courseId}/progress`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load saved progress.");
        }

        if (!cancelled) {
          setCompletedLessonIds(data.completedLessonIds ?? []);
          setCourseProgress(
            typeof data.progress === "number" ? data.progress : 0
          );
        }
      } catch (err) {
        console.error("Load saved progress error:", err);

        if (!cancelled) {
          setProgressError(
            err instanceof Error
              ? err.message
              : "Could not load saved lesson progress."
          );
        }
      } finally {
        if (!cancelled) {
          setProgressLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  // Show loading screen while the course loads.
  if (loading || !courseId || !lessonId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-slate-600">Loading lesson...</p>
        </div>
      </main>
    );
  }

  // Show course loading errors.
  if (error && !course) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <BookOpen className="mx-auto h-16 w-16 text-slate-400" />
          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Could Not Load Course
          </h1>
          <p className="mt-3 text-slate-600">{error}</p>
          <Link
            href="/learn"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Learning
          </Link>
        </div>
      </main>
    );
  }

  if (!course) return null;

  // Flatten the lessons for previous/next navigation.
  const allLessons = course.modules.flatMap((module) => module.lessons);

  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === lessonId
  );

  if (currentLessonIndex === -1) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <FileText className="mx-auto h-16 w-16 text-slate-400" />
          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Lesson Not Found
          </h1>
          <p className="mt-3 text-slate-600">
            This lesson could not be found in the selected course.
          </p>
          <Link
            href={`/learn/${courseId}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Link>
        </div>
      </main>
    );
  }

  const currentLesson = allLessons[currentLessonIndex];
  const previousLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  // Completion comes from the saved lesson IDs, not the lesson's position.
  const completed = completedLessonIds.includes(lessonId);

  // Use the progress value returned by the database.
  const displayedProgress = courseProgress ?? 0;

  // Save lesson completion through the existing API.
  const handleCompleteLesson = async () => {
    if (completed || completing) return;

    try {
      setError("");
      setCompleting(true);

      const response = await fetch(
        `/api/lessons/${lessonId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to complete lesson.");
      }

      // Update the UI with the saved completion.
      setCompletedLessonIds((previous) =>
        previous.includes(lessonId)
          ? previous
          : [...previous, lessonId]
      );

      if (typeof data.course?.progress === "number") {
        setCourseProgress(data.course.progress);
      }
    } catch (err) {
      console.error("Complete lesson error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete lesson."
      );
    } finally {
      setCompleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-blue-600"
          >
            MobiSkill Uganda
          </Link>

          <Link
            href={`/learn/${courseId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/learn" className="hover:text-blue-600">
            Learning
          </Link>
          <span>/</span>
          <Link
            href={`/learn/${courseId}`}
            className="hover:text-blue-600"
          >
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-slate-900">{currentLesson.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main lesson */}
          <section>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    <BookOpen className="h-4 w-4" />
                    Lesson {currentLessonIndex + 1}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                    📖 Self-paced
                  </span>

                  {completed && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </span>
                  )}
                </div>

                <h1 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
                  {currentLesson.title}
                </h1>

                <p className="mt-3 text-slate-500">{course.title}</p>
              </div>

              <div className="p-6 md:p-8">
                {/* Video */}
                {currentLesson.videoUrl ? (
                  <div className="overflow-hidden rounded-2xl bg-black">
                    <video
                      controls
                      className="aspect-video w-full"
                      src={currentLesson.videoUrl}
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-900">
                    <div className="text-center text-white">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <CirclePlay className="h-9 w-9" />
                      </div>
                      <p className="mt-4 text-lg font-semibold">
                        Lesson Content
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Video content can be connected here later.
                      </p>
                    </div>
                  </div>
                )}

                {/* Lesson content */}
                <article className="mt-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    About this lesson
                  </h2>
                  <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-slate-700">
                    {currentLesson.content}
                  </p>
                </article>

                {/* Practice section */}
                <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Practice what you learned
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        After studying this lesson, complete the practical
                        challenge to strengthen your skill.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error messages */}
                {(error || progressError) && (
                  <div
                    role="alert"
                    className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    {error || progressError}
                  </div>
                )}

                {/* Completion and progress */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Course progress
                    </p>

                    <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${displayedProgress}%` }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {progressLoading
                        ? "Loading saved progress..."
                        : `${displayedProgress}% complete`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCompleteLesson}
                    disabled={completed || completing}
                    className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold transition ${
                      completed
                        ? "cursor-not-allowed bg-green-100 text-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    }`}
                  >
                    {completed ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Lesson Completed
                      </>
                    ) : completing ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Complete Lesson
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Previous / Next */}
            <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row">
              {previousLesson ? (
                <Link
                  href={`/learn/${courseId}/${previousLesson.id}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous Lesson
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/learn/${courseId}/${nextLesson.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Next Lesson
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href={`/learn/${courseId}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >
                  Finish Course
                  <Trophy className="h-4 w-4" />
                </Link>
              )}
            </div>
          </section>

          {/* Course sidebar */}
          <aside>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Course Lessons
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {allLessons.length} lessons
              </p>

              <div className="mt-5 space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id}>
                    <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                      {module.title}
                    </p>

                    <div className="space-y-1">
                      {module.lessons.map((lesson) => {
                        const index = allLessons.findIndex(
                          (item) => item.id === lesson.id
                        );

                        const isCurrent = lesson.id === lessonId;
                        const isCompleted = completedLessonIds.includes(
                          lesson.id
                        );

                        return (
                          <Link
                            key={lesson.id}
                            href={`/learn/${courseId}/${lesson.id}`}
                            className={`flex items-center gap-3 rounded-lg p-3 transition ${
                              isCurrent
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <div className="shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : isCurrent ? (
                                <Play className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Lock className="h-4 w-4 text-slate-400" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  isCurrent
                                    ? "text-blue-700"
                                    : "text-slate-700"
                                }`}
                              >
                                {index + 1}. {lesson.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {isCompleted ? "Completed" : `Lesson ${index + 1}`}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Saved progress summary */}
              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {progressLoading ? "..." : `${displayedProgress}%`}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${displayedProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {completedLessonIds.length} of {allLessons.length} lessons completed
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}