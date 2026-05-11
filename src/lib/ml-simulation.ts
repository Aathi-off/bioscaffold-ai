// BioScaffold AI — ML Integration
// Connects to FastAPI backend (Random Forest model)
// Fallback to simulation if backend is offline

const API_URL = "http://127.0.0.1:8000";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ScaffoldInput {
  polymerType: string;
  concentration: number;
  temperature: number;
  fabricationMethod: string;
  crosslinkingTime: number;
}

export interface PatientInput {
  targetTissue: string;
  ageGroup: string;
  implantDuration: string;
  porosityTarget: number;
}

export interface PredictionResult {
  poreSize: number;
  mechanicalStrength: number;
  cellAdhesion: number;
  porosity: number;
  isOptimal: boolean;
  optimizationNotes: string[];
  source: "api" | "simulation";
}

export interface OptimizationResult {
  isOptimal: boolean;
  result: string;
  recommendedParameters?: Partial<ScaffoldInput>;
  reasons: string[];
}

// ── Polymer / fabrication encodings (kept for simulation fallback) ─────────────
const polymerEncoding: Record<string, number> = {
  "Collagen Type I":      1.00,
  "Collagen Type II":     0.85,
  "Collagen Type III":    0.90,
  "Collagen-HA":          1.10,
  "Collagen-Chitosan":    0.95,
  "Gelatin":              0.80,
  "Gelatin-HA":           0.88,
  "Silk Fibroin":         1.05,
  "Silk Fibroin-Gelatin": 0.98,
};

const fabricationEncoding: Record<string, number> = {
  "Electrospinning":  1.20,
  "Freeze-Drying":    1.00,
  "3D Bioprinting":   1.15,
  "Solvent Casting":  0.80,
  "Phase Separation": 0.90,
};

function addNoise(value: number, scale = 0.05): number {
  return value + (Math.random() - 0.5) * 2 * scale * value;
}

// ── Simulation fallback ────────────────────────────────────────────────────────
function simulatePredict(
  input: ScaffoldInput,
  patient: PatientInput
): PredictionResult {
  const pEnc = polymerEncoding[input.polymerType] ?? 1.0;
  const fEnc = fabricationEncoding[input.fabricationMethod] ?? 1.0;

  let poreSize =
    250 -
    input.concentration * 15 +
    input.temperature * 0.8 -
    input.crosslinkingTime * 2 +
    pEnc * 20 -
    fEnc * 10;
  poreSize = addNoise(Math.max(30, Math.min(400, poreSize)), 0.08);

  let mechanicalStrength =
    0.2 +
    input.concentration * 0.12 +
    input.crosslinkingTime * 0.03 +
    pEnc * 0.3 +
    fEnc * 0.15 -
    input.temperature * 0.005;
  mechanicalStrength = addNoise(
    Math.max(0.1, Math.min(5, mechanicalStrength)),
    0.1
  );

  let cellAdhesion =
    40 +
    pEnc * 15 +
    fEnc * 8 -
    Math.abs(input.concentration - 8) * 2 -
    Math.abs(input.temperature - 37) * 0.5 +
    input.crosslinkingTime * 0.3;
  cellAdhesion = addNoise(Math.max(20, Math.min(98, cellAdhesion)), 0.06);

  let porosity =
    patient.porosityTarget -
    input.concentration * 2.5 +
    input.temperature * 0.1 -
    input.crosslinkingTime * 0.5 +
    fEnc * 5;
  porosity = addNoise(Math.max(30, Math.min(98, porosity)), 0.05);

  const notes: string[] = [];
  const poreSizeOk = poreSize >= 100 && poreSize <= 200;
  const strengthOk = mechanicalStrength > 1;
  const porosityOk = porosity > 70;

  if (!poreSizeOk)
    notes.push(`Pore size ${poreSize.toFixed(1)}µm outside optimal 100–200µm`);
  if (!strengthOk)
    notes.push(`Strength ${mechanicalStrength.toFixed(2)}MPa below 1MPa threshold`);
  if (!porosityOk)
    notes.push(`Porosity ${porosity.toFixed(1)}% below 70% threshold`);
  if (poreSizeOk && strengthOk && porosityOk)
    notes.push("✅ All parameters are optimal!");

  return {
    poreSize:            Math.round(poreSize * 10) / 10,
    mechanicalStrength:  Math.round(mechanicalStrength * 100) / 100,
    cellAdhesion:        Math.round(cellAdhesion * 10) / 10,
    porosity:            Math.round(porosity * 10) / 10,
    isOptimal:           poreSizeOk && strengthOk && porosityOk,
    optimizationNotes:   notes,
    source:              "simulation",
  };
}

