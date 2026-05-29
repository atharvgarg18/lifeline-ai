// ============================================================
// app/api/health/analyze/route.ts
// POST endpoint — validates input, calculates metrics, calls AI
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { calculateAllMetrics, HealthInput } from "@/lib/healthCalculations";
import { analyzeHealthWithAI } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const body: HealthInput = await req.json();

    // ── Basic validation ──────────────────────────────────────
    if (
      !body.name ||
      !body.age ||
      !body.gender ||
      !body.height ||
      !body.weight
    ) {
      return NextResponse.json(
        { error: "Missing required fields: name, age, gender, height, weight" },
        { status: 400 }
      );
    }

    if (body.age < 1 || body.age > 120) {
      return NextResponse.json(
        { error: "Age must be between 1 and 120" },
        { status: 400 }
      );
    }

    if (body.height < 50 || body.height > 300) {
      return NextResponse.json(
        { error: "Height must be between 50 and 300 cm" },
        { status: 400 }
      );
    }

    if (body.weight < 2 || body.weight > 500) {
      return NextResponse.json(
        { error: "Weight must be between 2 and 500 kg" },
        { status: 400 }
      );
    }

    // ── Calculate all health metrics ──────────────────────────
    const metrics = calculateAllMetrics(body);

    // ── Get AI analysis from Groq ─────────────────────────────
    const aiAnalysis = await analyzeHealthWithAI(body, metrics);

    // ── Return combined response ──────────────────────────────
    return NextResponse.json(
      {
        success: true,
        metrics,
        aiAnalysis,
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[health/analyze] Error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}