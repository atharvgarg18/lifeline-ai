"use client";

import { useEffect, useState } from "react";
import { CheckCircle, MapPin, Stethoscope, Loader, AlertCircle } from "lucide-react";
import { emergencyService, EmergencySOS } from "@/services/emergency.service";
import { geolocationService } from "@/services/geolocation.service";

type Status = "idle" | "detecting_location" | "allocating" | "allocated" | "error";
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
  const [location, setLocation] = useState("Detecting your location...");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [emergency, setEmergency] = useState<EmergencySOS | null>(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [checkingActive, setCheckingActive] = useState(true);
  const [hasActiveEmergency, setHasActiveEmergency] = useState(false);

  // Check for active emergency on mount
  useEffect(() => {
    checkActiveEmergency();
  }, []);

  // Auto-detect location (only if no active emergency)
  useEffect(() => {
    if (!hasActiveEmergency && !checkingActive) {
      detectLocation();
    }
  }, [hasActiveEmergency, checkingActive]);

  const checkActiveEmergency = async () => {
    try {
      setCheckingActive(true);
      const token = localStorage.getItem('ll_token');
      if (!token) {
        setCheckingActive(false);
        return;
      }

      // Try to get active emergency
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/emergency/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setEmergency(data.data);
          setHasActiveEmergency(true);
          setStatus("allocated");
        }
      }
    } catch (error) {
      console.error('Error checking active emergency:', error);
    } finally {
      setCheckingActive(false);
    }
  };

  const detectLocation = async () => {
    try {
      if (!geolocationService.isSupported()) {
        setError("Geolocation not supported by your browser");
        setLocation("Location unavailable");
        return;
      }

      const hasPermission = await geolocationService.requestPermission();
      if (!hasPermission) {
        setError("Location permission denied. Please enable location access for emergency services.");
        setLocation("Location access denied");
        return;
      }

      const coords = await geolocationService.getCurrentPosition();
      const address = await geolocationService.getAddressFromCoords(coords);
      
      setLocation(address);
      setLocationDetected(true);
      setError(null);
      console.log('✅ Location detected:', address);
    } catch (err: any) {
      console.error('Location detection failed:', err);
      setError("Failed to detect location. Please check your permissions.");
      setLocation("Location detection failed");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!symptoms.trim()) {
      setError("Please select your primary symptom.");
      return;
    }

    if (!locationDetected) {
      setError("Location not detected. Please enable location access.");
      return;
    }

    setError(null);
    setStatus("allocating");

    try {
      console.log('🚨 Triggering SOS with symptom:', symptoms);
      
      const result = await emergencyService.triggerSOSWithLocation(
        symptoms,
        `Emergency: ${symptoms}`
      );

      if (result.success && result.emergency) {
        setEmergency(result.emergency);
        setStatus("allocated");
        setHasActiveEmergency(true);
        console.log('✅ SOS triggered successfully:', result.emergency);
      } else {
        throw new Error(result.error || 'Failed to trigger SOS');
      }
    } catch (err: any) {
      console.error('❌ SOS trigger failed:', err);
      setError(err.message || 'Failed to trigger emergency SOS. Please try again.');
      setStatus("error");
    }
  };

  // Show loading while checking
  if (checkingActive) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 pt-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.35)]">
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-cyan-400" />
            <span className="ml-3 text-slate-300">Checking for active emergencies...</span>
          </div>
        </div>
      </section>
    );
  }

  // Show active emergency status
  if (hasActiveEmergency && emergency) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 pt-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.35)]">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400">Active Emergency</p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">
              Your Emergency Request
            </h1>
            <p className="text-sm text-slate-300">
              You have an active emergency request. Please wait for hospital response.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <p className="text-sm text-emerald-200">
                ✅ Emergency request is active. Hospitals have been notified.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <div className="text-xs text-slate-400">Emergency ID</div>
                <div className="text-sm text-slate-100 font-mono mt-1">
                  {String(emergency._id).substring(0, 12)}...
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <div className="text-xs text-slate-400">Status</div>
                <div className="text-sm text-slate-100 capitalize mt-1">{emergency.status}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <div className="text-xs text-slate-400">Priority</div>
                <div className="text-sm text-orange-400 font-semibold mt-1">{emergency.priority}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <div className="text-xs text-slate-400">Severity</div>
                <div className="text-sm text-red-400 font-bold mt-1">{emergency.severityScore}/10</div>
              </div>
            </div>

            {emergency.assignedHospitalId ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                <p className="text-sm text-emerald-200 font-semibold">
                  🏥 Hospital Assigned!
                </p>
                <p className="text-xs text-emerald-300 mt-1">
                  Hospital ID: {emergency.assignedHospitalId}
                </p>
                <p className="text-xs text-emerald-300">
                  Ambulance is on the way. Please stay calm.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3">
                <p className="text-sm text-cyan-100">
                  📱 Waiting for hospital to accept your request...
                </p>
                <p className="text-xs text-cyan-200 mt-1">
                  Hospitals have been notified. First available will respond shortly.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3">
              <div className="text-xs text-slate-400 mb-2">Timeline</div>
              <div className="space-y-2">
                {emergency.timeline?.slice().reverse().map((entry: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-slate-200">{entry.note}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-600"
            >
              Refresh Status
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show SOS request form
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-10">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.35)]">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">SOS Request</p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Quick emergency intake
          </h1>
          <p className="text-sm text-slate-300">
            Your location is automatically detected. Select your symptoms and we'll find the nearest hospital with available resources.
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
                  disabled={status === "allocating"}
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
              <label className="text-sm font-medium text-slate-200">Your Location</label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-3">
                <MapPin size={16} className="text-cyan-400" />
                <span className="text-sm text-slate-100 flex-1">{location}</span>
                {!locationDetected && status === "idle" && (
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2">
                <p className="text-sm text-rose-300 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={status === "allocating" || !locationDetected || !symptoms}
              className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "allocating" ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Finding nearest hospital...
                </>
              ) : (
                "Request SOS"
              )}
            </button>
          </form>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Stethoscope size={16} className="text-emerald-400" />
              Allocation status
            </div>

            <div className="mt-4 space-y-3">
              {status === "idle" && (
                <p className="text-sm text-slate-400">
                  {locationDetected 
                    ? "Select your symptoms and click 'Request SOS' to notify nearby hospitals."
                    : "Detecting your location..."}
                </p>
              )}

              {status === "allocating" && (
                <div className="space-y-2">
                  <p className="text-sm text-amber-300 flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Finding optimal hospital match...
                  </p>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>✓ Analyzing location and severity</p>
                    <p>✓ Checking bed availability</p>
                    <p>✓ Matching specializations</p>
                    <p>✓ Notifying top 5 hospitals...</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2">
                  <p className="text-sm text-rose-300">
                    Failed to send emergency request. Please try again or call emergency services directly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
