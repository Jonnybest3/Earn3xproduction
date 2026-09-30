"use client";

import { useState } from "react";

const plans = [
  { name: "Beginner", fee: 1000, tasks: "4–6", note: "Starter access" },
  { name: "Bronze", fee: 3500, tasks: "7–10", note: "More daily tasks" },
  { name: "Gold", fee: 7500, tasks: "11–15", note: "Higher task access" },
  { name: "Diamond", fee: 15000, tasks: "13–16", note: "Advanced access" },
  { name: "Super Gold", fee: 25000, tasks: "19–23", note: "High-volume access" },
  { name: "Expert", fee: 50000, tasks: "30–35", note: "Maximum task access" },
];

const tasks = [
  { title: "Social Media Engagement", category: "Social", reward: 250, time: "5 min" },
  { title: "Short Video Campaign", category: "Video", reward: 400, time: "8 min" },
  { title: "Data Entry Task", category: "Data", reward: 300, time: "7 min" },
  { title: "Content Review", category: "Review", reward: 350, time: "6 min" },
];

export default function Home() {
  const [page, setPage] = useState("home");
  const [balance, setBalance] = useState(12500);
  const [selectedPlan, setSelectedPlan] = useState("Beginner");
  const [message, setMessage] = useState("");

  const money = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);

  function completeTask(reward: number) {
    setBalance((b) => b + reward);
    setMessage(`Task submitted. ${money(reward)} has been added to your pending earnings.`);
  }

  return (
    <main className="min-h-screen bg-[#07110d] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07110d]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <button onClick={() => setPage("home")} className="text-2xl font-black tracking-tight">
            Earn<span className="text-emerald-400">3X</span>
          </button>

          <nav className="hidden gap-6 text-sm text-gray-300 md:flex">
            {[
              ["home", "Home"],
              ["tasks", "Tasks"],
              ["plans", "Plans"],
              ["wallet", "Wallet"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                className="transition hover:text-emerald-400"
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setPage("wallet")}
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-black"
          >
            {money(balance)}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            {message}
          </div>
        )}

        {page === "home" && (
          <>
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 md:p-10">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Worker platform
                </p>
                <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-6xl">
                  Complete tasks.
                  <br />
                  <span className="text-emerald-400">Earn real money.</span>
                </h1>
                <p className="mt-5 max-w-xl text-gray-400">
                  Choose your task plan, complete approved tasks, track your earnings,
                  and request withdrawals from your worker wallet.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={() => setPage("tasks")}
                    className="rounded-xl bg-emerald-400 px-6 py-3 font-bold text-black"
                  >
                    View Tasks
                  </button>
                  <button
                    onClick={() => setPage("plans")}
                    className="rounded-xl border border-white/15 px-6 py-3 font-semibold"
                  >
                    View Plans
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-emerald-400 p-7 text-black">
                <p className="text-sm font-bold uppercase tracking-wider">Available balance</p>
                <p className="mt-4 text-4xl font-black">{money(balance)}</p>
                <div className="mt-8 border-t border-black/15 pt-5">
                  <p className="text-sm font-semibold">Current plan</p>
                  <p className="mt-1 text-2xl font-black">{selectedPlan}</p>
                </div>
                <button
                  onClick={() => setPage("wallet")}
                  className="mt-7 w-full rounded-xl bg-black px-5 py-3 font-bold text-white"
                >
                  Open Wallet
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Today's tasks", "6"],
                ["Pending earnings", money(1800)],
                ["Approved earnings", money(balance)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm text-gray-400">{label}</p>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "tasks" && (
          <>
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Task center
              </p>
              <h2 className="mt-2 text-3xl font-black">Available Tasks</h2>
              <p className="mt-2 text-gray-400">
                Complete available tasks and submit proof for administrator review.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <div key={task.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                        {task.category}
                      </span>
                      <h3 className="mt-4 text-xl font-bold">{task.title}</h3>
                      <p className="mt-2 text-sm text-gray-400">Estimated time: {task.time}</p>
                    </div>
                    <p className="text-lg font-black text-emerald-400">{money(task.reward)}</p>
                  </div>
                  <button
                    onClick={() => completeTask(task.reward)}
                    className="mt-6 w-full rounded-xl bg-emerald-400 py-3 font-bold text-black"
                  >
                    Start Task
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "plans" && (
          <>
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Task plans
              </p>
              <h2 className="mt-2 text-3xl font-black">Choose Your Plan</h2>
              <p className="mt-2 text-gray-400">
                Activation fees unlock the selected daily task allocation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-6 ${
                    selectedPlan === plan.name
                      ? "border-emerald-400 bg-emerald-400/10"
                      : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <p className="text-xl font-black">{plan.name}</p>
                  <p className="mt-4 text-3xl font-black">{money(plan.fee)}</p>
                  <p className="mt-2 text-sm text-gray-400">{plan.note}</p>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-sm text-gray-400">Daily task allocation</p>
                    <p className="mt-1 font-bold">{plan.tasks} tasks</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlan(plan.name);
                      setMessage(`${plan.name} selected. Payment activation will be connected to Paystack.`);
                    }}
                    className="mt-6 w-full rounded-xl bg-emerald-400 py-3 font-bold text-black"
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "wallet" && (
          <>
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Worker wallet
              </p>
              <h2 className="mt-2 text-3xl font-black">Wallet & Withdrawals</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl bg-white/[0.04] p-7 border border-white/10">
                <p className="text-sm text-gray-400">Available balance</p>
                <p className="mt-2 text-4xl font-black">{money(balance)}</p>
                <p className="mt-4 text-sm text-gray-400">
                  Minimum withdrawal: ₦2,000 · Admin ledger fee: ₦100
                </p>
                <button
                  onClick={() => setMessage("Withdrawal request screen will be connected to the real Supabase wallet and admin approval system.")}
                  className="mt-7 w-full rounded-xl bg-emerald-400 py-3 font-bold text-black"
                >
                  Request Withdrawal
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                <h3 className="text-xl font-bold">Account information</h3>
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400">Plan</span>
                    <span className="font-semibold">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400">Currency</span>
                    <span className="font-semibold">NGN</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400">Withdrawal review</span>
                    <span className="font-semibold">Manual admin review</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weekly limit</span>
                    <span className="font-semibold">4 withdrawals</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-gray-500">
        © 2026 Earn3X · Worker task platform · Nigeria
      </footer>
    </main>
  );
}
