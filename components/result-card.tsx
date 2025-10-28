"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getScoreGrade } from "@/lib/scoring"

interface ResultCardProps {
  percentage: number
  correctAnswers: number
  totalQuestions: number
  timeBonus: number
  baseScore: number
}

export function ResultCard({ percentage, correctAnswers, totalQuestions, timeBonus, baseScore }: ResultCardProps) {
  const gradeInfo = getScoreGrade(percentage)

  return (
    <div className="space-y-4">
      {/* Grade Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Your Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-6xl font-bold ${gradeInfo.color} mb-2`}>{gradeInfo.grade}</div>
            <p className={`text-lg font-semibold ${gradeInfo.color}`}>{gradeInfo.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Correct Answers</span>
              <span className="font-semibold text-lg">
                {correctAnswers}/{totalQuestions}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-semibold text-lg">{Math.round((correctAnswers / totalQuestions) * 100)}%</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Base Score</span>
              <span className="font-semibold text-lg">{Math.round(baseScore)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time Bonus</span>
              <span className="font-semibold text-lg text-green-600">+{timeBonus}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Correct</span>
                <span className="font-semibold">{correctAnswers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Incorrect</span>
                <span className="font-semibold">{totalQuestions - correctAnswers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${((totalQuestions - correctAnswers) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
