
import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in your .env file.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const assessmentQuestions = [
  {
    question: "What is digital literacy?",
    options: [
      "The ability to use digital devices and technologies effectively",
      "The ability to repair every computer component",
      "The ability to write computer programs only",
      "The ability to use the internet without security precautions",
    ],
    correctAnswer:
      "The ability to use digital devices and technologies effectively",
    explanation:
      "Digital literacy involves using digital devices, applications, and online resources effectively, safely, and responsibly.",
  },
  {
    question: "Which of the following is an example of an operating system?",
    options: ["Microsoft Word", "Windows", "Google Chrome", "Microsoft Excel"],
    correctAnswer: "Windows",
    explanation:
      "Windows is an operating system that manages computer hardware, software, and system resources.",
  },
  {
    question: "Which application is primarily used to browse websites?",
    options: ["Google Chrome", "Microsoft Excel", "Calculator", "Notepad"],
    correctAnswer: "Google Chrome",
    explanation:
      "Google Chrome is a web browser used to access and view websites.",
  },
  {
    question: "What is the main purpose of a strong password?",
    options: [
      "To make a computer run faster",
      "To protect accounts from unauthorized access",
      "To increase internet speed",
      "To remove computer viruses automatically",
    ],
    correctAnswer: "To protect accounts from unauthorized access",
    explanation:
      "Strong, unique passwords make it harder for unauthorized people to access your accounts.",
  },
  {
    question: "What should you do if you receive a suspicious email asking for your password?",
    options: [
      "Reply with your password",
      "Click every link in the email",
      "Ignore the warning signs and follow its instructions",
      "Avoid clicking its links and report or verify the message through an official channel",
    ],
    correctAnswer:
      "Avoid clicking its links and report or verify the message through an official channel",
    explanation:
      "Suspicious messages may be phishing attempts designed to steal personal information or account credentials.",
  },
  {
    question: "Which application is most suitable for preparing a spreadsheet budget?",
    options: [
      "Microsoft Excel",
      "Microsoft PowerPoint",
      "Paint",
      "A media player",
    ],
    correctAnswer: "Microsoft Excel",
    explanation:
      "Spreadsheet applications such as Microsoft Excel organize numerical data and support calculations.",
  },
  {
    question: "What does cloud storage allow you to do?",
    options: [
      "Store files on remote servers and access them over a network",
      "Store files only on paper",
      "Prevent every possible data loss",
      "Use a computer without any storage",
    ],
    correctAnswer:
      "Store files on remote servers and access them over a network",
    explanation:
      "Cloud storage keeps files on remote servers so authorized users can access them through a network.",
  },
  {
    question: "Why should you back up important files?",
    options: [
      "To make files impossible to steal",
      "To help recover files if the originals are lost or damaged",
      "To guarantee unlimited internet access",
      "To remove the need for passwords",
    ],
    correctAnswer:
      "To help recover files if the originals are lost or damaged",
    explanation:
      "Backups help recover information after accidental deletion, device failure, or other data-loss events.",
  },
  {
    question: "Which action demonstrates responsible online communication?",
    options: [
      "Sharing other people's private information without permission",
      "Sending abusive messages to people who disagree with you",
      "Communicating respectfully and checking information before sharing it",
      "Forwarding every message without checking its accuracy",
    ],
    correctAnswer:
      "Communicating respectfully and checking information before sharing it",
    explanation:
      "Responsible digital communication respects others and avoids spreading misleading or harmful information.",
  },
  {
    question: "What should you do before downloading an unfamiliar application?",
    options: [
      "Disable all security protections",
      "Check the source, permissions, and legitimacy of the application",
      "Share your account password with the publisher",
      "Install it from any random link",
    ],
    correctAnswer:
      "Check the source, permissions, and legitimacy of the application",
    explanation:
      "Checking the source and requested permissions reduces the risk of installing malicious or unsafe software.",
  },
];

async function main() {
  console.log("Starting Digital Literacy assessment seed...");

  // Find the existing skill without creating a duplicate.
  const skill = await prisma.skill.findFirst({
    where: {
      name: {
        equals: "digital literacy",
        mode: "insensitive",
      },
    },
  });

  if (!skill) {
    const existingSkills = await prisma.skill.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });

    console.error(
      "The existing 'digital literacy' skill was not found. No assessment was seeded."
    );
    console.error(
      "Available skill names:",
      existingSkills.map((item) => item.name)
    );

    throw new Error(
      "Check the displayed skill names before running this seed again."
    );
  }

  // Create or update one assessment, rather than creating duplicates.
  const assessment = await prisma.assessment.upsert({
    where: {
      id: "assessment-digital-literacy-fundamentals",
    },
    update: {
      title: "Digital Literacy Fundamentals",
      description:
        "Test your understanding of computer basics, internet use, cybersecurity, cloud storage, and responsible digital communication.",
      skillId: skill.id,
      published: true,
    },
    create: {
      id: "assessment-digital-literacy-fundamentals",
      title: "Digital Literacy Fundamentals",
      description:
        "Test your understanding of computer basics, internet use, cybersecurity, cloud storage, and responsible digital communication.",
      skillId: skill.id,
      published: true,
    },
  });

  // Upsert each question by its unique assessment-and-order pair.
  for (let index = 0; index < assessmentQuestions.length; index++) {
    const item = assessmentQuestions[index];
    const order = index + 1;

    await prisma.assessmentQuestion.upsert({
      where: {
        assessmentId_order: {
          assessmentId: assessment.id,
          order,
        },
      },
      update: {
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
      },
      create: {
        assessmentId: assessment.id,
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        order,
      },
    });
  }

  console.log("Assessment seeded successfully.");
  console.log(`Assessment: ${assessment.title}`);
  console.log(`Linked skill: ${skill.name}`);
  console.log(`Questions: ${assessmentQuestions.length}`);
}

main()
  .catch((error) => {
    console.error("Assessment seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
