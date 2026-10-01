"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type Task = {
  id: number;
  task_title: string;
  category: string | null;
  action_type: string | null;
  target_url: string | null;
  instructions: string | null;
  reward_per_worker: number;
  status: string | null;
  is_active: boolean;
};

const supabase = createSupabaseBrowserClient();

export default function AdminPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Social Media");
  const [actionType, setActionType] = useState("like");
  const [targetUrl, setTargetUrl] = useState("");
  const [instructions, setInstructions] = useState("");
  const [reward, setReward] = useState("100");

  async function loadTasks() {
    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .select(
        "id,task_title,category,action_type,target_url,instructions,reward_per_worker,status,is_active"
      )
      .order("id", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setTasks((data || []) as Task[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const rewardNumber = Number(reward);

    if (!title.trim()) {
      setMessage("Enter a task title.");
      return;
    }

    if (!targetUrl.trim()) {
      setMessage("Enter the actual task URL.");
      return;
    }

    if (rewardNumber < 50 || rewardNumber > 130) {
      setMessage("Reward must be between ₦50 and ₦130.");
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      task_title: title.trim(),
      task_link: targetUrl.trim(),
      reward_per_worker: rewardNumber,
      status: "active",
      category,
      action_type: actionType,
      target_url: targetUrl.trim(),
      instructions: instructions.trim(),
      proof_required: true,
      is_active: true,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setTitle("");
    setTargetUrl("");
    setInstructions("");
    setReward("100");
    setMessage("Task published successfully.");
    await loadTasks();
  }

  async function toggleTask(task: Task) {
    const nextActive = !task.is_active;

    const { error } = await supabase
      .from("tasks")
      .update({
        is_active: nextActive,
        status: nextActive ? "active" : "paused",
      })
      .eq("id", task.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadTasks();
  }

  return (
    <main className="min-h-screen bg-[#020b08] text-white px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Earn3X Admin
            </p>
            <h1 className="mt-2 text-3xl font-black">Task Manager</h1>
            <p className="mt-1 text-sm text-slate-400">
              Create and control live worker tasks.
            </p>
          </div>

          <a
            href="/"
            className="rounded-xl border border-emerald-900 px-4 py-2 text-sm"
          >
            Worker View
          </a>
        </div>

        <section className="rounded-2xl border border-emerald-900/60 bg-[#071711] p-5">
          <h2 className="text-xl font-bold">Publish New Task</h2>

          <form onSubmit={createTask} className="mt-5 grid gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="rounded-xl border border-slate-700 bg-black/30 p-3 outline-none"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-slate-700 bg-black/30 p-3"
              >
                <option>Social Media</option>
                <option>YouTube</option>
                <option>Website</option>
                <option>Survey</option>
                <option>Data Entry</option>
                <option>Other</option>
              </select>

              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="rounded-xl border border-slate-700 bg-black/30 p-3"
              >
                <option value="like">Like</option>
                <option value="comment">Comment</option>
                <option value="follow">Follow</option>
                <option value="subscribe">Subscribe</option>
                <option value="share">Share / Repost</option>
                <option value="visit">Visit</option>
                <option value="watch">Watch</option>
                <option value="survey">Survey</option>
                <option value="data_entry">Data Entry</option>
                <option value="review">Review</option>
                <option value="other">Other</option>
              </select>
            </div>

            <input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Actual social media / website URL"
              type="url"
              className="rounded-xl border border-slate-700 bg-black/30 p-3 outline-none"
            />

            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Worker instructions: what exactly should they do?"
              rows={4}
              className="rounded-xl border border-slate-700 bg-black/30 p-3 outline-none"
            />

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Reward per approved task
              </label>
              <input
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                type="number"
                min="50"
                max="130"
                className="w-full rounded-xl border border-slate-700 bg-black/30 p-3 outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                Allowed range: ₦50–₦130
              </p>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-black"
            >
              Publish Live Task
            </button>

            {message && (
              <p className="rounded-xl border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
                {message}
              </p>
            )}
          </form>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Published Tasks</h2>
            <button
              onClick={loadTasks}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 p-6 text-slate-400">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 p-6 text-slate-400">
              No tasks have been created yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className="rounded-2xl border border-slate-800 bg-[#07110d] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-emerald-400">
                        {task.category || "Task"} ·{" "}
                        {task.action_type || "action"}
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        {task.task_title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        Reward: ₦{Number(task.reward_per_worker).toLocaleString()}
                      </p>

                      {task.target_url && (
                        <a
                          href={task.target_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block break-all text-sm text-emerald-400 underline"
                        >
                          {task.target_url}
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => toggleTask(task)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold ${
                        task.is_active
                          ? "bg-emerald-500 text-black"
                          : "border border-slate-700 text-slate-300"
                      }`}
                    >
                      {task.is_active ? "Active — Pause" : "Paused — Activate"}
                    </button>
                  </div>

                  {task.instructions && (
                    <div className="mt-4 rounded-xl bg-black/30 p-3 text-sm text-slate-300">
                      {task.instructions}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
