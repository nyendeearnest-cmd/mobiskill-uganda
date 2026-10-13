
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    if (user.role !== "LEARNER" && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to view assessments.",
        },
        { status: 403 }
      );
    }

    const assessments = await prisma.assessment.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        skill: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            explanation: true,
            order: true,
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

    const formattedAssessments = assessments.map((assessment) => ({
      id: assessment.id,
      title: assessment.title,
      description: assessment.description ?? "",
      createdAt: assessment.createdAt,
      skill: assessment.skill
        ? {
            id: assessment.skill.id,
            name: assessment.skill.name,
            category: assessment.skill.category ?? "",
          }
        : null,
      questions: assessment.questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        explanation: question.explanation ?? "",
        order: question.order,
      })),
      questionCount: assessment.questions.length,
    }));

    return NextResponse.json({
      success: true,
      assessments: formattedAssessments,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to view assessments.",
        },
        { status: 401 }
      );
    }

    console.error("Assessments GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load assessments.",
      },
      { status: 500 }
    );
  }
}
