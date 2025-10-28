"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthGuard } from "@/components/auth-guard";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface UserResult {
  user: string;
  email: string;
  quiz: string;
  score: number;
  totalQuestions: number;
  date: string;
  userId: string;
  baseScore: number;
  timeRemaining: number;
  userName: string;
}

function ResultsContent() {
  const router = useRouter();
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const userId = params.userId;
  useEffect(() => {
    const fetchUserResults = async () => {
      try {
        const res = await fetch(`/api/quiz/results/${userId}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setResults(data);
        }
      } catch (error) {
        console.error("Error fetching user results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserResults();
  }, [userId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 mb-4">
              No quiz results found
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700">
          <ArrowLeft /> Back
        </Button>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Quiz Results
          </h1>
          <p className="text-gray-600">
            Review your performance across all tests
          </p>
        </div>

        <div className="space-y-4">
          {results.map((res, index) => {
            const isPassed = res.score >= 70;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {res.quiz}
                    </h2>
                    <span
                      className={`text-sm font-medium ${
                        isPassed ? "text-green-600" : "text-red-500"
                      }`}>
                      {isPassed ? "Very Good" : "Poor Performance"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                    <div>
                      <span className="block font-medium">
                        Correct Answers:
                      </span>
                      <span>{res.baseScore}</span>
                    </div>
                    <div>
                      <span className="block font-medium">
                        Total Questions:
                      </span>
                      <span>{res.totalQuestions}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Date:</span>
                      <span>{format(new Date(res.date), "PPP p")}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Name:</span>
                      <span>{res.userName}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Point:</span>
                      <span>{res.score}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Time Remaining:</span>
                      <span>{res.timeRemaining}s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <AuthGuard>
      <ResultsContent />
    </AuthGuard>
  );
}
