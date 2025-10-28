"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface QuestionCardProps {
  questionNumber: number
  totalQuestions: number
  questionText: string
  options: string[]
  selectedAnswer: number | null
  onAnswerSelect: (index: number) => void
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedAnswer,
  onAnswerSelect,
}: QuestionCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">{questionText}</CardTitle>
            <span className="text-sm text-gray-500">
              {questionNumber} of {totalQuestions}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onAnswerSelect(idx)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === idx ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === idx ? "border-blue-600 bg-blue-600" : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
