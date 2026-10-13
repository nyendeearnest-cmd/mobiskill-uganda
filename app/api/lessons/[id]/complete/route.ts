
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: RouteContext
) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { id: lessonId } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, message: "Lesson not found." },
        { status: 404 }
      );
    }

    const courseId = lesson.module.courseId;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found." },
        { status: 404 }
      );
    }

    await prisma.learningProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    const lessonIds = course.modules.flatMap((module) =>
      module.lessons.map((item) => item.id)
    );

    const totalLessons = lessonIds.length;

    const completedLessons = totalLessons
      ? await prisma.learningProgress.count({
          where: {
            userId: user.id,
            completed: true,
            lessonId: { in: lessonIds },
          },
        })
      : 0;

    const progress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      update: {
        progress,
        completedAt: progress === 100 ? new Date() : null,
      },
      create: {
        userId: user.id,
        courseId,
        progress,
        completedAt: progress === 100 ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lesson completed successfully.",
      lesson: {
        id: lessonId,
        completed: true,
      },
      course: {
        id: courseId,
        totalLessons,
        completedLessons,
        progress,
        completed: progress === 100,
      },
      enrollment: {
        id: enrollment.id,
        progress: enrollment.progress,
      },
    });
  } catch (error) {
    console.error("Lesson completion error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to complete lesson." },
      { status: 500 }
    );
  }
}