import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Get logged-in learner
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

    const body = await request.json();

    const skillId = body.skillId?.trim();
    const level = body.level?.trim() || null;

    let score: number | null = null;

    if (body.score !== undefined && body.score !== null && body.score !== "") {
      score = Number(body.score);

      if (Number.isNaN(score)) {
        return NextResponse.json(
          {
            success: false,
            message: "Score must be a valid number.",
          },
          { status: 400 }
        );
      }

      if (score < 0 || score > 100) {
        return NextResponse.json(
          {
            success: false,
            message: "Score must be between 0 and 100.",
          },
          { status: 400 }
        );
      }
    }

    if (!skillId) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill ID is required.",
        },
        { status: 400 }
      );
    }

    // Confirm the skill exists
    const skill = await prisma.skill.findUnique({
      where: {
        id: skillId,
      },
    });

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill not found.",
        },
        { status: 404 }
      );
    }

    // Automatically determine whether the skill is verified.
    // For now, a score of 80 or above is considered verified.
    const verified = score !== null && score >= 80;

    // Create or update the learner's skill
    const userSkill = await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId,
        },
      },

      update: {
        level,
        score,
        verified,
      },

      create: {
        userId: user.id,
        skillId,
        level,
        score,
        verified,
      },

      include: {
        skill: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Skill added to your profile successfully.",
      skill: {
        id: userSkill.id,
        skillId: userSkill.skillId,
        name: userSkill.skill.name,
        description: userSkill.skill.description ?? "",
        category: userSkill.skill.category ?? "",
        level: userSkill.level ?? "Not assessed",
        score: userSkill.score,
        verified: userSkill.verified,
      },
    });
  } catch (error) {
    console.error("Assign skill error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add skill to profile.",
      },
      { status: 500 }
    );
  }
}