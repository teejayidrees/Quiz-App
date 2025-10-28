"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminStatsProps {
  totalTests: number
  totalQuestions: number
  totalUsers?: number
}

export function AdminStats({ totalTests, totalQuestions, totalUsers = 0 }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">{totalTests}</div>
          <p className="text-xs text-gray-500 mt-1">Active tests</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{totalQuestions}</div>
          <p className="text-xs text-gray-500 mt-1">Across all tests</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{totalUsers}</div>
          <p className="text-xs text-gray-500 mt-1">Registered users</p>
        </CardContent>
      </Card>
    </div>
  )
}
