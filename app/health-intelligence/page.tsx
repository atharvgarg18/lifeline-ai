import HealthIntelligenceContent from "@/components/health-intelligence/HealthIntelligenceContent";

export default function HealthIntelligencePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Header Section */}
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumb / Label */}
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
              LifeLine AI
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Health{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Intelligence
            </span>{" "}
            Report
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Generate AI-powered health insights using analytics, lifestyle
            information, medical history, symptom assessment, and emergency
            preparedness data.
          </p>

          {/* Decorative data-point chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "Analytics", icon: "📊" },
              { label: "Lifestyle", icon: "🏃" },
              { label: "Medical History", icon: "📋" },
              { label: "Symptom Assessment", icon: "🩺" },
              { label: "Emergency Preparedness", icon: "🚨" },
            ].map(({ label, icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
              >
                <span aria-hidden="true">{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <HealthIntelligenceContent />
      </div>
    </main>
  );
}