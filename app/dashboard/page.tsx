"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthGuard } from "@/components/auth-guard";
import { getStoredToken, decodeToken, clearStoredToken } from "@/lib/auth";

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
  questions: { question: string; options: string[]; correctAnswer: string }[];
}

function DashboardContent() {
  const router = useRouter();
  const token = getStoredToken();
  const decodedUser = token ? decodeToken(token) : null;
  const [user] = useState(decodedUser);

  const [tests, setTests] = useState<Test[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("/api/quiz/list");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setTests(data);
      } catch (err) {
        console.error("Error fetching tests:", err);
      } finally {
        setLoadingTests(false);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    const fetchUserResults = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/quiz/results/${user.id}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setUserResults(data);
      } catch (error) {
        console.error("Error fetching user results:", error);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchUserResults();
  }, [user]);

  const handleLogout = () => {
    clearStoredToken();
    router.push("/");
  };

  const handleResult = () => {
    router.push(`/results/${user?.id}`);
  };

  const hasTaken = (testId: string) => {
    return userResults.some((r) => r.quizId === testId);
  };

  const isLoading = loadingTests || loadingResults;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-600 mt-2">Select a test to begin</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleLogout} size={"sm"} variant="destructive">
              Logout
            </Button>
            <Button onClick={handleResult} variant="outline" size={"sm"}>
              View Results
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests
            .filter((test) => test.isActive)
            .map((test) => {
              const taken = hasTaken(test._id);

              return (
                <Card
                  key={test._id}
                  className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold">
                          {test.duration} minutes
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Questions:</span>
                        <span className="font-semibold">
                          {test.questions.length}
                        </span>
                      </div>
                    </div>

                    {taken ? (
                      <Button
                        disabled
                        className="w-full bg-gray-400 cursor-not-allowed">
                        Test Already Taken
                      </Button>
                    ) : (
                      <Link href={`/quiz/${test._id}`}>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={isLoading}>
                          {isLoading ? "Loading..." : "Start Test"}
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
