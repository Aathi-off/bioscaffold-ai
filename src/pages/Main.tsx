import { Link } from "react-router-dom";
import { ArrowRight, Beaker, BarChart3, Settings2, Microscope, Brain, Database, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Main = () => {
  const features = [
    {
      icon: Brain,
      title: "Real ML Prediction",
      description: "Random Forest model trained on 5,000 synthetic scaffold experiments predicts pore size, strength, cell adhesion and porosity.",
    },
    {
      icon: Settings2,
      title: "Smart Optimization",
      description: "Tissue-specific optimization engine evaluates scaffolds against Skin, Bone, Cartilage, Tendon, Nerve and Vascular criteria.",
    },
    {
      icon: BarChart3,
      title: "Interactive Visualization",
      description: "Explore relationships between fabrication parameters with real-time Recharts visualizations.",
    },
    {
      icon: Microscope,
      title: "Patient-Specific Design",
      description: "Personalize scaffolds by target tissue type, patient age group, implant duration and porosity target.",
    },
    {
      icon: FlaskConical,
      title: "Multi-Polymer Support",
      description: "Design scaffolds from Collagen, Gelatin, Silk Fibroin and their composites — all major biopolymers covered.",
    },
    {
      icon: Database,
      title: "5,000 Row Dataset",
      description: "Synthetic dataset generated from published biopolymer literature covering 9 input parameters and 4 scaffold outputs.",
    },
  ];

  const stats = [
    { value: "R² = 0.87", label: "Model Accuracy" },
    { value: "5,000",     label: "Training Samples" },
    { value: "9",         label: "Input Features" },
    { value: "4",         label: "Predicted Properties" },
  ];

  const polymers = [
    "Collagen Type I", "Collagen-HA", "Collagen-Chitosan",
    "Gelatin", "Gelatin-HA", "Silk Fibroin", "Silk Fibroin-Gelatin",
  ];

  return (
    <div className="min-h-[calc(100vh-65px)]">
      {/* Hero */}
      <section className="gradient-hero px-4 py-16 md:py-24 text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/80">
            <Beaker className="h-4 w-4" />
            Machine Learning for Tissue Engineering
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary-foreground md:text-6xl">
            Design Optimal<br />
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Biodegradable Scaffolds
            </span>
          </h1>
          <p className="mb-6 text-base md:text-lg text-primary-foreground/70">
            BioScaffold AI uses a trained Random Forest model to predict and optimize
            biopolymer scaffold properties — pore size, mechanical strength, cell adhesion,
            and porosity — from fabrication parameters.
          </p>

          {/* Polymer badges */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {polymers.map((p) => (
              <Badge
                key={p}
                variant="outline"
                className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground text-xs"
              >
                {p}
              </Badge>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto gradient-primary border-0 text-white font-semibold shadow-elevated"
            >
              <Link to="/input">
                Start Designing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-white text-primary font-semibold border-2 border-white hover:bg-white/90"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto grid grid-cols-2 gap-0 md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="border-r border-border px-4 md:px-8 py-6 md:py-8 text-center last:border-0">
              <p className="text-2xl md:text-3xl font-extrabold text-primary">{value}</p>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <h2 className="mb-3 text-center text-2xl md:text-3xl font-bold text-foreground">
          Intelligent Scaffold Engineering
        </h2>
        <p className="mb-10 text-center text-muted-foreground text-sm md:text-base">
          From collagen to silk fibroin — all major biopolymers, all fabrication methods
        </p>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-card hover:-translate-y-1"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:gradient-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero px-4 py-12 md:py-16 text-center">
        <div className="container mx-auto max-w-xl">
          <h2 className="mb-3 text-xl md:text-2xl font-bold text-primary-foreground">
            Ready to Design Your Scaffold?
          </h2>
          <p className="mb-6 text-sm md:text-base text-primary-foreground/70">
            Configure fabrication parameters and get instant ML predictions — no lab required.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary font-semibold border-2 border-white hover:bg-white/90 shadow-elevated"
          >
            <Link to="/input">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
};

export default Main;
