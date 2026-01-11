import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, 
  ChevronLeft,
  Check,
  Layers,
  Building2,
  Palette,
  LayoutGrid,
  Rocket,
  Upload,
  GripVertical,
  Terminal,
  Download,
  ExternalLink,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Template", icon: Layers },
  { id: 2, label: "Client", icon: Building2 },
  { id: 3, label: "Brand", icon: Palette },
  { id: 4, label: "Sections", icon: LayoutGrid },
  { id: 5, label: "Generate", icon: Rocket },
];

const templates = [
  { id: "trade-premium-dark", name: "Trade Premium Dark", tags: ["trade", "premium", "dark"] },
  { id: "clean-light-business", name: "Clean Light Business", tags: ["business", "light", "clean"] },
  { id: "modern-saas-landing", name: "Modern SaaS Landing", tags: ["saas", "tech", "gradient"] },
];

const stylePresets = [
  { id: "evolv-premium-dark", name: "EvolvAI Premium Dark", colors: ["#0a0f14", "#00d4ff", "#10b981"] },
  { id: "clean-light", name: "Clean Light", colors: ["#ffffff", "#3b82f6", "#6366f1"] },
  { id: "warm-professional", name: "Warm Professional", colors: ["#faf5f0", "#b45309", "#78350f"] },
  { id: "bold-modern", name: "Bold Modern", colors: ["#18181b", "#f43f5e", "#fbbf24"] },
];

const defaultSections = [
  { id: "hero", label: "Hero Section", enabled: true, order: 1 },
  { id: "services", label: "Services", enabled: true, order: 2 },
  { id: "about", label: "About Us", enabled: true, order: 3 },
  { id: "testimonials", label: "Testimonials", enabled: true, order: 4 },
  { id: "gallery", label: "Gallery", enabled: false, order: 5 },
  { id: "faq", label: "FAQ", enabled: false, order: 6 },
  { id: "contact", label: "Contact", enabled: true, order: 7 },
  { id: "footer", label: "Footer", enabled: true, order: 8 },
];

