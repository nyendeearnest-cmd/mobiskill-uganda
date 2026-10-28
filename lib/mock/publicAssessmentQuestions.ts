export type PublicAssessmentQuestion = {
  id: string;
  question: string;
  options: string[];
  skillId: string;
  difficulty: "beginner" | "intermediate";
};

export const publicAssessmentQuestions: PublicAssessmentQuestion[] = [
  {
    id: "q1",
    question: "Which of the following is an example of a strong password?",
    options: ["password123", "john2000", "Uganda123", "T9!kP#42zL"],
    skillId: "online-safety",
    difficulty: "beginner",
  },
  {
    id: "q2",
    question: "What is the main purpose of a web browser?",
    options: [
      "To create computer hardware",
      "To access and view websites",
      "To protect a computer from electricity",
      "To replace an operating system",
    ],
    skillId: "digital-literacy",
    difficulty: "beginner",
  },
  {
    id: "q3",
    question: "Which HTML element is commonly used to create a main heading?",
    options: ["<p>", "<h1>", "<img>", "<link>"],
    skillId: "web-development",
    difficulty: "beginner",
  },
  {
    id: "q4",
    question: "Which tool is most suitable for creating a simple spreadsheet?",
    options: [
      "Microsoft Excel",
      "Microsoft Paint",
      "A web browser",
      "A media player",
    ],
    skillId: "productivity",
    difficulty: "beginner",
  },
  {
    id: "q5",
    question:
      "What should you do if you receive a suspicious link from an unknown sender?",
    options: [
      "Click it immediately",
      "Forward it to everyone",
      "Avoid clicking it and verify the sender",
      "Enter your password to check it",
    ],
    skillId: "online-safety",
    difficulty: "beginner",
  },
  {
    id: "q6",
    question:
      "Which technology is primarily used to style the appearance of a web page?",
    options: ["HTML", "CSS", "SQL", "Python"],
    skillId: "web-development",
    difficulty: "beginner",
  },
  {
    id: "q7",
    question: "What is the purpose of saving a file to cloud storage?",
    options: [
      "To make the computer physically larger",
      "To store and access the file through an online service",
      "To permanently delete the file",
      "To turn the file into a printed document",
    ],
    skillId: "digital-literacy",
    difficulty: "beginner",
  },
  {
    id: "q8",
    question: "Which practice can help you manage tasks more effectively?",
    options: [
      "Ignoring deadlines",
      "Keeping all tasks only in your memory",
      "Using a task list and setting priorities",
      "Starting every task at the same time",
    ],
    skillId: "productivity",
    difficulty: "beginner",
  },
  {
    id: "q9",
    question:
      "Which HTML attribute is used to provide alternative text for an image?",
    options: ["src", "href", "alt", "class"],
    skillId: "web-development",
    difficulty: "intermediate",
  },
  {
    id: "q10",
    question: "What is two-factor authentication mainly used for?",
    options: [
      "Making websites load faster",
      "Adding an extra layer of account security",
      "Increasing screen brightness",
      "Creating stronger internet signals",
    ],
    skillId: "online-safety",
    difficulty: "beginner",
  },
];
