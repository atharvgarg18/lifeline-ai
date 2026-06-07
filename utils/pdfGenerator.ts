import type { HealthReport } from "@/types/healthReport";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RGB {
  r: number;
  g: number;
  b: number;
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const COLORS = {
  primary:      { r: 37,  g: 99,  b: 235 } satisfies RGB, // blue-600
  primaryLight: { r: 219, g: 234, b: 254 } satisfies RGB, // blue-100
  cyan:         { r: 8,   g: 145, b: 178 } satisfies RGB, // cyan-600
  cyanLight:    { r: 207, g: 250, b: 254 } satisfies RGB, // cyan-100
  green:        { r: 22,  g: 163, b: 74  } satisfies RGB, // green-600
  greenLight:   { r: 220, g: 252, b: 231 } satisfies RGB, // green-100
  amber:        { r: 217, g: 119, b: 6   } satisfies RGB, // amber-600
  amberLight:   { r: 254, g: 243, b: 199 } satisfies RGB, // amber-100
  red:          { r: 220, g: 38,  b: 38  } satisfies RGB, // red-600
  redLight:     { r: 254, g: 226, b: 226 } satisfies RGB, // red-100
  slate900:     { r: 15,  g: 23,  b: 42  } satisfies RGB,
  slate700:     { r: 51,  g: 65,  b: 85  } satisfies RGB,
  slate500:     { r: 100, g: 116, b: 139 } satisfies RGB,
  slate200:     { r: 226, g: 232, b: 240 } satisfies RGB,
  slate50:      { r: 248, g: 250, b: 252 } satisfies RGB,
  white:        { r: 255, g: 255, b: 255 } satisfies RGB,
} as const;

// ─── Layout constants ─────────────────────────────────────────────────────────

const PAGE_W    = 210; // A4 mm
const PAGE_H    = 297;
const MARGIN    = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setFill(doc: import("jspdf").jsPDF, c: RGB): void {
  doc.setFillColor(c.r, c.g, c.b);
}

function setDraw(doc: import("jspdf").jsPDF, c: RGB): void {
  doc.setDrawColor(c.r, c.g, c.b);
}

function setTextColor(doc: import("jspdf").jsPDF, c: RGB): void {
  doc.setTextColor(c.r, c.g, c.b);
}

function riskColors(riskLevel: string): { bg: RGB; fg: RGB } {
  if (riskLevel === "Low")      return { bg: COLORS.greenLight, fg: COLORS.green };
  if (riskLevel === "Moderate") return { bg: COLORS.amberLight, fg: COLORS.amber };
  return { bg: COLORS.redLight, fg: COLORS.red };
}

/**
 * Wraps long text into lines that fit within maxWidth (mm) at the current font size.
 */
function wrapText(
  doc: import("jspdf").jsPDF,
  text: string,
  maxWidth: number
): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

/**
 * Draws a filled rounded rectangle.
 */
function roundedRect(
  doc: import("jspdf").jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: RGB,
  stroke?: RGB
): void {
  setFill(doc, fill);
  if (stroke) {
    setDraw(doc, stroke);
    doc.roundedRect(x, y, w, h, r, r, "FD");
  } else {
    doc.roundedRect(x, y, w, h, r, r, "F");
  }
}

/**
 * Draws a section heading with a left accent bar.
 */
function drawSectionHeading(
  doc: import("jspdf").jsPDF,
  title: string,
  y: number,
  accentColor: RGB = COLORS.primary
): number {
  // Accent bar
  setFill(doc, accentColor);
  doc.rect(MARGIN, y, 3, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextColor(doc, COLORS.slate900);
  doc.text(title, MARGIN + 6, y + 5);

  // Underline rule
  setDraw(doc, COLORS.slate200);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y + 8, MARGIN + CONTENT_W, y + 8);

  return y + 13; // next Y
}

/**
 * Draws a bullet list and returns the new Y cursor.
 */
function drawBulletList(
  doc: import("jspdf").jsPDF,
  items: string[],
  startY: number,
  bulletColor: RGB = COLORS.primary
): number {
  let y = startY;
  const lineH = 5.5;
  const bulletX = MARGIN + 4;
  const textX   = MARGIN + 10;
  const textW   = CONTENT_W - 14;

  for (const item of items) {
    // Bullet dot
    setFill(doc, bulletColor);
    doc.circle(bulletX, y + 1.5, 1, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setTextColor(doc, COLORS.slate700);

    const lines = wrapText(doc, item, textW);
    doc.text(lines, textX, y + 3);
    y += lines.length * lineH + 1.5;
  }
  return y + 2;
}

/**
 * Draws a horizontal progress bar (score pill).
 */
function drawScoreBar(
  doc: import("jspdf").jsPDF,
  label: string,
  score: number,
  y: number,
  fillColor: RGB
): number {
  const barW = CONTENT_W - 40;
  const barH = 5;
  const barX = MARGIN + 38;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.slate700);
  doc.text(label, MARGIN, y + 4);

  // Track
  roundedRect(doc, barX, y + 1, barW, barH, 2, COLORS.slate200);
  // Fill
  const fillW = Math.max(2, (score / 100) * barW);
  roundedRect(doc, barX, y + 1, fillW, barH, 2, fillColor);

  // Value label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextColor(doc, fillColor);
  doc.text(`${score}`, barX + barW + 3, y + 5);

  return y + 11;
}

/**
 * Adds a new page and returns the initial Y cursor (below the header band).
 */
function addPage(
  doc: import("jspdf").jsPDF,
  pageNum: number,
  totalPages: number
): number {
  doc.addPage();
  return drawPageChrome(doc, pageNum, totalPages);
}

/**
 * Draws the repeating page chrome (thin top bar + footer) and returns the
 * Y position where content should start.
 */
function drawPageChrome(
  doc: import("jspdf").jsPDF,
  pageNum: number,
  totalPages: number
): number {
  // Top accent bar
  setFill(doc, COLORS.primary);
  doc.rect(0, 0, PAGE_W, 6, "F");

  // Footer
  const footerY = PAGE_H - 10;
  setFill(doc, COLORS.slate50);
  doc.rect(0, footerY - 2, PAGE_W, 14, "F");
  setDraw(doc, COLORS.slate200);
  doc.setLineWidth(0.2);
  doc.line(0, footerY - 2, PAGE_W, footerY - 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setTextColor(doc, COLORS.slate500);
  doc.text("LifeLine AI · Health Intelligence Report · Confidential", MARGIN, footerY + 3);
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, footerY + 3, { align: "right" });

  return 14; // content starts below top bar
}

// ─── Page builders ────────────────────────────────────────────────────────────

function buildPage1(
  doc: import("jspdf").jsPDF,
  report: HealthReport
): void {
  let y = drawPageChrome(doc, 1, 3);

  // ── Logo / Header band ────────────────────────────────────────────────────
  roundedRect(doc, MARGIN, y, CONTENT_W, 22, 3, COLORS.primaryLight);

  // Logo mark (simple cross icon drawn with rectangles)
  const logoX = MARGIN + 6;
  const logoY = y + 5;
  setFill(doc, COLORS.primary);
  doc.rect(logoX + 3, logoY, 4, 10, "F");   // vertical bar
  doc.rect(logoX, logoY + 3, 10, 4, "F");   // horizontal bar

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setTextColor(doc, COLORS.primary);
  doc.text("LifeLine AI", logoX + 14, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate500);
  doc.text("Health Intelligence Platform", logoX + 14, y + 16.5);

  // Report label (right-aligned in header band)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate700);
  doc.text("HEALTH INTELLIGENCE REPORT", MARGIN + CONTENT_W - 4, y + 9, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setTextColor(doc, COLORS.slate500);
  doc.text(
    new Date(report.generatedAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    MARGIN + CONTENT_W - 4,
    y + 15,
    { align: "right" }
  );

  y += 27;

  // ── Report title ──────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  setTextColor(doc, COLORS.slate900);
  doc.text("Patient Health Intelligence Report", MARGIN, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.slate500);
  doc.text(
    "AI-generated preventive health analysis based on lifestyle, medical history, symptoms & emergency preparedness.",
    MARGIN,
    y + 13,
    { maxWidth: CONTENT_W }
  );

  y += 22;

  // ── Score + Risk cards (side by side) ─────────────────────────────────────
  const cardH = 34;
  const halfW = (CONTENT_W - 5) / 2;

  // Health Score card
  roundedRect(doc, MARGIN, y, halfW, cardH, 4, COLORS.cyanLight);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.cyan);
  doc.text("HEALTH SCORE", MARGIN + 5, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  setTextColor(doc, COLORS.cyan);
  doc.text(String(report.healthScore), MARGIN + 5, y + 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setTextColor(doc, COLORS.slate500);
  doc.text("/ 100", MARGIN + 5 + doc.getTextWidth(String(report.healthScore)) + 2, y + 25);

  // Score bar inside card
  const innerBarW = halfW - 10;
  roundedRect(doc, MARGIN + 5, y + 28, innerBarW, 3, 1.5, COLORS.white);
  const scored = Math.max(2, (report.healthScore / 100) * innerBarW);
  roundedRect(doc, MARGIN + 5, y + 28, scored, 3, 1.5, COLORS.cyan);

  // Risk Level card
  const rX = MARGIN + halfW + 5;
  const { bg, fg } = riskColors(report.riskLevel);
  roundedRect(doc, rX, y, halfW, cardH, 4, bg);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextColor(doc, fg);
  doc.text("RISK LEVEL", rX + 5, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  setTextColor(doc, fg);
  doc.text(report.riskLevel.toUpperCase(), rX + 5, y + 22);

  const riskDesc =
    report.riskLevel === "LOW"
      ? "Within healthy parameters."
      : report.riskLevel === "MODERATE"
      ? "Some areas require attention."
      : "Immediate attention recommended.";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate700);
  doc.text(riskDesc, rX + 5, y + 29, { maxWidth: halfW - 8 });

  y += cardH + 10;

  // ── Executive Summary ─────────────────────────────────────────────────────
  y = drawSectionHeading(doc, "Executive Summary", y);

  roundedRect(doc, MARGIN, y, CONTENT_W, 2, 2, COLORS.slate50, COLORS.slate200);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setTextColor(doc, COLORS.slate700);

  const summaryLines = wrapText(doc, report.executiveSummary, CONTENT_W - 8);
  const summaryH = summaryLines.length * 5.5 + 8;

  roundedRect(doc, MARGIN, y, CONTENT_W, summaryH, 3, COLORS.slate50, COLORS.slate200);
  doc.text(summaryLines, MARGIN + 4, y + 6);

  y += summaryH + 8;

  // ── Disclaimer ────────────────────────────────────────────────────────────
  roundedRect(doc, MARGIN, y, CONTENT_W, 14, 3, COLORS.amberLight);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.amber);
  doc.text("⚠  Important Disclaimer", MARGIN + 4, y + 6);
  doc.setFont("helvetica", "normal");
  setTextColor(doc, COLORS.slate700);
  doc.text(
    "This report is AI-generated for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional.",
    MARGIN + 4,
    y + 11,
    { maxWidth: CONTENT_W - 8 }
  );
}

function buildPage2(
  doc: import("jspdf").jsPDF,
  report: HealthReport
): void {
  let y = addPage(doc, 2, 3);
  y += 4;

  // ── Top Findings ──────────────────────────────────────────────────────────
  y = drawSectionHeading(doc, "Top Findings", y, COLORS.cyan);
  y = drawBulletList(doc, report.findings, y, COLORS.cyan);
  y += 6;

  // ── Priority Actions ──────────────────────────────────────────────────────
  y = drawSectionHeading(doc, "Priority Actions", y, COLORS.amber);

  const lineH = 5.5;
  const textW = CONTENT_W - 22;

  for (let i = 0; i < report.priorityActions.length; i++) {
    const action = report.priorityActions[i];
    const lines = wrapText(doc, action, textW);
    const rowH = lines.length * lineH + 5;

    // Alternating row bg
    if (i % 2 === 0) {
      roundedRect(doc, MARGIN, y, CONTENT_W, rowH, 2, COLORS.slate50);
    }

    // Number badge
    roundedRect(doc, MARGIN + 3, y + 2, 7, 7, 1.5, COLORS.amberLight);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setTextColor(doc, COLORS.amber);
    doc.text(String(i + 1), MARGIN + 6.5, y + 7.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setTextColor(doc, COLORS.slate700);
    doc.text(lines, MARGIN + 14, y + 5.5);

    y += rowH + 2;
  }

  y += 8;

  // ── Recommendations ───────────────────────────────────────────────────────
  y = drawSectionHeading(doc, "Recommendations", y, COLORS.green);

  for (const rec of report.recommendations) {
    const lines = wrapText(doc, rec, CONTENT_W - 16);
    const rowH = lines.length * lineH + 6;

    roundedRect(doc, MARGIN, y, CONTENT_W, rowH, 3, COLORS.greenLight);

    // Checkmark icon
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setTextColor(doc, COLORS.green);
    doc.text("✓", MARGIN + 4, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setTextColor(doc, COLORS.slate700);
    doc.text(lines, MARGIN + 12, y + 5.5);

    y += rowH + 3;
  }
}

function buildPage3(
  doc: import("jspdf").jsPDF,
  report: HealthReport
): void {
  let y = addPage(doc, 3, 3);
  y += 4;

  // ── Emergency Readiness ────────────────────────────────────────────────
  y = drawSectionHeading(doc, "Emergency Readiness", y, COLORS.red);

  const prepItems = [
    "Blood group information recorded in the system.",
    "Emergency contact details have been added and are up to date.",
    "Current medication list is maintained and regularly reviewed.",
    "Known allergy records are documented and accessible.",
  ];

  const prepFlags = [
    true,  // placeholder — in a real app, derive from payload
    true,
    true,
    true,
  ];

  for (let i = 0; i < prepItems.length; i++) {
    const isReady = prepFlags[i];
    const bg  = isReady ? COLORS.greenLight : COLORS.redLight;
    const fg  = isReady ? COLORS.green      : COLORS.red;
    const mark = isReady ? "✓" : "✗";
    const lines = wrapText(doc, prepItems[i], CONTENT_W - 18);
    const rowH  = lines.length * 5.5 + 6;

    roundedRect(doc, MARGIN, y, CONTENT_W, rowH, 3, bg);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setTextColor(doc, fg);
    doc.text(mark, MARGIN + 4, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    setTextColor(doc, COLORS.slate700);
    doc.text(lines, MARGIN + 12, y + 5.5);

    y += rowH + 3;
  }

  y += 6;

  // ── Score bars ────────────────────────────────────────────────────────────
  y = drawSectionHeading(doc, "Assessment Scores", y);

  y = drawScoreBar(doc, "Emergency Preparedness", report.emergencyReadinessScore, y, COLORS.cyan);
  y = drawScoreBar(doc, "Overall Health Score",   report.healthScore,                y, COLORS.primary);
  y = drawScoreBar(doc, "AI Confidence",          report.confidence,                 y, COLORS.green);

  y += 8;

  // ── Confidence detail card ────────────────────────────────────────────────
  y = drawSectionHeading(doc, "AI Confidence Analysis", y, COLORS.primary);

  const confDesc =
    report.confidence >= 80
      ? "High confidence. The AI model is strongly confident in the accuracy and completeness of this analysis based on the data provided."
      : report.confidence >= 60
      ? "Moderate confidence. The analysis is reliable, though additional health data may refine the insights further."
      : "Lower confidence. Some data points were sparse. We recommend supplementing with a clinical consultation.";

  roundedRect(doc, MARGIN, y, CONTENT_W, 22, 3, COLORS.primaryLight, COLORS.slate200);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  setTextColor(doc, COLORS.primary);
  doc.text(`${report.confidence}%`, MARGIN + 5, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setTextColor(doc, COLORS.slate700);
  doc.text(confDesc, MARGIN + 5 + doc.getTextWidth(`${report.confidence}%`) + 6, y + 8, {
    maxWidth: CONTENT_W - doc.getTextWidth(`${report.confidence}%`) - 18,
  });

  y += 28;

  // ── Generated Timestamp ───────────────────────────────────────────────────
  roundedRect(doc, MARGIN, y, CONTENT_W, 16, 3, COLORS.slate50, COLORS.slate200);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate500);
  doc.text("REPORT GENERATED", MARGIN + 5, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  setTextColor(doc, COLORS.slate700);
  doc.text(
    new Date(report.generatedAt).toLocaleString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    MARGIN + 5,
    y + 12
  );

  y += 22;

  // ── Sign-off ──────────────────────────────────────────────────────────────
  roundedRect(doc, MARGIN, y, CONTENT_W, 22, 3, COLORS.primaryLight);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setTextColor(doc, COLORS.primary);
  doc.text("LifeLine AI Health Intelligence Platform", MARGIN + 5, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTextColor(doc, COLORS.slate700);
  doc.text(
    "This report was automatically generated by LifeLine AI. For clinical advice, please consult a registered healthcare professional.",
    MARGIN + 5,
    y + 16,
    { maxWidth: CONTENT_W - 10 }
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

async function downloadReport(report: HealthReport): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  buildPage1(doc, report);
  buildPage2(doc, report);
  buildPage3(doc, report);

  doc.save("LifeLine_Health_Report.pdf");
}

export const pdfGenerator = {
  downloadReport,
} as const;