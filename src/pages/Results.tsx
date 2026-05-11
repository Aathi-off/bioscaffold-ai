import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Microscope, Ruler, Shield, Droplets, ArrowRight,
  Loader2, Wifi, WifiOff, AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  predictScaffoldAPI,
  type ScaffoldInput,
  type PatientInput,
  type PredictionResult
} from "@/lib/ml-simulation";

const metricCards = [
  { key: "poreSize" as const,           label: "Pore Size",           unit: "µm",  icon: Ruler,      color: "text-primary" },
  { key: "mechanicalStrength" as const, label: "Mechanical Strength", unit: "MPa", icon: Shield,     color: "text-accent" },
  { key: "cellAdhesion" as const,       label: "Cell Adhesion",       unit: "%",   icon: Microscope, color: "text-info" },
  { key: "porosity" as const,           label: "Porosity",            unit: "%",   icon: Droplets,   color: "text-success" },
];

const Results = () => {
  const location    = useLocation();
  const input       = location.state?.input       as ScaffoldInput | undefined;
  const patientData = location.state?.patientData as PatientInput  | undefined;

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    if (!input) { setLoading(false); return; }

    const patient: PatientInput = patientData ?? {
      targetTissue:    "Skin",
      ageGroup:        "18-40",
      implantDuration: "Medium-term (4–12 weeks)",
      porosityTarget:  75,
    };

    setLoading(true);
    setError(null);

    predictScaffoldAPI(input, patient)
      .then((result) => {
        setPrediction(result);
        setLoading(false);
      })
      .catch(() => {
        setError("Prediction failed. Please try again.");
        setLoading(false);
      });
  }, [input]);

  // ── No input ───────────────────────────────────────────────────────────────
  if (!input) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground">No Results Yet</h2>
        <p className="mt-2 text-muted-foreground">Submit scaffold parameters first.</p>
        <Button asChild className="mt-6 gradient-primary border-0 text-primary-foreground">
          <Link to="/input">Go to Input Form</Link>
        </Button>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">Running ML Prediction...</p>
        <p className="text-sm text-muted-foreground">
          Random Forest model is analyzing your parameters
        </p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !prediction) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-bold text-destructive">{error ?? "Something went wrong."}</p>
        <Button asChild variant="outline">
          <Link to="/input">Try Again</Link>
        </Button>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Prediction Results
          </h1>
          {/* ✅ Fixed — Live ML badge always shows correctly */}
          {prediction.source === "api" ? (
            <Badge className="gap-1 bg-green-100 text-green-700 border border-green-300 hover:bg-green-100">
              <Wifi className="h-3 w-3" /> Live ML Model
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <WifiOff className="h-3 w-3" /> Simulation Mode
            </Badge>
          )}
        </div>

        <p className="text-sm md:text-base text-muted-foreground">
          {input.polymerType} · {input.concentration}% · {input.temperature}°C · {input.fabricationMethod}
        </p>

        {/* Patient context badges */}
        {patientData && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Badge variant="outline">🎯 {patientData.targetTissue} Tissue</Badge>
            <Badge variant="outline">👤 Age: {patientData.ageGroup}</Badge>
            <Badge variant="outline">⏱ {patientData.implantDuration}</Badge>
            <Badge variant="outline">🕳 Porosity Target: {patientData.porosityTarget}%</Badge>
          </div>
        )}
      </div>

      {/* ✅ Metric Cards — responsive grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {metricCards.map(({ key, label, unit, icon: Icon, color }) => (
          <Card
            key={key}
            className="shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
          >
            <CardContent className="flex items-center gap-4 p-5 md:p-6">
              <div className={`flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 ${color}`}>
                <Icon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {prediction[key]}
                  <span className="ml-1 text-sm md:text-base font-normal text-muted-foreground">
                    {unit}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Optimization status */}
      <div className={`mt-6 rounded-xl border p-4 ${
        prediction.isOptimal
          ? "border-green-200 bg-green-50"
          : "border-orange-200 bg-orange-50"
      }`}>
        <p className={`font-semibold text-sm md:text-base ${
          prediction.isOptimal ? "text-green-700" : "text-orange-700"
        }`}>
          {prediction.isOptimal
            ? "✅ Scaffold is Optimal!"
            : "⚠️ Scaffold Needs Optimization"}
        </p>
        <ul className="mt-2 space-y-1">
          {prediction.optimizationNotes.map((note, i) => (
            <li key={i} className="text-xs md:text-sm text-muted-foreground">
              • {note}
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Actions — pass patientData to Optimize page */}
      <div className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to="/input">Modify Parameters</Link>
        </Button>
        <Button
          asChild
          className="w-full sm:w-auto gradient-primary border-0 text-primary-foreground"
        >
          <Link to="/optimize" state={{ input, prediction, patientData }}>
            Optimize <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

    </div>
  );
};

export default Results;