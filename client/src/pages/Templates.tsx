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
  MoreVertical,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTemplates, useUploadTemplate, useDeleteTemplate } from "@/lib/api";
import { toast } from "sonner";

export default function Templates() {
  const { data: templates = [], isLoading } = useTemplates();
  const uploadMutation = useUploadTemplate();
  const deleteMutation = useDeleteTemplate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
  });

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.name || !formData.description) {
      toast.error("Please fill in all required fields and select a file");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        ...formData,
      });

      toast.success("Template uploaded successfully! Processing...");
      setIsUploadOpen(false);
      setSelectedFile(null);
      setFormData({ name: "", description: "", tags: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Template deleted successfully");
    } catch (error) {
      toast.error("Failed to delete template");
    }
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

              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name *</Label>
                  <Input
                    id="template-name"
                    placeholder="e.g., Premium Trade Dark"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    data-testid="input-template-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Description *</Label>
                  <Textarea
                    id="template-description"
                    placeholder="Describe what this template is best used for..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    data-testid="input-template-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-tags">Tags (comma-separated)</Label>
                  <Input
                    id="template-tags"
                    placeholder="trade, premium, dark, one-page"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    data-testid="input-template-tags"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-file">Template File (ZIP) *</Label>
                  <div className="relative">
                    <Input
                      id="template-file"
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                      data-testid="input-template-file"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending || !selectedFile || !formData.name || !formData.description}
                  data-testid="button-upload"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background/20 border-t-background animate-spin rounded-full mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Template
                    </>
                  )}
                </Button>
              </div>
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
          {isLoading ? (
            <div className="col-span-2 text-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No templates found</p>
              <p className="text-sm text-muted-foreground mt-1">Upload your first template to get started</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
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
                      {template.statusMessage && (
                        <p className="text-xs text-destructive mt-1">{template.statusMessage}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      onClick={() => handleDelete(template.id, template.name)}
                      data-testid={`button-delete-${template.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
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
          )))}
        </div>
      </div>
    </AppLayout>
  );
}
