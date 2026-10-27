export type Opportunity = {
  id: string;
  title: string;
  businessName: string;
  description: string;
  type: string;
  location: string;
  payment?: string;
  deadline: string;
  requiredSkills: string[];
};

export const opportunities: Opportunity[] = [
  {
    id: "opp-001",
    title: "Junior Web Developer",
    businessName: "Kampala Digital Solutions",
    description:
      "A practical internship opportunity for learners who want to gain experience in building and maintaining websites.",
    type: "Internship",
    location: "Kampala",
    payment: "Allowance available",
    deadline: "2026-10-20",
    requiredSkills: ["HTML", "CSS", "JavaScript"],
  },
];
