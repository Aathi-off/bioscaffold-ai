import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateGraphData, predictScaffold } from "@/lib/ml-simulation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from "recharts";

// ── Extra chart data generators ────────────────────────────────────────────────
function generateCellAdhesionByPolymer() {
  const polymers = [
    "Collagen Type I", "Collagen-HA", "Collagen-Chitosan",
    "Gelatin", "Gelatin-HA", "Silk Fibroin", "Silk Fibroin-Gelatin",
  ];
  return polymers.map((p) => {
    const pred = predictScaffold({
      polymerType: p, concentration: 8, temperature: 37,
      fabricationMethod: "Electrospinning", crosslinkingTime: 20,
    });
    return { polymer: p.replace("Collagen-", "Col-").replace("Silk Fibroin", "SF").replace("Gelatin", "Gel"), cellAdhesion: pred.cellAdhesion };
  });
}

function generateStrengthVsConcentration() {
  const data = [];
  for (let c = 1; c <= 15; c += 0.5) {
    const pred = predictScaffold({
      polymerType: "Silk Fibroin", concentration: c, temperature: 37,
      fabricationMethod: "Electrospinning", crosslinkingTime: 20,
    });
    const pred2 = predictScaffold({
      polymerType: "Gelatin", concentration: c, temperature: 37,
      fabricationMethod: "Electrospinning", crosslinkingTime: 20,
    });
    const pred3 = predictScaffold({
      polymerType: "Collagen Type I", concentration: c, temperature: 37,
      fabricationMethod: "Electrospinning", crosslinkingTime: 20,
    });
    data.push({
      concentration: c,
      silkFibroin: pred.mechanicalStrength,
      gelatin: pred2.mechanicalStrength,
      collagen: pred3.mechanicalStrength,
    });
  }
  return data;
}

function generateRadarData() {
  const polymers = ["Collagen Type I", "Gelatin", "Silk Fibroin"];
  return polymers.map((p) => {
    const pred = predictScaffold({
      polymerType: p, concentration: 8, temperature: 37,
      fabricationMethod: "Electrospinning", crosslinkingTime: 20,
    });
    return {
      polymer: p.replace("Collagen Type I", "Collagen").replace("Silk Fibroin", "Silk Fibroin"),
      "Pore Size":  Math.round((pred.poreSize / 400) * 100),
      "Strength":   Math.round((pred.mechanicalStrength / 5) * 100),
      "Adhesion":   Math.round(pred.cellAdhesion),
      "Porosity":   Math.round(pred.porosity),
    };
  });
}

// ── Component ──────────────────────────────────────────────────────────────────
const Visualize = () => {
  const data             = useMemo(() => generateGraphData(), []);
  const adhesionData     = useMemo(() => generateCellAdhesionByPolymer(), []);
  const strengthData     = useMemo(() => generateStrengthVsConcentration(), []);
  const radarData        = useMemo(() => generateRadarData(), []);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Data Visualization</h1>
        <p className="mt-2 text-muted-foreground">
          Explore scaffold parameter relationships across polymers and fabrication methods
        </p>
      </div>

      <div className="grid gap-8">

        {/* Chart 1 — Pore Size vs Concentration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Pore Size vs Concentration</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.poreSizeVsConcentration}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 20% 88%)" />
                <XAxis dataKey="concentration" label={{ value: "Concentration (%)", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Pore Size (µm)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(v: number) => [`${v} µm`, "Pore Size"]} />
                <Line type="monotone" dataKey="poreSize" stroke="hsl(168 70% 34%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2 — Mechanical Strength vs Temperature */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Mechanical Strength vs Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.strengthVsTemperature}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 20% 88%)" />
                <XAxis dataKey="temperature" label={{ value: "Temperature (°C)", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Strength (MPa)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(v: number) => [`${v} MPa`, "Strength"]} />
                <Line type="monotone" dataKey="strength" stroke="hsl(142 60% 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3 — Strength vs Concentration (3 polymers) */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Mechanical Strength vs Concentration — Polymer Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={strengthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 20% 88%)" />
                <XAxis dataKey="concentration" label={{ value: "Concentration (%)", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Strength (MPa)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(v: number, name: string) => [`${v.toFixed(2)} MPa`, name]} />
                <Legend />
                <Line type="monotone" dataKey="silkFibroin" name="Silk Fibroin"   stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="gelatin"     name="Gelatin"         stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="collagen"    name="Collagen Type I" stroke="hsl(168 70% 34%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4 — Cell Adhesion by Polymer */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Cell Adhesion by Polymer Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={adhesionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 20% 88%)" />
                <XAxis dataKey="polymer" tick={{ fontSize: 11 }} />
                <YAxis label={{ value: "Cell Adhesion (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Cell Adhesion"]} />
                <Bar dataKey="cellAdhesion" fill="hsl(142 60% 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 5 — Porosity by Fabrication Method */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Porosity by Fabrication Method</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.porosityDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 20% 88%)" />
                <XAxis dataKey="method" tick={{ fontSize: 11 }} />
                <YAxis label={{ value: "Porosity (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Porosity"]} />
                <Bar dataKey="porosity" fill="hsl(168 70% 34%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 6 — Radar: Polymer Comparison */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Polymer Performance Radar — Collagen vs Gelatin vs Silk Fibroin</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="polymer" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Pore Size"  dataKey="Pore Size" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                <Radar name="Strength"   dataKey="Strength"  stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                <Radar name="Adhesion"   dataKey="Adhesion"  stroke="hsl(142 60% 45%)" fill="hsl(142 60% 45%)" fillOpacity={0.15} />
                <Radar name="Porosity"   dataKey="Porosity"  stroke="hsl(168 70% 34%)" fill="hsl(168 70% 34%)" fillOpacity={0.15} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Values normalized to 0–100 scale for comparison. Electrospinning · 8% concentration · 37°C · 20 min crosslinking
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Visualize;