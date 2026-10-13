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

    let profile = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        phone: profile.phone ?? "",
        location: profile.location ?? "",
        educationLevel: profile.educationLevel ?? "",
        bio: profile.bio ?? "",
        careerGoal: profile.careerGoal ?? "",
        availableTime: profile.availableTime ?? "",
        internetAccess: profile.internetAccess ?? "",
        deviceType: profile.deviceType ?? "",
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load profile.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const profile = await prisma.profile.upsert({
      where: {
        userId: user.id,
      },

      update: {
        phone: body.phone?.trim() || null,
        location: body.location?.trim() || null,
        educationLevel: body.educationLevel || null,
        bio: body.bio?.trim() || null,
        careerGoal: body.careerGoal?.trim() || null,
        availableTime: body.availableTime || null,
        internetAccess: body.internetAccess || null,
        deviceType: body.deviceType || null,
      },

      create: {
        userId: user.id,
        phone: body.phone?.trim() || null,
        location: body.location?.trim() || null,
        educationLevel: body.educationLevel || null,
        bio: body.bio?.trim() || null,
        careerGoal: body.careerGoal?.trim() || null,
        availableTime: body.availableTime || null,
        internetAccess: body.internetAccess || null,
        deviceType: body.deviceType || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: {
        name: user.name,
        email: user.email,
        phone: profile.phone ?? "",
        location: profile.location ?? "",
        educationLevel: profile.educationLevel ?? "",
        bio: profile.bio ?? "",
        careerGoal: profile.careerGoal ?? "",
        availableTime: profile.availableTime ?? "",
        internetAccess: profile.internetAccess ?? "",
        deviceType: profile.deviceType ?? "",
      },
    });
  } catch (error) {
    console.error("Profile PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile.",
      },
      { status: 500 }
    );
  }
}