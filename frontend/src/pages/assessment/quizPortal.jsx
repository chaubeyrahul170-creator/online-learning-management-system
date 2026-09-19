import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Award, CheckCircle2, XCircle, RotateCcw,
  FileCheck2, Check, AlertCircle, HelpCircle, ArrowRight,
  BookOpen, ShieldCheck, Sparkles, ChevronRight
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';

const courseQuizzes = {
  1: {
    title: 'MERN Stack & REST Architecture Assessment',
    course: 'Full Stack Web Development (MERN)',
    durationSeconds: 600,
    questions: [
      {
        id: 1,
        question: 'Which Express.js middleware is required to parse incoming JSON payloads in POST request bodies?',
        options: ['express.static()', 'express.json()', 'express.urlencoded()', 'express.router()'],
        correct: 1,
        explanation: 'express.json() is a built-in middleware function in Express to parse incoming requests with JSON payloads.',
      },
      {
        id: 2,
        question: 'What is the primary role of JSON Web Tokens (JWT) in modern web applications?',
        options: ['Database Indexing', 'Stateless Client Authentication', 'Image Compression', 'CSS Preprocessing'],
        correct: 1,
        explanation: 'JWT provides stateless authentication, allowing the server to verify user identity without retaining session state in memory.',
      },
      {
        id: 3,
        question: 'Which HTTP method is specifically intended for partial updates to an existing resource in REST standards?',
        options: ['GET', 'POST', 'PATCH', 'PUT'],
        correct: 2,
        explanation: 'PATCH applies partial modifications to a resource, whereas PUT typically replaces the whole resource representation.',
      },
      {
        id: 4,
        question: 'In MongoDB, which aggregation pipeline stage is used to perform multi-collection joins similar to SQL JOIN?',
        options: ['$match', '$group', '$lookup', '$project'],
        correct: 2,
        explanation: '$lookup performs a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection.',
      },
      {
        id: 5,
        question: 'What is the purpose of bcrypt salt when hashing user passwords?',
        options: ['Compress the string length', 'Protect against rainbow table and brute-force attacks', 'Encrypt database connections', 'Speed up hash computation'],
        correct: 1,
        explanation: 'Salting introduces random data to password inputs before hashing, preventing rainbow table lookups and identical hashes for identical passwords.',
      },
    ],
  },
  2: {
    title: 'Binary Trees & Algorithmic Complexity Test',
    course: 'Data Structures & Algorithms in Java',
    durationSeconds: 600,
    questions: [
      {
        id: 1,
        question: 'In which tree traversal are the nodes visited in the order: Left Subtree, Root, Right Subtree?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correct: 1,
        explanation: 'In-order traversal visits Left Subtree -> Root -> Right Subtree. For Binary Search Trees, this yields keys in sorted order.',
      },
      {
        id: 2,
        question: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correct: 1,
        explanation: 'In a balanced BST with height log(n), each comparison eliminates half the remaining nodes, yielding O(log n) search time.',
      },
      {
        id: 3,
        question: 'What is the maximum number of nodes at level "L" (root is at level 0) in a binary tree?',
        options: ['2 * L', '2^L', '2^(L + 1)', 'L^2'],
        correct: 1,
        explanation: 'At level 0 there is 1 node (2^0), at level 1 there are 2 nodes (2^1), and at level L there are at most 2^L nodes.',
      },
      {
        id: 4,
        question: 'Which data structure is intrinsically utilized by recursive function calls to manage execution state?',
        options: ['Queue', 'Call Stack', 'Heap', 'Circular Buffer'],
        correct: 1,
        explanation: 'Recursive calls use the runtime Call Stack (LIFO) to store local variables, parameters, and return addresses for each activation frame.',
      },
      {
        id: 5,
        question: 'What is the height of a skewed binary tree containing "n" nodes in the worst case?',
        options: ['O(log n)', 'O(n)', 'O(1)', 'O(n^2)'],
        correct: 1,
        explanation: 'In a degenerate or skewed tree (like a linked list), every internal node has only one child, so tree height is O(n).',
      },
    ],
  },
  3: {
    title: 'Database Normalization & Indexing Assessment',
    course: 'Database Management Systems',
    durationSeconds: 600,
    questions: [
      {
        id: 1,
        question: 'Which normal form eliminates transitive functional dependencies on the primary key?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'BCNF'],
        correct: 2,
        explanation: 'Third Normal Form (3NF) requires 2NF and mandates that no non-prime attribute is transitively dependent on any candidate key.',
      },
      {
        id: 2,
        question: 'In relational databases, which ACID property ensures all operations in a transaction succeed or all roll back?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correct: 0,
        explanation: 'Atomicity guarantees that a transaction is treated as a single indivisible unit: either all statements execute or none do.',
      },
      {
        id: 3,
        question: 'Which index structure is most widely used by standard SQL and relational engines for range queries?',
        options: ['Hash Index', 'B+ Tree Index', 'Bitmap Index', 'Inverted Index'],
        correct: 1,
        explanation: 'B+ Trees store all keys in sorted leaf nodes linked sequentially, making them optimal for both equality and range scans.',
      },
      {
        id: 4,
        question: 'What is a "Dirty Read" concurrency anomaly in database transaction isolation levels?',
        options: ['Reading corrupted disk pages', 'Reading uncommitted modifications made by another concurrent transaction', 'Reading conflicting schema versions', 'Reading stale cache data'],
        correct: 1,
        explanation: 'A Dirty Read occurs when Transaction A reads data modified by Transaction B before Transaction B has been committed.',
      },
      {
        id: 5,
        question: 'Which SQL constraint guarantees that every value in a column must be unique and cannot be NULL?',
        options: ['UNIQUE', 'CHECK', 'PRIMARY KEY', 'FOREIGN KEY'],
        correct: 2,
        explanation: 'A PRIMARY KEY constraint uniquely identifies each record in a database table, enforcing uniqueness and rejecting NULLs.',
      },
    ],
  },
};

