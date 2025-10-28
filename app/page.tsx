"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStoredToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      router.push("/dashboard");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);
  // ✅ Check for admin auth
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) router.push("/admin/dashboard");
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    ); // a loading spinner
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          MCA Quiz Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Test your knowledge with our comprehensive MCA entrance exam
          preparation
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Sign Up
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
          {/* <Link href="/admin/login">
            <Button size="lg" variant="outline">
              Admin
            </Button>
          </Link> */}
        </div>
      </div>
    </main>
  );
}
