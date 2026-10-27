
import type { Opportunity } from "@/lib/mock/opportunities";

export type JobMatch = {
  opportunity: Opportunity;
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
};

export function matchJobsToSkills(
  learnerSkills: string[],
  availableOpportunities: Opportunity[]
): JobMatch[] {
  const normalizedLearnerSkills = new Set(
    learnerSkills.map((skill) => skill.trim().toLowerCase())
  );

  return availableOpportunities
    .map((opportunity) => {
      const requiredSkills = Array.isArray(opportunity.requiredSkills)
        ? opportunity.requiredSkills
        : [];

      const matchedSkills = requiredSkills.filter((skill) =>
        normalizedLearnerSkills.has(skill.trim().toLowerCase())
      );

      const missingSkills = requiredSkills.filter(
        (skill) =>
          !normalizedLearnerSkills.has(skill.trim().toLowerCase())
      );

      const matchPercentage =
        requiredSkills.length === 0
          ? 0
          : Math.round(
              (matchedSkills.length / requiredSkills.length) * 100
            );

      return {
        opportunity,
        matchedSkills,
        missingSkills,
        matchPercentage,
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}
