
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const { courseId } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                order: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found.",
        },
        { status: 404 }
      );
    }

    const lessonIds = course.modules.flatMap((module) =>
      module.lessons.map((lesson) => lesson.id)
    );

    const completedProgress = await prisma.learningProgress.findMany({
      where: {
        userId: user.id,
        completed: true,
        lessonId: { in: lessonIds },
      },
      select: {
        lessonId: true,
        completedAt: true,
      },
    });

    const completedLessonIds = completedProgress.map(
      (item) => item.lessonId
    );

    const totalLessons = lessonIds.length;
    const completedLessons = completedLessonIds.length;

    const progress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      select: {
        id: true,
        progress: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      courseId,
      totalLessons,
      completedLessons,
      progress,
      completedLessonIds,
      enrollment,
    });
  } catch (error) {
    console.error("Get course progress error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load course progress.",
      },
      { status: 500 }
    );
  }
}