
import { NextResponse } from "next/server";
import { mockAssessmentQuestions } from "@/lib/mock/assessmentQuestions";
import { calculateAssessmentScore } from "@/lib/assessment/scoring";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("answers" in body) ||
      typeof body.answers !== "object" ||
      body.answers === null ||
      Array.isArray(body.answers)
    ) {
      return NextResponse.json(
        { error: "Please submit valid assessment answers." },
        { status: 400 }
      );
    }

    const answers = body.answers as Record<string, unknown>;
    const questions = mockAssessmentQuestions;
    const expectedIds = questions.map((question) => question.id);

    if (
      Object.keys(answers).length !== expectedIds.length ||
      !expectedIds.every((id) => Object.hasOwn(answers, id))
    ) {
      return NextResponse.json(
        { error: "Please answer every question before submitting." },
        { status: 400 }
      );
    }

    for (const question of questions) {
      const answer = answers[question.id];

      if (
        typeof answer !== "string" ||
        !question.options.includes(answer)
      ) {
        return NextResponse.json(
          { error: "One or more submitted answers are invalid." },
          { status: 400 }
        );
      }
    }

    const score = calculateAssessmentScore(
      questions,
      answers as Record<string, string>
    );

    return NextResponse.json({ score });
  } catch (error) {
    console.error("Assessment submission failed:", error);

    return NextResponse.json(
      { error: "We couldn't process your assessment. Please try again." },
      { status: 500 }
    );
  }
}
