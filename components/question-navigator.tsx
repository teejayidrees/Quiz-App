"use client"

interface QuestionNavigatorProps {
  totalQuestions: number
  currentQuestion: number
  answeredQuestions: (number | null)[]
  onSelectQuestion: (index: number) => void
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">Questions</h3>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(idx)}
            className={`w-8 h-8 rounded text-sm font-semibold transition-all ${
              currentQuestion === idx
                ? "bg-blue-600 text-white ring-2 ring-blue-400"
                : answeredQuestions[idx] !== null
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
