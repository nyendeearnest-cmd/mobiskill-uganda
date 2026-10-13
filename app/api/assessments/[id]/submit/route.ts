
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id: assessmentId } = await context.params;

    const body = await request.json();
    const submittedAnswers = body.answers;

    if (
      !submittedAnswers ||
      typeof submittedAnswers !== "object" ||
      Array.isArray(submittedAnswers)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid answers submitted." },
        { status: 400 }
      );
    }

    const assessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, published: true },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!assessment || assessment.questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Assessment not found." },
        { status: 404 }
      );
    }

    if (
      Object.keys(submittedAnswers).length !== assessment.questions.length ||
      assessment.questions.some(
        (question) =>
          typeof submittedAnswers[question.id] !== "string" ||
          !(question.options as string[]).includes(
            submittedAnswers[question.id]
          )
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Answer every question using a valid option.",
        },
        { status: 400 }
      );
    }

    const correctAnswers = assessment.questions.filter(
      (question) =>
        submittedAnswers[question.id] === question.correctAnswer
    ).length;

    const totalQuestions = assessment.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const attempt = await prisma.$transaction(async (tx) => {
      const createdAttempt = await tx.assessmentAttempt.create({
        data: {
          userId: user.id,
          assessmentId: assessment.id,
          score,
          totalQuestions,
          correctAnswers,
          completedAt: new Date(),
          answers: {
            create: assessment.questions.map((question) => ({
              questionId: question.id,
              selectedAnswer: submittedAnswers[question.id],
              isCorrect:
                submittedAnswers[question.id] === question.correctAnswer,
            })),
          },
        },
      });

      return createdAttempt;
    });

    return NextResponse.json({
      success: true,
      result: {
        attemptId: attempt.id,
        assessmentId: assessment.id,
        title: assessment.title,
        score,
        totalQuestions,
        correctAnswers,
        incorrectAnswers: totalQuestions - correctAnswers,
        passed: score >= 50,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        { success: false, error: "Please sign in to submit an assessment." },
        { status: 401 }
      );
    }

    console.error("Assessment submission failed:", error);

    return NextResponse.json(
      { success: false, error: "Unable to submit assessment right now." },
      { status: 500 }
    );
  }
}
