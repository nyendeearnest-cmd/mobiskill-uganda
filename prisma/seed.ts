import "dotenv/config";

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting MobiSkill Uganda seed...");

  // --------------------------------------------------
  // 1. GET SKILLS
  // --------------------------------------------------

  const computerBasics = await prisma.skill.findUnique({
    where: {
      name: "Computer Basics",
    },
  });

  const microsoftOffice = await prisma.skill.findUnique({
    where: {
      name: "Microsoft Office",
    },
  });

  if (!computerBasics || !microsoftOffice) {
    throw new Error(
      "Required skills not found. Run the skills seed first."
    );
  }

  // --------------------------------------------------
  // 2. COMPUTER BASICS COURSE
  // --------------------------------------------------

  const computerCourse = await prisma.course.upsert({
    where: {
      id: "course-computer-basics",
    },

    update: {
      title: "Computer Basics",
      description:
        "Learn the fundamentals of computers, operating systems, files, folders, internet use, and basic digital skills.",
      skillId: computerBasics.id,
      level: "Beginner",
      published: true,
    },

    create: {
      id: "course-computer-basics",
      title: "Computer Basics",
      description:
        "Learn the fundamentals of computers, operating systems, files, folders, internet use, and basic digital skills.",
      skillId: computerBasics.id,
      level: "Beginner",
      published: true,
    },
  });

  // Module 1
  const computerModule1 = await prisma.courseModule.upsert({
    where: {
      id: "module-computer-basics-1",
    },

    update: {
      title: "Introduction to Computers",
      description:
        "Understand what computers are and how they are used in everyday life.",
      courseId: computerCourse.id,
      order: 1,
    },

    create: {
      id: "module-computer-basics-1",
      title: "Introduction to Computers",
      description:
        "Understand what computers are and how they are used in everyday life.",
      courseId: computerCourse.id,
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: {
      id: "lesson-what-is-a-computer",
    },

    update: {
      title: "What Is a Computer?",
      content:
        "A computer is an electronic device that receives data, processes it, stores information, and produces useful output. Computers are used in education, business, communication, healthcare, banking, government, and many other areas.",
      moduleId: computerModule1.id,
      order: 1,
    },

    create: {
      id: "lesson-what-is-a-computer",
      title: "What Is a Computer?",
      content:
        "A computer is an electronic device that receives data, processes it, stores information, and produces useful output. Computers are used in education, business, communication, healthcare, banking, government, and many other areas.",
      moduleId: computerModule1.id,
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: {
      id: "lesson-computer-parts",
    },

    update: {
      title: "Main Parts of a Computer",
      content:
        "The major parts of a computer include the monitor, keyboard, mouse, system unit, processor, memory, and storage devices. Each part performs an important role in allowing the computer to operate.",
      moduleId: computerModule1.id,
      order: 2,
    },

    create: {
      id: "lesson-computer-parts",
      title: "Main Parts of a Computer",
      content:
        "The major parts of a computer include the monitor, keyboard, mouse, system unit, processor, memory, and storage devices. Each part performs an important role in allowing the computer to operate.",
      moduleId: computerModule1.id,
      order: 2,
    },
  });

  // Module 2
  const computerModule2 = await prisma.courseModule.upsert({
    where: {
      id: "module-computer-basics-2",
    },

    update: {
      title: "Files, Folders and Internet",
      description:
        "Learn how to organize files and folders and use the internet effectively.",
      courseId: computerCourse.id,
      order: 2,
    },

    create: {
      id: "module-computer-basics-2",
      title: "Files, Folders and Internet",
      description:
        "Learn how to organize files and folders and use the internet effectively.",
      courseId: computerCourse.id,
      order: 2,
    },
  });

  await prisma.lesson.upsert({
    where: {
      id: "lesson-files-and-folders",
    },

    update: {
      title: "Files and Folders",
      content:
        "Files contain information while folders help organize files. Good file management makes it easier to find, protect, and share information.",
      moduleId: computerModule2.id,
      order: 1,
    },

    create: {
      id: "lesson-files-and-folders",
      title: "Files and Folders",
      content:
        "Files contain information while folders help organize files. Good file management makes it easier to find, protect, and share information.",
      moduleId: computerModule2.id,
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: {
      id: "lesson-using-internet",
    },

    update: {
      title: "Using the Internet",
      content:
        "The internet connects computers and devices around the world. It can be used for communication, learning, research, online services, business, and accessing digital opportunities.",
      moduleId: computerModule2.id,
      order: 2,
    },

    create: {
      id: "lesson-using-internet",
      title: "Using the Internet",
      content:
        "The internet connects computers and devices around the world. It can be used for communication, learning, research, online services, business, and accessing digital opportunities.",
      moduleId: computerModule2.id,
      order: 2,
    },
  });

  // --------------------------------------------------
  // 3. MICROSOFT OFFICE COURSE
  // --------------------------------------------------

  const officeCourse = await prisma.course.upsert({
    where: {
      id: "course-microsoft-office",
    },

    update: {
      title: "Microsoft Office Fundamentals",
      description:
        "Learn the fundamentals of Microsoft Word, Excel, and PowerPoint for school, work, and business.",
      skillId: microsoftOffice.id,
      level: "Beginner",
      published: true,
    },

    create: {
      id: "course-microsoft-office",
      title: "Microsoft Office Fundamentals",
      description:
        "Learn the fundamentals of Microsoft Word, Excel, and PowerPoint for school, work, and business.",
      skillId: microsoftOffice.id,
      level: "Beginner",
      published: true,
    },
  });

  // Module 1
  const officeModule1 = await prisma.courseModule.upsert({
    where: {
      id: "module-office-1",
    },

    update: {
      title: "Microsoft Word",
      description:
        "Learn how to create and format professional documents.",
      courseId: officeCourse.id,
      order: 1,
    },

    create: {
      id: "module-office-1",
      title: "Microsoft Word",
      description:
        "Learn how to create and format professional documents.",
      courseId: officeCourse.id,
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: {
      id: "lesson-word-basics",
    },

    update: {
      title: "Word Basics",
      content:
        "Microsoft Word is a word-processing application used to create, edit, format, save, and print documents.",
      moduleId: officeModule1.id,
      order: 1,
    },

    create: {
      id: "lesson-word-basics",
      title: "Word Basics",
      content:
        "Microsoft Word is a word-processing application used to create, edit, format, save, and print documents.",
      moduleId: officeModule1.id,
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: {
      id: "lesson-word-formatting",
    },

    update: {
      title: "Document Formatting",
      content:
        "Document formatting includes changing fonts, font sizes, alignment, spacing, headings, lists, margins, and other visual properties of a document.",
      moduleId: officeModule1.id,
      order: 2,
    },

    create: {
      id: "lesson-word-formatting",
      title: "Document Formatting",
      content:
        "Document formatting includes changing fonts, font sizes, alignment, spacing, headings, lists, margins, and other visual properties of a document.",
      moduleId: officeModule1.id,
      order: 2,
    },
  });

  // Module 2
  const officeModule2 = await prisma.courseModule.upsert({
    where: {
      id: "module-office-2",
    },

    update: {
      title: "Microsoft Excel",
      description:
        "Learn the basics of spreadsheets, formulas, and data organization.",
      courseId: officeCourse.id,
      order: 2,
    },

    create: {
      id: "module-office-2",
      title: "Microsoft Excel",
      description:
        "Learn the basics of spreadsheets, formulas, and data organization.",
      courseId: officeCourse.id,
      order: 2,
    },
  });

  await prisma.lesson.upsert({
    where: {
      id: "lesson-excel-basics",
    },

    update: {
      title: "Excel Basics",
      content:
        "Microsoft Excel is a spreadsheet application used to organize, calculate, analyze, and visualize data.",
      moduleId: officeModule2.id,
      order: 1,
    },

    create: {
      id: "lesson-excel-basics",
      title: "Excel Basics",
      content:
        "Microsoft Excel is a spreadsheet application used to organize, calculate, analyze, and visualize data.",
      moduleId: officeModule2.id,
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: {
      id: "lesson-excel-formulas",
    },

    update: {
      title: "Basic Excel Formulas",
      content:
        "Excel formulas can perform calculations using values in cells. Common functions include SUM, AVERAGE, MIN, and MAX.",
      moduleId: officeModule2.id,
      order: 2,
    },

    create: {
      id: "lesson-excel-formulas",
      title: "Basic Excel Formulas",
      content:
        "Excel formulas can perform calculations using values in cells. Common functions include SUM, AVERAGE, MIN, and MAX.",
      moduleId: officeModule2.id,
      order: 2,
    },
  });

  // --------------------------------------------------
  // 4. FINISH
  // --------------------------------------------------

  console.log("✅ Courses seeded successfully.");
  console.log("📚 Computer Basics created.");
  console.log("📚 Microsoft Office Fundamentals created.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });