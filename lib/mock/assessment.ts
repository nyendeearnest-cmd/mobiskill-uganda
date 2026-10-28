export type AssessmentSkill = {
  id: string;
  name: string;
  description: string;
};

export type AssessmentInfo = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  estimatedMinutes: number;
  skills: AssessmentSkill[];
};

export const mockAssessment: AssessmentInfo = {
  id: "digital-skills-baseline",
  title: "Digital Skills Assessment",
  description:
    "Discover your current digital skills, identify areas for improvement, and get personalized recommendations for what to learn next.",
  questionCount: 10,
  estimatedMinutes: 10,
  skills: [
    {
      id: "digital-literacy",
      name: "Digital Literacy",
      description:
        "Basic understanding of digital tools and technologies.",
    },
    {
      id: "web-development",
      name: "Web Development",
      description:
        "Foundational knowledge of websites and web technologies.",
    },
    {
      id: "productivity",
      name: "Digital Productivity",
      description:
        "Using digital tools effectively for everyday tasks and work.",
    },
    {
      id: "online-safety",
      name: "Online Safety",
      description:
        "Understanding safe and responsible use of digital services.",
    },
  ],
};