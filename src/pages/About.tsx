import { Beaker, Code2, Database, Brain, Server, FlaskConical, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const techStack = [
  {
    icon: Brain,
    title: "Random Forest Model",
    desc: "MultiOutputRegressor with RandomForestRegressor (200 estimators, max_depth=12) trained on 5,000 synthetic scaffold samples. Overall R² = 0.87.",
  },
  {
    icon: Database,
    title: "Synthetic Dataset",
    desc: "5,000 rows generated from published biopolymer literature. 9 input features → 4 output properties. Covers Collagen, Gelatin, and Silk Fibroin.",
  },
  {
    icon: Server,
    title: "FastAPI Backend",
    desc: "Python FastAPI server loads the trained model.pkl and exposes a /predict endpoint. React frontend calls it in real time for every prediction.",
  },
  {
    icon: Code2,
    title: "React + TypeScript",
    desc: "Modern responsive frontend built with React 18, TypeScript, Tailwind CSS, shadcn/ui components and Recharts visualizations.",
  },
  {
    icon: FlaskConical,
    title: "Multi-Polymer Support",
    desc: "Supports 9 polymer types: Collagen Type I/II/III, Collagen-HA, Collagen-Chitosan, Gelatin, Gelatin-HA, Silk Fibroin, Silk Fibroin-Gelatin.",
  },
  {
    icon: Beaker,
    title: "Tissue-Specific Optimization",
    desc: "Optimization engine uses tissue-specific criteria for Skin, Bone, Cartilage, Tendon, Nerve and Vascular scaffolds from published literature.",
  },
];

const modelMetrics = [
  { property: "Pore Size",            r2: "0.9594", mae: "6.69 µm",   status: "Excellent" },
  { property: "Mechanical Strength",  r2: "0.8767", mae: "0.336 MPa", status: "Good" },
  { property: "Cell Adhesion",        r2: "0.6928", mae: "4.07 %",    status: "Decent" },
  { property: "Porosity",             r2: "0.9504", mae: "2.80 %",    status: "Excellent" },
];

const tissueTable = [
  { tissue: "Skin",      pore: "100–200 µm", strength: "0.5–2.0 MPa", porosity: "70–90%" },
  { tissue: "Bone",      pore: "50–150 µm",  strength: "2.0–6.0 MPa", porosity: "60–80%" },
  { tissue: "Cartilage", pore: "80–180 µm",  strength: "1.5–4.0 MPa", porosity: "65–85%" },
  { tissue: "Tendon",    pore: "50–120 µm",  strength: "3.0–7.0 MPa", porosity: "55–75%" },
  { tissue: "Nerve",     pore: "150–300 µm", strength: "0.2–1.0 MPa", porosity: "75–95%" },
  { tissue: "Vascular",  pore: "80–150 µm",  strength: "0.8–2.5 MPa", porosity: "65–80%" },
];

const inputFeatures = [
  "Polymer Type", "Concentration (%)", "Temperature (°C)",
  "Fabrication Method", "Crosslinking Time (min)",
  "Target Tissue", "Patient Age Group", "Implant Duration", "Porosity Target (%)",
];

const outputTargets = [
  "Pore Size (µm)", "Mechanical Strength (MPa)", "Cell Adhesion (%)", "Porosity (%)",
];

const About = () => (
  <div className="container mx-auto max-w-4xl px-4 py-12">

    {/* Header */}
    <div className="mb-10 text-center">
      <h1 className="text-3xl font-bold text-foreground">About BioScaffold AI</h1>
      <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
        BioScaffold AI is a machine learning system for designing biodegradable biopolymer
        scaffolds for tissue engineering. A trained Random Forest model predicts scaffold
        properties from fabrication parameters — reducing costly lab trials and accelerating
        patient-specific scaffold development.
      </p>
    </div>

    {/* Tech Stack */}
    <div className="grid gap-5 md:grid-cols-2 mb-10">
      {techStack.map(({ icon: Icon, title, desc }) => (
        <Card key={title} className="shadow-soft">
          <CardContent className="p-5">
            <Icon className="mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Model Performance */}
    <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-soft">
      <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        Model Performance (R² Score)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 pr-4">Property</th>
              <th className="pb-2 pr-4">R² Score</th>
              <th className="pb-2 pr-4">MAE</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {modelMetrics.map(({ property, r2, mae, status }) => (
              <tr key={property} className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium text-foreground">{property}</td>
                <td className="py-2 pr-4 font-mono text-primary">{r2}</td>
                <td className="py-2 pr-4 text-muted-foreground">{mae}</td>
                <td className="py-2">
                  <Badge variant={status === "Excellent" ? "default" : status === "Good" ? "secondary" : "outline"}>
                    {status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Overall R² = <span className="font-mono font-bold text-primary">0.8698</span> ·
        Trained on 4,000 samples · Tested on 1,000 samples
      </p>
    </div>

    {/* Dataset */}
    <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-soft">
      <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
        <Database className="h-5 w-5 text-primary" />
        Dataset — 9 Inputs → 4 Outputs
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Input Features</p>
          <ul className="space-y-1">
            {inputFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Output Targets</p>
          <ul className="space-y-1">
            {outputTargets.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Tissue-Specific Criteria */}
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
      <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
        <Beaker className="h-5 w-5 text-primary" />
        Tissue-Specific Optimization Criteria
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 pr-4">Tissue</th>
              <th className="pb-2 pr-4">Pore Size</th>
              <th className="pb-2 pr-4">Mech. Strength</th>
              <th className="pb-2">Porosity</th>
            </tr>
          </thead>
          <tbody>
            {tissueTable.map(({ tissue, pore, strength, porosity }) => (
              <tr key={tissue} className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium text-foreground">{tissue}</td>
                <td className="py-2 pr-4 text-muted-foreground">{pore}</td>
                <td className="py-2 pr-4 text-muted-foreground">{strength}</td>
                <td className="py-2 text-muted-foreground">{porosity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  </div>
);

export default About;