export default function Generator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("evolv-premium-dark");
  const [sections, setSections] = useState(defaultSections);
  const [generationState, setGenerationState] = useState<'idle' | 'generating' | 'complete'>('idle');
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [clientDetails, setClientDetails] = useState({
    companyName: "",
    domain: "",
    tagline: "",
    phone: "",
    email: "",
    address: "",
    ctaLabel: "Get a Free Quote",
    ctaLink: "/contact"
  });

  const [brandInputs, setBrandInputs] = useState({
    primaryColor: "#00d4ff",
    secondaryColor: "#10b981",
    accentColor: "#fbbf24",
    headingFont: "Space Grotesk",
    bodyFont: "Inter"
  });

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const startGeneration = () => {
    setGenerationState('generating');
    const logs = [
      "Initializing generation pipeline...",
      "Copying template files to output directory...",
      "Applying brand tokens to tailwind.config.ts...",
      "Updating CSS variables in globals.css...",
      "Setting up typography: Space Grotesk + Inter...",
      "Placing logo assets...",
      "Generating content/site.json...",
      "Enabling sections: hero, services, about, testimonials, contact, footer...",
      "Applying client details to metadata...",
      "Optimizing images...",
      "Running build validation...",
      "✓ Build successful! Project ready."
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setGenerationLogs(prev => [...prev, logs[logIndex]]);
        setGenerationProgress(((logIndex + 1) / logs.length) * 100);
        logIndex++;
      } else {
        clearInterval(interval);
        setGenerationState('complete');
      }
    }, 400);
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Generate New Site</h1>
          <p className="text-muted-foreground mt-1">Create a branded website in minutes</p>
        </div>

        <div className="flex items-center justify-between px-4" data-testid="wizard-steps">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={cn(
                  "flex items-center gap-3 cursor-pointer group",
                  currentStep === step.id && "text-primary",
                  currentStep > step.id && "text-chart-2",
                  currentStep < step.id && "text-muted-foreground"
                )}
                onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                data-testid={`step-${step.id}`}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  currentStep === step.id && "border-primary bg-primary/10",
                  currentStep > step.id && "border-chart-2 bg-chart-2 text-chart-2-foreground",
                  currentStep < step.id && "border-muted bg-muted/10"
                )}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5 text-background" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  "font-medium text-sm hidden sm:block",
                  currentStep === step.id && "text-foreground",
                  currentStep !== step.id && "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-16 lg:w-24 h-0.5 mx-4",
                  currentStep > step.id ? "bg-chart-2" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        <Card className="glass border-card-border">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-display font-semibold">Choose a Template</h2>
                  <p className="text-muted-foreground mt-1">Select a base template for your new website</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={cn(
                        "p-6 rounded-xl border-2 cursor-pointer transition-all",
                        selectedTemplate === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedTemplate(template.id)}
                      data-testid={`template-option-${template.id}`}
                    >
                      <div className="aspect-video rounded-lg bg-muted mb-4 flex items-center justify-center">
                        <Layers className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-foreground">{template.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="mt-3 flex items-center gap-2 text-primary text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-xl font-display font-semibold">Client Details</h2>
                  <p className="text-muted-foreground mt-1">Enter the business information for this website</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input 
                      id="company-name" 
                      placeholder="Elite Plumbing Pro"
                      value={clientDetails.companyName}
                      onChange={(e) => setClientDetails({ ...clientDetails, companyName: e.target.value })}
                      data-testid="input-company-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain (optional)</Label>
                    <Input 
                      id="domain" 
                      placeholder="eliteplumbingpro.com"
                      value={clientDetails.domain}
                      onChange={(e) => setClientDetails({ ...clientDetails, domain: e.target.value })}
                      data-testid="input-domain"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline / Slogan</Label>
                  <Input 
                    id="tagline" 
                    placeholder="Your Trusted Local Plumbing Experts"
                    value={clientDetails.tagline}
                    onChange={(e) => setClientDetails({ ...clientDetails, tagline: e.target.value })}
                    data-testid="input-tagline"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      placeholder="1-800-555-0123"
                      value={clientDetails.phone}
                      onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      placeholder="contact@company.com"
                      value={clientDetails.email}
                      onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                      data-testid="input-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    placeholder="123 Main St, City, State 12345"
                    value={clientDetails.address}
                    onChange={(e) => setClientDetails({ ...clientDetails, address: e.target.value })}
                    data-testid="input-address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-label">Primary CTA Label</Label>
                    <Input 
                      id="cta-label" 
                      placeholder="Get a Free Quote"
                      value={clientDetails.ctaLabel}
                      onChange={(e) => setClientDetails({ ...clientDetails, ctaLabel: e.target.value })}
                      data-testid="input-cta-label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-link">CTA Link</Label>
                    <Input 
                      id="cta-link" 
                      placeholder="/contact"
                      value={clientDetails.ctaLink}
                      onChange={(e) => setClientDetails({ ...clientDetails, ctaLink: e.target.value })}
                      data-testid="input-cta-link"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <h2 className="text-xl font-display font-semibold">Brand Customization</h2>
                  <p className="text-muted-foreground mt-1">Define colors, fonts, and visual style</p>
                </div>
                
                <div className="space-y-4">
                  <Label>Style Preset</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stylePresets.map((preset) => (
                      <div
                        key={preset.id}
                        className={cn(
                          "p-4 rounded-xl border-2 cursor-pointer transition-all",
                          selectedStyle === preset.id
                            ? "border-primary"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setSelectedStyle(preset.id)}
                        data-testid={`style-preset-${preset.id}`}
                      >
                        <div className="flex gap-1 mb-3">
                          {preset.colors.map((color, i) => (
                            <div 
                              key={i} 
                              className="w-6 h-6 rounded-full border border-border" 
                              style={{ backgroundColor: color }} 
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium">{preset.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Custom Colors (or use preset)</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color" className="text-xs text-muted-foreground">Primary</Label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          id="primary-color"
                          value={brandInputs.primaryColor}
                          onChange={(e) => setBrandInputs({ ...brandInputs, primaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                          data-testid="input-primary-color"
                        />
                        <Input 
                          value={brandInputs.primaryColor}
                          onChange={(e) => setBrandInputs({ ...brandInputs, primaryColor: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color" className="text-xs text-muted-foreground">Secondary</Label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          id="secondary-color"
                          value={brandInputs.secondaryColor}
                          onChange={(e) => setBrandInputs({ ...brandInputs, secondaryColor: e.target.value })}
                          className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                          data-testid="input-secondary-color"
                        />
                        <Input 
                          value={brandInputs.secondaryColor}
                          onChange={(e) => setBrandInputs({ ...brandInputs, secondaryColor: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent-color" className="text-xs text-muted-foreground">Accent</Label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          id="accent-color"
                          value={brandInputs.accentColor}
                          onChange={(e) => setBrandInputs({ ...brandInputs, accentColor: e.target.value })}
                          className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                          data-testid="input-accent-color"
                        />
                        <Input 
                          value={brandInputs.accentColor}
                          onChange={(e) => setBrandInputs({ ...brandInputs, accentColor: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heading-font">Heading Font</Label>
                    <Input 
                      id="heading-font" 
                      placeholder="Space Grotesk"
                      value={brandInputs.headingFont}
                      onChange={(e) => setBrandInputs({ ...brandInputs, headingFont: e.target.value })}
                      data-testid="input-heading-font"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body-font">Body Font</Label>
                    <Input 
                      id="body-font" 
                      placeholder="Inter"
                      value={brandInputs.bodyFont}
                      onChange={(e) => setBrandInputs({ ...brandInputs, bodyFont: e.target.value })}
                      data-testid="input-body-font"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Asset Uploads</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-muted rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all" data-testid="upload-logo">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Upload Logo</p>
                      <p className="text-xs text-muted-foreground">SVG or PNG</p>
                    </div>
                    <div className="border-2 border-dashed border-muted rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all" data-testid="upload-hero">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Upload Hero Image</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG or MP4</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-xl font-display font-semibold">Page Sections</h2>
                  <p className="text-muted-foreground mt-1">Enable and reorder sections for your website</p>
                </div>
                <div className="space-y-2">
                  {sections.sort((a, b) => a.order - b.order).map((section) => (
                    <div 
                      key={section.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-all",
                        section.enabled ? "bg-secondary/30 border-border" : "bg-muted/20 border-transparent"
                      )}
                      data-testid={`section-${section.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                        <span className={cn(
                          "font-medium",
                          section.enabled ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {section.label}
                        </span>
                      </div>
                      <Switch 
                        checked={section.enabled}
                        onCheckedChange={() => toggleSection(section.id)}
                        data-testid={`toggle-section-${section.id}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Tip: You can provide custom copy for each section after generation, or edit the content/site.json file.
                </p>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-display font-semibold">Generate Project</h2>
                  <p className="text-muted-foreground mt-1">Review and generate your new website</p>
                </div>

                {generationState === 'idle' && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-foreground">Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Template</span>
                            <span className="font-medium">{templates.find(t => t.id === selectedTemplate)?.name || 'Not selected'}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Company</span>
                            <span className="font-medium">{clientDetails.companyName || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Style</span>
                            <span className="font-medium">{stylePresets.find(s => s.id === selectedStyle)?.name}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Sections</span>
                            <span className="font-medium">{sections.filter(s => s.enabled).length} enabled</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-medium text-foreground">Output</h3>
                        <div className="space-y-2">
                          <Label htmlFor="output-slug">Project Slug</Label>
                          <Input 
                            id="output-slug" 
                            placeholder="elite-plumbing-pro"
                            defaultValue={clientDetails.companyName.toLowerCase().replace(/\s+/g, '-')}
                            data-testid="input-output-slug"
                          />
                          <p className="text-xs text-muted-foreground">Output: /data/generated/elite-plumbing-pro/</p>
                        </div>
                      </div>
                    </div>
                    <Button className="glow gap-2 w-full" size="lg" onClick={startGeneration} data-testid="button-generate">
                      <Sparkles className="w-5 h-5" />
                      Generate Website
                    </Button>
                  </>
                )}

                {generationState === 'generating' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Generating...</span>
                        <span className="text-primary font-mono">{Math.round(generationProgress)}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                    <div className="bg-background rounded-xl p-4 font-mono text-sm max-h-64 overflow-y-auto" data-testid="generation-logs">
                      {generationLogs.map((log, i) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <Terminal className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className={log.startsWith('✓') ? 'text-chart-2' : 'text-muted-foreground'}>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {generationState === 'complete' && (
                  <div className="space-y-6 text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-chart-2/10 flex items-center justify-center mx-auto animate-pulse-glow">
                      <CheckCircle2 className="w-10 h-10 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-foreground">Generation Complete!</h3>
                      <p className="text-muted-foreground mt-1">Your website is ready to run</p>
                    </div>
                    <Card className="glass border-card-border max-w-md mx-auto text-left">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Run Instructions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <code className="block bg-background rounded px-3 py-2 text-sm font-mono">cd /data/generated/elite-plumbing-pro</code>
                        <code className="block bg-background rounded px-3 py-2 text-sm font-mono">npm install</code>
                        <code className="block bg-background rounded px-3 py-2 text-sm font-mono">npm run dev</code>
                      </CardContent>
                    </Card>
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="outline" className="gap-2" data-testid="button-download-zip">
                        <Download className="w-4 h-4" />
                        Download ZIP
                      </Button>
                      <Button className="gap-2" data-testid="button-open-folder">
                        <ExternalLink className="w-4 h-4" />
                        Open in Editor
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {generationState === 'idle' && (
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className="gap-2"
              data-testid="button-prev"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            {currentStep < 5 && (
              <Button 
                onClick={nextStep}
                disabled={currentStep === 1 && !selectedTemplate}
                className="gap-2"
                data-testid="button-next"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
