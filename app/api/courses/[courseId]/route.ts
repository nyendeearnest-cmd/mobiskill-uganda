import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { courseId } = await context.params;

    if (!courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Course ID is required.",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },

      include: {
        skill: true,

        modules: {
          orderBy: {
            order: "asc",
          },

          include: {
            lessons: {
              orderBy: {
                order: "asc",
              },

              select: {
                id: true,
                title: true,
                content: true,
                videoUrl: true,
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

    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );

    return NextResponse.json({
      success: true,

      course: {
        id: course.id,
        title: course.title,
        description: course.description ?? "",
        level: course.level,
        thumbnail: course.thumbnail,

        skill: {
          id: course.skill.id,
          name: course.skill.name,
          description: course.skill.description ?? "",
          category: course.skill.category ?? "",
        },

        modulesCount: course.modules.length,
        lessonsCount: totalLessons,

        modules: course.modules.map((module) => ({
          id: module.id,
          title: module.title,
          description: module.description ?? "",
          order: module.order,

          lessons: module.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            order: lesson.order,
          })),
        })),
      },
    });
  } catch (error) {
    console.error("Course details GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load course.",
      },
      { status: 500 }
    );
  }
}