// ── Real API call ──────────────────────────────────────────────────────────────
export async function predictScaffoldAPI(
  input: ScaffoldInput,
  patient: PatientInput
): Promise<PredictionResult> {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        polymer_type:       input.polymerType,
        concentration:      input.concentration,
        temperature:        input.temperature,
        fabrication_method: input.fabricationMethod,
        crosslinking_time:  input.crosslinkingTime,
        target_tissue:      patient.targetTissue,
        patient_age_group:  patient.ageGroup,
        implant_duration:   patient.implantDuration,
        porosity_target:    patient.porosityTarget,
      }),
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();

    return {
      poreSize:           Math.round(data.pore_size_um * 10) / 10,
      mechanicalStrength: Math.round(data.mechanical_strength_mpa * 100) / 100,
      cellAdhesion:       Math.round(data.cell_adhesion_pct * 10) / 10,
      porosity:           Math.round(data.porosity_pct * 10) / 10,
      isOptimal:          data.is_optimal,
      optimizationNotes:  data.optimization_notes,
      source:             "api",
    };
  } catch {
    // Backend offline → fallback to simulation
    console.warn("⚠️ Backend offline — using simulation fallback");
    return simulatePredict(input, patient);
  }
}

// ── Kept for Optimize + Visualize pages (simulation only) ─────────────────────
export function predictScaffold(input: ScaffoldInput) {
  return simulatePredict(input, {
    targetTissue:    "Skin",
    ageGroup:        "18-40",
    implantDuration: "Medium-term",
    porosityTarget:  75,
  });
}

export function optimizeScaffold(input: ScaffoldInput): OptimizationResult {
  const prediction = predictScaffold(input);
  const reasons: string[] = [];
  const recommended: Partial<ScaffoldInput> = {};

  const poreSizeOk = prediction.poreSize >= 100 && prediction.poreSize <= 200;
  const strengthOk = prediction.mechanicalStrength > 1;
  const porosityOk = prediction.porosity > 70;

  if (!poreSizeOk) {
    reasons.push(`Pore size ${prediction.poreSize}µm outside optimal range (100–200µm)`);
    if (prediction.poreSize > 200) {
      recommended.concentration = Math.min(15, input.concentration + 2);
      recommended.crosslinkingTime = Math.min(60, input.crosslinkingTime + 5);
    } else {
      recommended.concentration = Math.max(1, input.concentration - 2);
      recommended.temperature = Math.min(50, input.temperature + 5);
    }
  }
  if (!strengthOk) {
    reasons.push(`Strength ${prediction.mechanicalStrength}MPa below 1MPa threshold`);
    recommended.concentration = Math.min(15, (recommended.concentration ?? input.concentration) + 1);
    recommended.crosslinkingTime = Math.min(60, input.crosslinkingTime + 10);
  }
  if (!porosityOk) {
    reasons.push(`Porosity ${prediction.porosity}% below 70% threshold`);
    recommended.concentration = Math.max(1, (recommended.concentration ?? input.concentration) - 1);
  }

  const isOptimal = poreSizeOk && strengthOk && porosityOk;
  return {
    isOptimal,
    result: isOptimal ? "Optimal Scaffold" : "Not Optimal",
    recommendedParameters: isOptimal ? undefined : recommended,
    reasons: isOptimal ? ["All parameters within optimal range!"] : reasons,
  };
}

export function generateGraphData() {
  const poreSizeVsConcentration = [];
  for (let c = 2; c <= 15; c += 0.5) {
    const pred = predictScaffold({
      polymerType: "Collagen Type I",
      concentration: c,
      temperature: 37,
      fabricationMethod: "Electrospinning",
      crosslinkingTime: 20,
    });
    poreSizeVsConcentration.push({ concentration: c, poreSize: pred.poreSize });
  }

  const strengthVsTemperature = [];
  for (let t = 20; t <= 50; t += 1) {
    const pred = predictScaffold({
      polymerType: "Collagen Type I",
      concentration: 8,
      temperature: t,
      fabricationMethod: "Electrospinning",
      crosslinkingTime: 20,
    });
    strengthVsTemperature.push({ temperature: t, strength: pred.mechanicalStrength });
  }

  const porosityDistribution = [];
  const methods = ["Electrospinning", "Freeze-Drying", "3D Bioprinting", "Solvent Casting", "Phase Separation"];
  for (const method of methods) {
    const pred = predictScaffold({
      polymerType: "Collagen Type I",
      concentration: 8,
      temperature: 37,
      fabricationMethod: method,
      crosslinkingTime: 20,
    });
    porosityDistribution.push({ method, porosity: pred.porosity });
  }

  return { poreSizeVsConcentration, strengthVsTemperature, porosityDistribution };
}