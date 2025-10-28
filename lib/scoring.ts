export interface QuizResult {
  testId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  timeRemaining: number
  percentage: number
  isPassed: boolean
  timeBonus: number
  baseScore: number
}

export const calculateScore = (
  correctAnswers: number,
  totalQuestions: number,
  timeRemaining: number,
  totalDuration: number,
): QuizResult => {
  const baseScore = (correctAnswers / totalQuestions) * 100
  const timeBonus = Math.max(0, Math.floor((timeRemaining / (totalDuration * 60)) * 10))
  const finalScore = Math.min(100, baseScore + timeBonus)
  const isPassed = finalScore >= 60

  return {
    testId: "",
    score: finalScore,
    correctAnswers,
    totalQuestions,
    timeRemaining,
    percentage: finalScore,
    isPassed,
    timeBonus,
    baseScore,
  }
}

export const getScoreGrade = (percentage: number): { grade: string; color: string; message: string } => {
  if (percentage >= 90) {
    return { grade: "A+", color: "text-green-600", message: "Outstanding performance!" }
  }
  if (percentage >= 80) {
    return { grade: "A", color: "text-green-600", message: "Excellent work!" }
  }
  if (percentage >= 70) {
    return { grade: "B", color: "text-blue-600", message: "Good job!" }
  }
  if (percentage >= 60) {
    return { grade: "C", color: "text-yellow-600", message: "You passed!" }
  }
  return { grade: "F", color: "text-red-600", message: "Try again to improve your score." }
}
