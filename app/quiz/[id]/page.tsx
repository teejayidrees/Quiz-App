"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/question-card";
import { QuizProgress } from "@/components/quiz-progress";
import { QuestionNavigator } from "@/components/question-navigator";
import { AuthGuard } from "@/components/auth-guard";
import { decodeToken, getStoredToken } from "@/lib/auth";
import { ArrowBigLeft } from "lucide-react";
import { Timer } from "@/components/Timer";

type RawQuestion = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string; // stored as option string
  points?: number;
};

type QuizPayload = {
  _id: string;
  title: string;
  description?: string;
  duration: number; // minutes
  questions: RawQuestion[];
  active?: boolean;
};

type AnswerState = (number | null)[];

export default function QuizPageClient() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.id as string;

  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [loading, setLoading] = useState(true);

  // core quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // user
  const [user, setUser] = useState<{
    id: string;
    name?: string;
  } | null>(null);

  // timer ref
  const intervalRef = useRef<number | null>(null);

  // load user token once
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      const decoded = decodeToken(token) as any;
      if (decoded && decoded.id)
        setUser({ id: decoded.id, name: decoded.name });
    }
  }, []);

  // fetch quiz
  useEffect(() => {
    if (!testId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/quiz/${testId}`);
        if (!res.ok) {
          router.push("/quiz-unavailable");
          return;
        }
        const data = await res.json();
        // server might return { quiz } or raw quiz — handle both
        const q: QuizPayload = data.quiz ?? data;

        if (!q || q.active === false) {
          router.push("/quiz-unavailable");
          return;
        }

        // initialize state
        setQuiz(q);
        setCurrentQuestion(0);
        setAnswers(new Array(q.questions.length).fill(null));
        setTimeRemaining(q.duration * 60);
        setIsSubmitted(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        router.push("/quiz-unavailable");
      } finally {
        setLoading(false);
      }
    })();
  }, [testId, router]);

  // core timer effect — starts when quiz loaded and intro dismissed and not submitted
  useEffect(() => {
    // don't start until quiz exists and intro closed and not submitted
    if (!quiz || showIntro || isSubmitted) return;

    // clear any existing interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // time up — auto submit
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          void submitQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, showIntro, isSubmitted]);

  // prevent refresh / tab switch: auto submit on visibility change and beforeunload
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== "visible" && !isSubmitted && quiz) {
        // auto-submit immediately when user switches tabs
        alert("you left the tab, it has auto submitted!!");
        void submitQuiz(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted && quiz) {
        // auto-submit synchronously is not reliable — but we warn and allow browser prompt.
        e.preventDefault();
        e.returnValue = "Leaving will submit your test.";
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      // Block Ctrl/Cmd+R and F5
      if (
        e.key === "F5" ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r")
      ) {
        e.preventDefault();
        if (!isSubmitted && quiz) void submitQuiz(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("keydown", handleKey);

    // also prevent back navigation from popstate — submit then re-push
    const onPopState = () => {
      if (!isSubmitted && quiz) {
        void submitQuiz(true);
        history.pushState(null, document.title); // try to keep user here
      }
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("popstate", onPopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, quiz]);

  // answer selection
  const onSelectAnswer = (optionIndex: number) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = optionIndex;
      return copy;
    });
  };

  const gotoNext = () => {
    setCurrentQuestion((prev) =>
      Math.min(quiz!.questions.length - 1, prev + 1)
    );
  };
  const gotoPrevious = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };
  const gotoQuestion = (index: number) => {
    setCurrentQuestion(
      Math.max(0, Math.min(index, quiz!.questions.length - 1))
    );
  };

  // robust score calculation and submit
  const submitQuiz = useCallback(
    async (auto = false) => {
      if (!quiz || isSubmitted || submitting) return;
      // if not auto and user confirmation desired
      if (!auto) {
        const ok = confirm("Are you sure you want to submit your test?");
        if (!ok) return;
      }

      setSubmitting(true);

      // calculate score
      // Each question may have .points (default 1)
      let correctCount = 0;
      let baseScore = 0;
      let possiblePoints = 0;
      const selectedAnswers: (string | null)[] = [];
      for (let i = 0; i < quiz.questions.length; i++) {
        //for each question, let q = question
        const q = quiz.questions[i];
        const pts = 1;
        // typeof (q as any).points === "number" ? (q as any).points : 1;
        possiblePoints += pts;
        const selectedIdx = answers[i];
        const selectedText =
          selectedIdx !== null ? q.options[selectedIdx] : null;
        selectedAnswers.push(selectedText);
        const correctIdx = q.options.indexOf(q.correctAnswer);
        if (selectedIdx !== null && selectedIdx === correctIdx) {
          correctCount++;
          baseScore += pts;
        }
      }

      // time bonus: proportional to remaining seconds; adjust multiplier as needed
      // Use: timeBonus = round(remainingSeconds * 0.1)
      // const timeBonus = Math.round(Math.max(0, timeRemaining) * 0.1);
      // // const totalScore = baseScore + timeBonus;
      // const normalizedScore = (baseScore / possiblePoints) * 100 + timeBonus;
      // const finalScore = Math.min(100, normalizedScore);
      // Build payload for server
      const payload = {
        userId: user?.id ?? null, //good
        quizId: quiz._id, //good
        answers: selectedAnswers, //good
        baseScore: correctCount,
        totalQuestions: quiz.questions.length, //good
        timeRemaining: timeRemaining,
      };
      try {
        // backend endpoint (adjust if your backend expects different route)
        console.log(payload);
        const res = await fetch(`/api/quiz/${testId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setIsSubmitted(true);
        // stop timer
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // navigate to results page (if you want user-specific results)
        // if user exists redirect to results page by user id or server-returned result id
        router.push(`/results/${user?.id}`);
      } catch (err) {
        console.error("Error submitting quiz:", err);
        alert("There was an error submitting your test. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [answers, isSubmitted, quiz, timeRemaining, user, submitting, router]
  );

  // UI states
  if (loading || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <Button
            className="mb-3"
            onClick={() => router.push("/")}
            variant="outline">
            <ArrowBigLeft /> Back
          </Button>
          <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
          <p className="text-gray-700 mb-2">{quiz.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Duration: {quiz.duration} mins • Questions: {quiz.questions.length}
          </p>
          <p className="text-red-600 text-lg mb-4">
            ⚠️ This test is monitored. Switching tabs or minimizing or
            refreshing will auto-submit.
          </p>
          <p className="text-green-600 text-sm mb-4">
            If You arent Ready to start, kindly Click on the back button
          </p>
          <Button
            onClick={() => setShowIntro(false)}
            className="w-full bg-blue-600 hover:bg-blue-700">
            Start Quiz
          </Button>
        </div>
      </div>
    );
  }

  // main quiz UI
  const currentQ = quiz.questions[currentQuestion];
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <Timer
            timeRemaining={timeRemaining}
            totalTime={quiz.duration * 60}
            onTimeUp={() => submitQuiz(true)}
          />
        </div>

        <QuizProgress
          currentQuestion={currentQuestion}
          totalQuestions={quiz.questions.length}
          answeredCount={answeredCount}
        />

        {/* Navigator always visible */}
        <QuestionNavigator
          totalQuestions={quiz.questions.length}
          currentQuestion={currentQuestion}
          answeredQuestions={answers}
          onSelectQuestion={(i) => gotoQuestion(i)}
        />

        <QuestionCard
          questionNumber={currentQuestion + 1}
          totalQuestions={quiz.questions.length}
          questionText={currentQ.question}
          options={currentQ.options}
          selectedAnswer={answers[currentQuestion]}
          onAnswerSelect={onSelectAnswer}
        />

        <div className="flex justify-between gap-4 mt-6">
          <Button
            onClick={gotoPrevious}
            disabled={currentQuestion === 0}
            variant="outline">
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={() => submitQuiz(false)}
                className="bg-green-600 hover:bg-green-700"
                disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button
                onClick={gotoNext}
                className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Wrap with AuthGuard in the page entry (or export default wrapped component)
export function QuizPage() {
  return (
    <AuthGuard>
      <QuizPageClient />
    </AuthGuard>
  );
}
