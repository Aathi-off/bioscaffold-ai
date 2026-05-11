import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { ScaffoldInput } from "@/lib/ml-simulation";

const polymerTypes = [
  "Collagen Type I", "Collagen Type II", "Collagen Type III",
  "Collagen-HA", "Collagen-Chitosan",
  "Gelatin", "Gelatin-HA",
  "Silk Fibroin", "Silk Fibroin-Gelatin",
];

const fabricationMethods = [
  "Electrospinning", "Freeze-Drying", "3D Bioprinting",
  "Solvent Casting", "Phase Separation",
];

const targetTissues    = ["Skin", "Bone", "Cartilage", "Tendon", "Nerve", "Vascular"];
const ageGroups        = ["<18", "18-40", "41-60", "61-80", "80+"];
const implantDurations = [
  "Short-term (< 4 weeks)",
  "Medium-term (4–12 weeks)",
  "Long-term (> 12 weeks)",
];

const InputForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<ScaffoldInput>({
    polymerType:       "Collagen Type I",
    concentration:     8,
    temperature:       37,
    fabricationMethod: "Electrospinning",
    crosslinkingTime:  20,
  });

  const [targetTissue,    setTargetTissue]    = useState("Skin");
  const [ageGroup,        setAgeGroup]        = useState("18-40");
  const [implantDuration, setImplantDuration] = useState("Medium-term (4–12 weeks)");
  const [porosityTarget,  setPorosityTarget]  = useState(75);

  const handleSubmit = () => {
    navigate("/results", {
      state: {
        input: form,
        patientData: { targetTissue, ageGroup, implantDuration, porosityTarget },
      },
    });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Design Your Scaffold</h1>
        <p className="mt-2 text-muted-foreground">
          Configure parameters · ML model predicts scaffold properties in real time
        </p>
      </div>

      <div className="space-y-6">

        {/* Patient-Specific */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              Patient-Specific Parameters
            </CardTitle>
            <CardDescription>Define the clinical context for scaffold design</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">

            <div className="space-y-2">
              <Label>Target Tissue Type</Label>
              <Select value={targetTissue} onValueChange={setTargetTissue}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {targetTissues.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Patient Age Group</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ageGroups.map((a) => <SelectItem key={a} value={a}>{a} years</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Implant Duration</Label>
              <Select value={implantDuration} onValueChange={setImplantDuration}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {implantDurations.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Porosity Target:{" "}
                <span className="font-mono text-primary">{porosityTarget}%</span>
              </Label>
              <Slider
                value={[porosityTarget]}
                onValueChange={([v]) => setPorosityTarget(v)}
                min={50} max={95} step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50% (Dense)</span><span>95% (Highly Porous)</span>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Fabrication Parameters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              Fabrication Parameters
            </CardTitle>
            <CardDescription>Adjust parameters for ML scaffold property prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="space-y-2">
              <Label>Polymer Type</Label>
              <Select value={form.polymerType} onValueChange={(v) => setForm({ ...form, polymerType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {polymerTypes.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Concentration: <span className="font-mono text-primary">{form.concentration}%</span></Label>
              <Slider value={[form.concentration]} onValueChange={([v]) => setForm({ ...form, concentration: v })} min={1} max={15} step={0.5} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>1%</span><span>15%</span></div>
            </div>

            <div className="space-y-2">
              <Label>Temperature: <span className="font-mono text-primary">{form.temperature}°C</span></Label>
              <Slider value={[form.temperature]} onValueChange={([v]) => setForm({ ...form, temperature: v })} min={20} max={50} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>20°C</span><span>50°C</span></div>
            </div>

            <div className="space-y-2">
              <Label>Fabrication Method</Label>
              <Select value={form.fabricationMethod} onValueChange={(v) => setForm({ ...form, fabricationMethod: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fabricationMethods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Crosslinking Time: <span className="font-mono text-primary">{form.crosslinkingTime} min</span></Label>
              <Slider value={[form.crosslinkingTime]} onValueChange={([v]) => setForm({ ...form, crosslinkingTime: v })} min={5} max={60} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground"><span>5 min</span><span>60 min</span></div>
            </div>

          </CardContent>
        </Card>

        <Button onClick={handleSubmit} className="w-full gradient-primary border-0 text-primary-foreground" size="lg">
          Predict Scaffold Properties
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Powered by Random Forest · trained on 5,000 synthetic scaffold experiments
        </p>

      </div>
    </div>
  );
};

export default InputForm;