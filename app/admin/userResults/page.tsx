"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";

interface Result {
  user: string;
  email: string;
  quiz: string;
  score: number;
  totalQuestions: number;
  date: string;
  userId: string;
  baseScore: number;
  quizId: string;
}

export default function AllResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function deleteUserQuizResult(userId: string, quizId: string) {
    try {
      const confirmed = confirm(
        "Are you sure you want to delete this test result?"
      );
      if (!confirmed) return;

      const res = await fetch(`/api/quiz/results/${userId}/${quizId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      alert(data.message);
      location.reload();
    } catch (err) {
      console.error("Error deleting result:", err);
      alert(`Failed to delete test result.${err}`);
    }
  }
  async function deleteUser(id: string) {
    try {
      if (!confirm("Are you sure you want to delete this User?")) return;
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      alert(data.message); // "User deleted successfully"
      location.reload();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Something went wrong while deleting the user.");
    }
  }

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/quiz/results"); // adjust if needed
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setResults(data);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const grouped = results.reduce((acc, result) => {
    if (!acc[result.userId]) acc[result.userId] = [];
    acc[result.userId].push(result);
    return acc;
  }, {} as Record<string, Result[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading all results...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        <Link className="flex " href={"/admin/dashboard"}>
          <ArrowBigLeft /> Go Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          All Quiz Results
        </h1>

        {Object.entries(grouped).map(([userId, userResults]) => {
          const { user, email } = userResults[0];
          return (
            <Card key={userId} className="mb-6 shadow-sm">
              <CardContent className="p-4">
                <div className="mb-4 flex gap-5">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {user}
                    </h2>
                    <p className="text-sm text-gray-600">{email}</p>
                  </div>
                  <Button
                    onClick={() => deleteUser(userId)}
                    className="bg-red-600 hover:bg-blue-700 hover:cursor-pointer"
                    size={"sm"}>
                    Delete User
                  </Button>
                </div>

                <div className="space-y-3">
                  {userResults.map((res, idx) => {
                    const isPassed = res.score >= 60;
                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-b pb-3">
                        <div>
                          <span className="font-medium text-gray-700">
                            Test Name:
                          </span>
                          <p>{res.quiz}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Score:
                          </span>
                          <p
                            className={
                              isPassed ? "text-green-600" : "text-red-500"
                            }>
                            {res.baseScore} /{res.totalQuestions}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Questions:
                          </span>
                          <p>{res.totalQuestions}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Point:
                          </span>
                          <p>{res.score}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Date:
                          </span>
                          <p>{format(new Date(res.date), "PPP p")}</p>
                        </div>
                        <div>
                          <Button
                            onClick={() =>
                              deleteUserQuizResult(res.userId, res.quizId)
                            }
                            className="bg-red-400 hover:bg-blue-700 hover:cursor-pointer"
                            size={"sm"}>
                            Delete Test
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="text-center mt-8">
          <Button
            onClick={() => location.reload()}
            className="bg-blue-600 hover:bg-blue-700">
            Refresh
          </Button>
        </div>
      </div>
    </main>
  );
}
