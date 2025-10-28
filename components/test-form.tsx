"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TestFormProps {
  onSubmit: (data: { title: string; description: string; duration: number; totalQuestions: number }) => void
  isLoading?: boolean
}

export function TestForm({ onSubmit, isLoading = false }: TestFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    totalQuestions: 20,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description) return
    onSubmit(formData)
    setFormData({ title: "", description: "", duration: 30, totalQuestions: 20 })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Test title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Test description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <Input
                type="number"
                min="5"
                max="180"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Questions</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.totalQuestions}
                onChange={(e) => setFormData({ ...formData, totalQuestions: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Test"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
