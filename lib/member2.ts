
export type Recommendation = {
  id: string;
  category: string;
  title: string;
  description: string;
  reason: string;
  duration: string;
  level: string;
};

export type LearningStep = {
  id: string;
  title: string;
  type: "Course" | "Lesson" | "Challenge";
  duration: string;
  completed: boolean;
};

export type PracticalChallenge = {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  description: string;
  skills: string[];
  instructions: string[];
  deliverable: string;
};

export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    category: "Skill to develop",
    title: "Digital productivity",
    description:
      "Learn to organize files, work with documents, and use spreadsheets effectively.",
    reason: "A useful foundation for study, office work, and online opportunities.",
    duration: "2 weeks",
    level: "Beginner",
  },
  {
    id: "rec-2",
    category: "Course recommendation",
    title: "Introduction to Web Development",
    description:
      "Explore how websites are structured and build your first simple webpage.",
    reason: "Builds practical skills you can demonstrate in a portfolio.",
    duration: "4 weeks",
    level: "Beginner",
  },
  {
    id: "rec-3",
    category: "Practice recommendation",
    title: "Create a personal portfolio",
    description:
      "Present your skills, projects, and contact information on a simple webpage.",
    reason: "A portfolio can help you demonstrate your abilities to others.",
    duration: "3–5 hours",
    level: "Beginner",
  },
];

export const learningSteps: LearningStep[] = [
  {
    id: "step-1",
    title: "Understand digital tools and file management",
    type: "Course",
    duration: "30 min",
    completed: true,
  },
  {
    id: "step-2",
    title: "Practice documents and spreadsheets",
    type: "Lesson",
    duration: "45 min",
    completed: true,
  },
  {
    id: "step-3",
    title: "Learn the basics of HTML",
    type: "Course",
    duration: "1 hour",
    completed: false,
  },
  {
    id: "step-4",
    title: "Build a simple personal webpage",
    type: "Challenge",
    duration: "2 hours",
    completed: false,
  },
];

export const challenges: PracticalChallenge[] = [
  {
    id: "personal-portfolio",
    title: "Build a Personal Portfolio",
    category: "Web Development",
    difficulty: "Beginner",
    duration: "2 hours",
    description:
      "Create a simple webpage that introduces you and showcases your skills and projects.",
    skills: ["HTML basics", "Content organization", "Digital presentation"],
    instructions: [
      "Write a short introduction about yourself.",
      "Add at least three skills you are learning or already have.",
      "Show one project, school activity, or example of your work.",
      "Include a contact section without publishing private information.",
    ],
    deliverable:
      "Submit your HTML file or a link to your published webpage.",
  },
  {
    id: "spreadsheet-budget",
    title: "Create a Simple Budget",
    category: "Digital Productivity",
    difficulty: "Beginner",
    duration: "1 hour",
    description:
      "Use a spreadsheet to organize sample income and expenses and calculate a balance.",
    skills: ["Spreadsheets", "Basic formulas", "Data organization"],
    instructions: [
      "Create columns for item, income, and expense.",
      "Enter at least five fictional transactions.",
      "Use a formula to calculate the totals.",
      "Calculate the remaining balance and format the table clearly.",
    ],
    deliverable:
      "Submit your spreadsheet file or a screenshot that clearly shows the formulas and results.",
  },
  {
    id: "online-safety",
    title: "Spot the Suspicious Message",
    category: "Online Safety",
    difficulty: "Beginner",
    duration: "30 minutes",
    description:
      "Review a fictional message and explain how to identify possible phishing signs.",
    skills: ["Online safety", "Critical thinking", "Privacy awareness"],
    instructions: [
      "Identify at least three warning signs in the fictional message.",
      "Explain why each sign could be suspicious.",
      "Describe two safe actions the recipient should take.",
    ],
    deliverable: "Submit a short written explanation.",
  },
];
