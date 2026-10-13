import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const userSkills = await prisma.userSkill.findMany({
      where: {
        userId: user.id,
      },
      include: {
        skill: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const skillsDeveloped = userSkills.length;

    const verifiedSkills = userSkills.filter(
      (userSkill) => userSkill.verified
    ).length;

    const scoredSkills = userSkills.filter(
      (userSkill) => userSkill.score !== null
    );

    const averageScore =
      scoredSkills.length > 0
        ? scoredSkills.reduce(
            (total, userSkill) => total + (userSkill.score ?? 0),
            0
          ) / scoredSkills.length
        : null;

    let averageSkillLevel = "—";

    if (averageScore !== null) {
      if (averageScore >= 80) {
        averageSkillLevel = "Advanced";
      } else if (averageScore >= 50) {
        averageSkillLevel = "Intermediate";
      } else {
        averageSkillLevel = "Beginner";
      }
    }

    return NextResponse.json({
      success: true,

      summary: {
        skillsDeveloped,
        verifiedSkills,
        averageScore,
        averageSkillLevel,
      },

      skills: userSkills.map((userSkill) => ({
        id: userSkill.id,
        skillId: userSkill.skillId,
        name: userSkill.skill.name,
        description: userSkill.skill.description ?? "",
        category: userSkill.skill.category ?? "",
        level: userSkill.level ?? "Not assessed",
        score: userSkill.score,
        verified: userSkill.verified,
      })),
    });
  } catch (error) {
    console.error("Skills profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load skills profile.",
      },
      { status: 500 }
    );
  }
}