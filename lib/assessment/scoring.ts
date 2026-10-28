import type { AssessmentQuestion } from "@/lib/mock/assessmentQuestions";

export type SkillScore = {
  skillId: string;
  correct: number;
  total: number;
  percentage: number;
};

export type AssessmentScore = {
  correct: number;
  total: number;
  percentage: number;
  skillScores: SkillScore[];
};

export function calculateAssessmentScore(
  questions: AssessmentQuestion[],
  answers: Record<string, string>
): AssessmentScore {
  let correct = 0;

  const skillTotals: Record<string, number> = {};
  const skillCorrect: Record<string, number> = {};

  for (const question of questions) {
    const skillId = question.skillId;

    skillTotals[skillId] = (skillTotals[skillId] ?? 0) + 1;

    if (answers[question.id] === question.correctAnswer) {
      correct += 1;
      skillCorrect[skillId] = (skillCorrect[skillId] ?? 0) + 1;
    }
  }

  const total = questions.length;

  const percentage =
    total > 0 ? Math.round((correct / total) * 100) : 0;

  const skillScores: SkillScore[] = Object.entries(skillTotals).map(
    ([skillId, totalQuestions]) => {
      const skillCorrectAnswers = skillCorrect[skillId] ?? 0;

      return {
        skillId,
        correct: skillCorrectAnswers,
        total: totalQuestions,
        percentage:
          totalQuestions > 0
            ? Math.round((skillCorrectAnswers / totalQuestions) * 100)
            : 0,
      };
    }
  );

  return {
    correct,
    total,
    percentage,
    skillScores,
  };
}