import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET
 * Returns all available skills.
 */
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error("Skills GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load skills.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST
 * Creates a new skill.
 * Only authenticated users can create skills for now.
 */
export async function POST(request: Request) {
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

    const body = await request.json();

    const name = body.name?.trim();
    const description = body.description?.trim() || null;
    const category = body.category?.trim() || null;
    const level = body.level?.trim() || null;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill name is required.",
        },
        { status: 400 }
      );
    }

    const existingSkill = await prisma.skill.findUnique({
      where: {
        name,
      },
    });

    if (existingSkill) {
      return NextResponse.json(
        {
          success: false,
          message: "A skill with this name already exists.",
        },
        { status: 409 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        description,
        category,
        level,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Skill created successfully.",
        skill,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Skills POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create skill.",
      },
      { status: 500 }
    );
  }
}