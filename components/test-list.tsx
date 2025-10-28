"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizStatusToggle } from "./quizToggle";
interface Test {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;

  duration: number;
  questions: { question: string; options: string[]; correctAnswer: string }[];
}

interface TestListProps {
  tests: Test[];
  onDelete: (id: string) => void;
  onEdit?: (test: Test) => void;
}

export function TestList({ tests, onDelete, onEdit }: TestListProps) {
  if (!tests || tests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            No tests created yet. Create your first test to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <Card key={test._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{test.title}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                {/* {onEdit && (
                  <Button
                    onClick={() => onEdit(test)}
                    variant="outline"
                    size="sm">
                    Edit
                  </Button>
                )} */}
                <Button
                  onClick={() => onDelete(test._id)}
                  variant="destructive"
                  size="sm">
                  Delete
                </Button>
                <QuizStatusToggle id={test._id} initialStatus={test.isActive} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Duration:</span>
                <p className="font-semibold">{test.duration} min</p>
              </div>
              <div>
                <span className="text-gray-600">Questions:</span>
                <p className="font-semibold">{test.questions.length}</p>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <p className="font-semibold">Recently</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="font-semibold text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
