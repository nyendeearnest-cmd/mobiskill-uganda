import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        published: true,
      },
      include: {
        skill: true,
        modules: {
          include: {
            lessons: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCourses = courses.map((course) => {
      const totalLessons = course.modules.reduce(
        (total, module) => total + module.lessons.length,
        0
      );

      return {
        id: course.id,
        title: course.title,
        description: course.description ?? "",
        level: course.level,
        thumbnail: course.thumbnail,
        skill: {
          id: course.skill.id,
          name: course.skill.name,
          category: course.skill.category ?? "",
        },
        modulesCount: course.modules.length,
        lessonsCount: totalLessons,
      };
    });

    return NextResponse.json({
      success: true,
      courses: formattedCourses,
    });
  } catch (error) {
    console.error("Courses GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load courses.",
      },
      { status: 500 }
    );
  }
}