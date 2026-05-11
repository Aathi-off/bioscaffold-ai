import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, Settings2, FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { optimizeScaffold, type ScaffoldInput, type OptimizationResult } from "@/lib/ml-simulation";

// ── Tissue-specific criteria (from literature) ─────────────────────────────────
const tissueCriteria: Record<string, { pore: string; strength: string; porosity: string; adhesion: string }> = {
  Skin:      { pore: "100–200 µm", strength: "> 0.5 MPa",  porosity: "> 70%", adhesion: "> 60%" },
  Bone:      { pore: "50–150 µm",  strength: "> 2.0 MPa",  porosity: "> 60%", adhesion: "> 65%" },
  Cartilage: { pore: "80–180 µm",  strength: "> 1.5 MPa",  porosity: "> 65%", adhesion: "> 60%" },
  Tendon:    { pore: "50–120 µm",  strength: "> 3.0 MPa",  porosity: "> 55%", adhesion: "> 55%" },
  Nerve:     { pore: "150–300 µm", strength: "> 0.2 MPa",  porosity: "> 75%", adhesion: "> 50%" },
  Vascular:  { pore: "80–150 µm",  strength: "> 0.8 MPa",  porosity: "> 65%", adhesion: "> 60%" },
};

const Optimize = () => {
  const location   = useLocation();
  const input      = location.state?.input      as ScaffoldInput | undefined;
  const patientData = location.state?.patientData as { targetTissue?: string; ageGroup?: string; implantDuration?: string } | undefined;
  const tissue     = patientData?.targetTissue ?? "Skin";
  const criteria   = tissueCriteria[tissue] ?? tissueCriteria["Skin"];

  const [result, setResult] = useState<OptimizationResult | null>(null);

  if (!input) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">No Parameters to Optimize</h2>
        <p className="mt-2 text-muted-foreground">Submit and predict scaffold parameters first.</p>
        <Button asChild className="mt-6 gradient-primary border-0 text-primary-foreground">
          <Link to="/input">Go to Input Form</Link>
        </Button>
      </div>
    );
  }

  const handleOptimize = () => setResult(optimizeScaffold(input));

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Scaffold Optimization</h1>
        <p className="mt-2 text-muted-foreground">
          Evaluating scaffold against tissue-specific criteria
        </p>
      </div>

      {/* Context badges */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <Badge variant="outline" className="gap-1">
          <FlaskConical className="h-3 w-3" /> {input.polymerType}
        </Badge>
        <Badge variant="outline">🎯 {tissue} Tissue</Badge>
        {patientData?.ageGroup && (
          <Badge variant="outline">👤 Age: {patientData.ageGroup}</Badge>
        )}
        {patientData?.implantDuration && (
          <Badge variant="outline">⏱ {patientData.implantDuration}</Badge>
        )}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Optimization Criteria — {tissue} Tissue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Criteria table */}
          <div className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground space-y-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <p>• Pore Size: <span className="font-medium">{criteria.pore}</span></p>
              <p>• Mechanical Strength: <span className="font-medium">{criteria.strength}</span></p>
              <p>• Porosity: <span className="font-medium">{criteria.porosity}</span></p>
              <p>• Cell Adhesion: <span className="font-medium">{criteria.adhesion}</span></p>
            </div>
          </div>

          {/* Fabrication summary */}
          <div className="rounded-lg border border-border p-4 text-sm space-y-1">
            <p className="font-semibold text-foreground mb-2">Current Parameters:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
              <p>Polymer: <span className="font-medium text-foreground">{input.polymerType}</span></p>
              <p>Concentration: <span className="font-medium text-foreground">{input.concentration}%</span></p>
              <p>Temperature: <span className="font-medium text-foreground">{input.temperature}°C</span></p>
              <p>Method: <span className="font-medium text-foreground">{input.fabricationMethod}</span></p>
              <p>Crosslinking: <span className="font-medium text-foreground">{input.crosslinkingTime} min</span></p>
            </div>
          </div>

          {!result && (
            <Button
              onClick={handleOptimize}
              className="w-full gradient-primary border-0 text-primary-foreground"
              size="lg"
            >
              Run Optimization for {tissue} Tissue
            </Button>
          )}

          {result && (
            <div className="space-y-4">

              {/* Result banner */}
              <div className={`flex items-center gap-3 rounded-xl p-5 ${
                result.isOptimal ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
              }`}>
                {result.isOptimal ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="h-8 w-8 text-orange-500 shrink-0" />
                )}
                <div>
                  <p className={`text-xl font-bold ${result.isOptimal ? "text-green-700" : "text-orange-600"}`}>
                    {result.result}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {result.isOptimal
                      ? `This scaffold meets all ${tissue} tissue engineering criteria.`
                      : `Some parameters need adjustment for ${tissue} tissue engineering.`}
                  </p>
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-2">
                {result.reasons.map((r, i) => (
                  <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span>{result.isOptimal ? "✅" : "⚠️"}</span>
                    {r}
                  </p>
                ))}
              </div>

              {/* Recommended adjustments */}
              {result.recommendedParameters && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="mb-2 text-sm font-semibold text-foreground">
                    💡 Recommended Adjustments:
                  </p>
                  {Object.entries(result.recommendedParameters).map(([key, val]) => (
                    <p key={key} className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{key}:</span>{" "}
                      {String(val)}
                    </p>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setResult(null)}
                >
                  Re-run
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/input">Adjust Parameters</Link>
                </Button>
                <Button asChild className="flex-1 gradient-primary border-0 text-primary-foreground">
                  <Link to="/visualize">
                    Visualize <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Optimize;