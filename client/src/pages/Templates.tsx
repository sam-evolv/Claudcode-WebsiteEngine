import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  Search, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Clock,
  Tag,
  Code,
  ExternalLink,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  frameworkType: string;
  status: 'ready' | 'processing' | 'error';
  createdAt: string;
  usageCount: number;
}

const mockTemplates: Template[] = [
  {
    id: "trade-premium-dark",
    name: "Trade Premium Dark",
    description: "A sophisticated dark-themed template perfect for trade businesses like plumbers, electricians, and contractors.",
    tags: ["trade", "premium", "dark", "one-page"],
    frameworkType: "nextjs-app",
    status: "ready",
    createdAt: "2024-01-15",
    usageCount: 12
  },
  {
    id: "clean-light-business",
    name: "Clean Light Business",
    description: "Minimalist light theme with professional layouts for service-based businesses.",
    tags: ["business", "light", "clean", "multi-page"],
    frameworkType: "nextjs-app",
    status: "ready",
    createdAt: "2024-01-10",
    usageCount: 8
  },
  {
    id: "modern-saas-landing",
    name: "Modern SaaS Landing",
    description: "Conversion-focused landing page template for software products and SaaS companies.",
    tags: ["saas", "tech", "gradient", "one-page"],
    frameworkType: "nextjs-static",
    status: "ready",
    createdAt: "2024-01-08",
    usageCount: 5
  },
  {
    id: "restaurant-showcase",
    name: "Restaurant Showcase",
    description: "Elegant template for restaurants with menu sections, gallery, and reservation integration.",
    tags: ["restaurant", "hospitality", "elegant", "multi-page"],
    frameworkType: "nextjs-app",
    status: "processing",
    createdAt: "2024-01-20",
    usageCount: 0
  },
  {
    id: "real-estate-pro",
    name: "Real Estate Pro",
    description: "Property listing template with search filters and agent profiles.",
    tags: ["real-estate", "property", "listings", "multi-page"],
    frameworkType: "vite-react",
    status: "error",
    createdAt: "2024-01-18",
    usageCount: 0
  }
];

export default function Templates() {
  const [templates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUpload = () => {
    setUploadState('uploading');
    setTimeout(() => setUploadState('analyzing'), 1500);
    setTimeout(() => setUploadState('success'), 3500);
  };

  const getStatusBadge = (status: Template['status']) => {
    switch (status) {
      case 'ready':
        return (
          <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/30">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/30">
            <Clock className="w-3 h-3 mr-1 animate-spin" /> Processing
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            <XCircle className="w-3 h-3 mr-1" /> Error
          </Badge>
        );
    }
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Templates</h1>
            <p className="text-muted-foreground mt-1">Manage your reusable website templates</p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="glow gap-2" data-testid="button-upload-template">
                <Upload className="w-4 h-4" />
                Upload Template
              </Button>
            </DialogTrigger>
            <DialogContent className="glass max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Upload New Template</DialogTitle>
                <DialogDescription>
                  Upload a zip file of your website codebase to convert it into a reusable template.
                </DialogDescription>
              </DialogHeader>
              
              {uploadState === 'idle' && (
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" placeholder="e.g., Premium Trade Dark" data-testid="input-template-name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description</Label>
                    <Textarea id="template-description" placeholder="Describe what this template is best used for..." data-testid="input-template-description" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template-tags">Tags (comma-separated)</Label>
                    <Input id="template-tags" placeholder="trade, premium, dark, one-page" data-testid="input-template-tags" />
                  </div>
                  
                  <div 
                    className="border-2 border-dashed border-muted rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                    onClick={handleUpload}
                    data-testid="dropzone-upload"
                  >
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">ZIP files up to 100MB</p>
                  </div>
                </div>
              )}
              
              {uploadState === 'uploading' && (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
                  <p className="font-medium text-foreground">Uploading template...</p>
                  <p className="text-sm text-muted-foreground mt-1">Please wait while we upload your files</p>
                </div>
              )}
              
              {uploadState === 'analyzing' && (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Code className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Analyzing codebase...</p>
                  <p className="text-sm text-muted-foreground mt-1">Detecting framework, theme variables, and content structure</p>
                </div>
              )}
              
              {uploadState === 'success' && (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-chart-2/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-chart-2" />
                  </div>
                  <p className="font-medium text-foreground">Template created successfully!</p>
                  <p className="text-sm text-muted-foreground mt-1">Your template is now ready for use</p>
                  <Button className="mt-6" onClick={() => { setIsUploadOpen(false); setUploadState('idle'); }} data-testid="button-close-success">
                    Done
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search templates by name or tag..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-templates"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="w-4 h-4" />
            {filteredTemplates.length} templates
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={cn(
                "glass border-card-border hover:border-primary/30 transition-all group",
                template.status === 'error' && "border-destructive/30"
              )}
              data-testid={`template-card-${template.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-display text-lg flex items-center gap-2">
                      {template.name}
                      {getStatusBadge(template.status)}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{template.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`button-template-menu-${template.id}`}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      {template.frameworkType}
                    </span>
                    <span>Used {template.usageCount}x</span>
                  </div>
                  {template.status === 'ready' && (
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary" data-testid={`button-preview-${template.id}`}>
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  )}
                  {template.status === 'error' && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" data-testid={`button-fix-${template.id}`}>
                      View Errors
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
