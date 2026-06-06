"use client";

import { useEffect, useState } from "react";
import { CheckCircle, MapPin, Stethoscope } from "lucide-react";

const allocationItems = [
  { label: "Ambulance", value: "Unit A-12 dispatched" },
  { label: "Hospital", value: "Apollo Emergency Center" },
  { label: "Bed", value: "ER Bay 3 reserved" },
  { label: "Doctor", value: "Dr. Iyer assigned" },
];

type Status = "idle" | "allocating" | "allocated";
const symptomOptions = [
  "Severe chest pain",
  "Shortness of breath",
  "Unconscious / unresponsive",
  "Heavy bleeding",
  "Severe allergic reaction",
  "High fever with seizures",
  "Stroke symptoms",
  "Major accident / trauma",
];

export default function SOSQuickRequest() {
  const [symptoms, setSymptoms] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "allocating") return;
    const timer = setTimeout(() => setStatus("allocated"), 1200);
    return () => clearTimeout(timer);
  }, [status]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!symptoms.trim() || !location.trim()) {
      setError("Please select symptoms and enter your location.");
      return;
    }
    setError(null);
    setStatus("allocating");
  };


  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-10">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.35)]">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">SOS Request</p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Quick emergency intake
          </h1>
          <p className="text-sm text-slate-300">
            Provide symptoms and location. We will allocate an ambulance, hospital bed,
            and doctor for this demo flow.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Symptoms</label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3">
                <Stethoscope size={16} className="text-cyan-400" />
                <select
                  value={symptoms}
                  onChange={(event) => setSymptoms(event.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-slate-100"
                >
                  <option value="" className="text-slate-900">
                    Select primary symptom
                  </option>
                  {symptomOptions.map((option) => (
                    <option key={option} value={option} className="text-slate-900">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Location</label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3">
                <MapPin size={16} className="text-cyan-400" />
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="MG Road, Bengaluru"
                  className="w-full bg-transparent py-3 text-sm text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>

            {error ? <p className="text-sm text-rose-400">{error}</p> : null}

            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Request SOS
            </button>
          </form>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Stethoscope size={16} className="text-emerald-400" />
              Allocation status
            </div>

            <div className="mt-4 space-y-3">
              {status === "idle" ? (
                <p className="text-sm text-slate-400">
                  Submit the form to simulate ambulance, hospital, bed, and doctor allocation.
                </p>
              ) : null}

              {status === "allocating" ? (
                <p className="text-sm text-amber-300">Allocating emergency resources...</p>
              ) : null}

              {status === "allocated" ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                    All resources allocated. Help is on the way.
                  </div>

                  <div className="space-y-2">
                    {allocationItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
                      >
                        <div className="text-sm text-slate-300">{item.label}</div>
                        <div className="flex items-center gap-2 text-sm text-slate-100">
                          <CheckCircle size={14} className="text-emerald-400" />
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
                    ETA: 6 minutes. Stay calm and keep your phone nearby.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
