"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(10); // in minutes
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Add new question field
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  // Handle quiz creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/create-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        duration,
        questions,
        isActive,
      }),
    });

    const data = await res.json();
    setLoading(false);
    router.push("/admin/dashboard");

    if (res.ok) {
      setMessage("✅ Quiz created successfully!");
      setTitle("");
      setDescription("");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ]);
    } else {
      setMessage(`❌ ${data.message || "Error creating quiz"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Create New Quiz</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="e.g. MCA General Test"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Short description..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2"
              min={1}
              placeholder="time duration"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label>Enable quiz</label>
          </div>

          {/* QUESTIONS SECTION */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Questions</h2>
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <label className="block mb-1 font-medium">
                  Question {idx + 1}
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[idx].question = e.target.value;
                    setQuestions(newQ);
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-3"
                  placeholder="Enter question"
                  required
                />

                {q.options.map((opt, optIdx) => (
                  <input
                    key={optIdx}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newQ = [...questions];
                      newQ[idx].options[optIdx] = e.target.value;
                      setQuestions(newQ);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                    placeholder={`Option ${optIdx + 1} or blank if none`}
                    required
                  />
                ))}

                <label className="block mt-2">Correct Answer:</label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[idx].correctAnswer = e.target.value;
                    setQuestions(newQ);
                  }}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required>
                  <option value="">Select correct option</option>
                  {q.options.map((opt, optIdx) => (
                    <option key={optIdx} value={opt}>
                      {opt || ` `}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              + Add Question
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
            {loading ? "Saving..." : "Create Quiz"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
