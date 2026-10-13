
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    const attempts = await prisma.assessmentAttempt.findMany({
      where: {
        userId: user.id,
        completedAt: { not: null },
      },
      orderBy: { completedAt: "desc" },
      select: {
        id: true,
        score: true,
        totalQuestions: true,
        correctAnswers: true,
        startedAt: true,
        completedAt: true,
        assessment: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      attempts: attempts.map((attempt) => ({
        id: attempt.id,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        incorrectAnswers: attempt.totalQuestions - attempt.correctAnswers,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        assessment: attempt.assessment,
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: "Please sign in to view your history." },
        { status: 401 }
      );
    }

    console.error("Assessment history error:", error);

    return NextResponse.json(
      { success: false, error: "Unable to load assessment history." },
      { status: 500 }
    );
  }
}