export default function QuizPortal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useLMS();

  const quizId = Number(id) || 1;
  const currentQuiz = courseQuizzes[quizId] || courseQuizzes[1];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(currentQuiz.durationSeconds || 600);

  // Live Timer Effect
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optIndex,
    });
  };

  const totalMarks = currentQuiz.questions.length * 10;

  const calculateScore = () => {
    let score = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score += 10;
      }
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / totalMarks) * 100);
  const isPassed = percentage >= 60;

  // Current student session
  const currentUser = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edulearn_user'));
      const u = stored?.user || stored;
      return {
        name: u?.name || 'Student',
        email: u?.email || 'student@edulearn.com',
      };
    } catch {
      return { name: 'Student', email: 'student@edulearn.com' };
    }
  })();

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    try {
      const storageKey = `edulearn_quiz_scores_${currentUser.email}`;
      const existing = JSON.parse(localStorage.getItem(storageKey)) || {};
      existing[quizId] = {
        score,
        totalMarks,
        percentage,
        isPassed,
        evaluatedAt: new Date().toLocaleDateString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (err) {
      console.log('Error saving quiz score:', err);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(currentQuiz.durationSeconds || 600);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/student-dashboard"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Institutional Assessment
          </span>
        </div>

        {/* ================= TEST IN PROGRESS ================= */}
        {!isSubmitted ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Title & Live Countdown Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {currentQuiz.course}
                </span>
                <h1 className="text-base font-black text-slate-900 mt-2">{currentQuiz.title}</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Question {currentQuestion + 1} of {currentQuiz.questions.length} · 10 Marks per question
                </p>
              </div>

              {/* Timer Box */}
              <div
                className={`px-4 py-2 rounded-2xl border flex items-center gap-2 text-xs font-mono font-bold shrink-0 ${
                  timeLeft < 120
                    ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Time Left: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress Bar (Question Pills) */}
            <div className="flex gap-2">
              {currentQuiz.questions.map((_, qIdx) => (
                <div
                  key={qIdx}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    currentQuestion === qIdx
                      ? 'bg-blue-600'
                      : selectedAnswers[qIdx] !== undefined
                      ? 'bg-emerald-500'
                      : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>

            {/* Question Box */}
            <div className="space-y-4 pt-2">
              <h2 className="text-sm font-bold text-slate-900 leading-relaxed">
                Q{currentQuestion + 1}. {currentQuiz.questions[currentQuestion].question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuiz.questions[currentQuestion].options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQuestion] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt}</span>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white font-bold'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Previous
              </button>

              {currentQuestion < currentQuiz.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  Next Question <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Submit Assessment
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ================= TEST RESULT SUMMARY ================= */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="text-center space-y-3">
              <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto border ${
                  isPassed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-rose-50 border-rose-200 text-rose-600'
                }`}
              >
                {isPassed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {isPassed ? 'Assessment Qualified!' : 'Assessment Completed'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your final score has been recorded on your learner profile.
                </p>
              </div>

              {/* Score Box */}
              <div className="max-w-xs mx-auto bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Computed Score
                </span>
                <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
                  {score} / {totalMarks}
                </div>
                <span
                  className={`text-xs font-bold block mt-1.5 ${
                    isPassed ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {percentage}% · {isPassed ? 'Passed' : 'Needs Improvement'}
                </span>
              </div>
            </div>

            {/* Answer Breakdown & Explanations */}
            <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Question Breakdown & Faculty Explanations
              </h3>

              {currentQuiz.questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correct;
                return (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        Q{idx + 1}. {q.question}
                      </span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct (+10)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-700 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect (0)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500">
                      Your answer:{' '}
                      <span className="font-semibold text-slate-800">
                        {userAns !== undefined ? q.options[userAns] : 'Unanswered'}
                      </span>
                    </p>

                    <p className="text-xs text-emerald-700 font-semibold">
                      Correct answer: <span>{q.options[q.correct]}</span>
                    </p>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800">Faculty Rationale:</span> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions at bottom */}
            <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleRetakeQuiz}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Test
              </button>
              <Link
                to="/student-dashboard"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                Return to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

