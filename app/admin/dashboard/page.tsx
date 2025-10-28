"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TestList } from "@/components/test-list";
import { AdminStats } from "@/components/admin-stats";
import { clearStoredAdminToken } from "@/lib/auth";

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;

  questions: { question: string; options: string[]; correctAnswer: string }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false); // re-fetch trigger
  const [users, setUsers] = useState<any[]>([]);
  // ✅ Check for admin auth

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) router.push("/admin/login");
  }, [router]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Fetch all quizzes
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/quiz/list");
        const data = await res.json();

        if (res.ok && Array.isArray(data)) setTests(data);
      } catch (err) {
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [refresh]);
  //toggle active

  // ✅ Delete quiz
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const res = await fetch(`/api/quiz/${id}`, { method: "DELETE" });

      if (res.ok) {
        alert("Quiz deleted successfully");
        setRefresh(!refresh); // refresh list
      } else {
        alert("Failed to delete quiz");
      }
    } catch (error) {
      alert("Error deleting quiz");
    }
  };

  //✅ Edit quiz redirect
  const handleEdit = (test: Test) => {
    router.push(`/admin/dashboard/edit-quiz/${test._id}`);
  };
  const handleAllResults = () => {
    router.push("/admin/userResults");
  };
  const handleLogout = () => {
    clearStoredAdminToken();
    router.push("/");
  };

  const totalQuestions = tests
    ? tests.reduce((sum, test) => sum + test.questions.length, 0)
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage tests and monitor platform activity
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>

            <Button onClick={handleAllResults} variant="default">
              View All Results
            </Button>
          </div>
        </div>

        {/* Stats */}
        <AdminStats
          totalTests={tests.length}
          totalQuestions={totalQuestions}
          totalUsers={users.length || 0}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-1">
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
              onClick={() => router.push("/admin/dashboard/create-quiz")}>
              ➕ Create Test
            </button>
          </div>

          {/* Tests List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Manage Tests
            </h2>
            {loading ? (
              <p className="text-center text-gray-500">Loading tests...</p>
            ) : (
              <TestList
                tests={tests}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
