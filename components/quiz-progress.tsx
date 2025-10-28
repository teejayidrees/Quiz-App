"use client"

interface QuizProgressProps {
  currentQuestion: number
  totalQuestions: number
  answeredCount: number
}

export function QuizProgress({ currentQuestion, totalQuestions, answeredCount }: QuizProgressProps) {
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span className="text-gray-600">{answeredCount} answered</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
