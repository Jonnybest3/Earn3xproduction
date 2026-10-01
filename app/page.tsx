
"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Task = {
    id: string;
    title: string;
    category: string | null;
    action_type: string | null;
    target_url: string | null;
    instructions: string | null;
    reward_per_worker: number;
    estimated_minutes: number | null;
    proof_required: boolean;
    is_active: boolean;
    status: string | null;
};

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [proof, setProof] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const money = (amount: number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(amount);

    async function loadTasks() {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
            .from("tasks")
            .select(
                "id,title,category,action_type,target_url,instructions,reward_per_worker,estimated_minutes,proof_required,is_active,status"
            )
            .eq("is_active", true)
            .eq("status", "active")
            .order("created_at", { ascending: false });

        if (error) {
            setError(error.message);
            setTasks([]);
        } else {
            setTasks((data ?? []) as Task[]);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadTasks();
    }, []);

    function openTask(task: Task) {
        setSelectedTask(task);
        setProof("");
        setMessage("");
        setError("");
    }

    function closeTask() {
        setSelectedTask(null);
        setProof("");
        setMessage("");
        setError("");
    }

    async function submitProof(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedTask) return;

        if (proof.trim().length < 5) {
            setError("Please enter your proof before submitting.");
            return;
        }

        setSubmitting(true);
        setError("");
        setMessage("");

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setError("Please sign in before submitting proof.");
            setSubmitting(false);
            return;
        }

        const { error } = await supabase
            .from("task_submissions")
            .insert({
                task_id: selectedTask.id,
                user_id: user.id,
                status: "pending",
                proof_text: proof.trim(),
                started_at: new Date().toISOString(),
            });

        if (error) {
            setError(error.message);
        } else {
            setMessage(
                "Proof submitted successfully. Your reward will only be credited after admin approval."
            );
            setProof("");
        }

        setSubmitting(false);
    }

    return (
        <main className="min-h-screen bg-[#06100c] text-white">
            <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06100c]/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                    <button
                        type="button"
                        onClick={closeTask}
                        className="text-2xl font-black"
                    >
                        Earn<span className="text-emerald-400">3X</span>
                    </button>

                    <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-400">
                        LIVE TASKS
                    </span>
                </div>
            </header>

            <section className="mx-auto max-w-6xl px-5 py-10">
                <div className="mb-10 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-7">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                        Earn3X Marketplace
                    </p>

                    <h1 className="mt-3 text-3xl font-black sm:text-5xl">
                        Complete real tasks.
                        <br />
                        <span className="text-emerald-400">
                            Earn after approval.
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-gray-400">
                        Available tasks are loaded directly from the Earn3X
                        database. Rewards are reviewed before they are credited.
                    </p>
                </div>

                {message && (
                    <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-300">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-red-300">
                        {error}
                    </div>
                )}

                {selectedTask ? (
                    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                        <button
                            type="button"
                            onClick={closeTask}
                            className="mb-6 text-sm text-gray-400"
                        >
                            ← Back to tasks
                        </button>

                        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase text-emerald-400">
                                    {selectedTask.category || "Task"}
                                </p>

                                <h2 className="mt-2 text-3xl font-black">
                                    {selectedTask.title}
                                </h2>

                                <p className="mt-3 text-gray-400">
                                    Action:{" "}
                                    {selectedTask.action_type || "Complete task"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-emerald-400 px-6 py-4 text-center text-black">
                                <div className="text-xs font-bold uppercase">
                                    Reward
                                </div>
                                <div className="text-2xl font-black">
                                    {money(selectedTask.reward_per_worker)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                            <h3 className="font-bold">Instructions</h3>

                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                                {selectedTask.instructions ||
                                    "Follow the administrator's instructions and complete the required action."}
                            </p>
                        </div>

                        <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.05] p-5">
                            <h3 className="font-bold text-yellow-300">
                                Step 1 — Complete the task
                            </h3>

                            {selectedTask.target_url ? (
                                <a
                                    href={selectedTask.target_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-black"
                                >
                                    Open Task Link ↗
                                </a>
                            ) : (
                                <p className="mt-3 text-sm text-gray-400">
                                    No external link was supplied for this task.
                                </p>
                            )}

                            <p className="mt-3 text-xs text-gray-500">
                                Perform the actual action before submitting proof.
                            </p>
                        </div>

                        <form
                            onSubmit={submitProof}
                            className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                        >
                            <h3 className="font-bold">
                                Step 2 — Submit proof
                            </h3>

                            <p className="mt-2 text-sm text-gray-400">
                                Enter your proof after completing the task.
                            </p>

                            <textarea
                                value={proof}
                                onChange={(event) =>
                                    setProof(event.target.value)
                                }
                                placeholder="Enter proof details here..."
                                className="mt-5 min-h-32 w-full rounded-xl border border-white/10 bg-black/30 p-4 text-white outline-none placeholder:text-gray-600 focus:border-emerald-400"
                            />

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-4 w-full rounded-xl bg-emerald-400 py-4 font-black text-black disabled:opacity-50"
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Proof for Review"}
                            </button>

                            <p className="mt-3 text-center text-xs text-gray-500">
                                Rewards are credited only after admin approval.
                            </p>
                        </form>
                    </section>
                ) : (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black">
                                    Available Tasks
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Live tasks supplied by admin
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={loadTasks}
                                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold"
                            >
                                Refresh
                            </button>
                        </div>

                        {loading ? (
                            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-gray-400">
                                Loading live tasks...
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
                                <div className="text-4xl">📋</div>
                                <h3 className="mt-4 text-xl font-bold">
                                    No tasks available right now
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    New tasks will appear when an admin publishes them.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2">
                                {tasks.map((task) => (
                                    <article
                                        key={task.id}
                                        className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <span className="text-xs font-bold uppercase text-emerald-400">
                                                    {task.category || "Task"}
                                                </span>

                                                <h3 className="mt-2 text-xl font-black">
                                                    {task.title}
                                                </h3>
                                            </div>

                                            <div className="rounded-xl bg-emerald-400/10 px-3 py-2 text-right">
                                                <div className="text-xs text-emerald-300">
                                                    Reward
                                                </div>

                                                <div className="font-black text-emerald-400">
                                                    {money(task.reward_per_worker)}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-sm leading-6 text-gray-400">
                                            {task.instructions ||
                                                "Complete the administrator's instructions and submit proof."}
                                        </p>

                                        <div className="mt-5 flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {task.action_type || "Task"}
                                                {task.estimated_minutes
                                                    ? ` • ${task.estimated_minutes} min`
                                                    : ""}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => openTask(task)}
                                                className="rounded-xl bg-emerald-400 px-5 py-3 font-bold text-black"
                                            >
                                                View Task
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>

            <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-gray-600">
                © 2026 Earn3X · Live worker task platform · Nigeria
            </footer>
        </main>
    );
}
