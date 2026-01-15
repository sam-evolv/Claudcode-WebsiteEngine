import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FolderOutput,
  Download,
  ExternalLink,
  Calendar,
  Layers,
  MoreVertical,
  Trash2,
  Copy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGeneratedSites, useDeleteGeneratedSite, getDownloadUrl } from "@/lib/api";
import { toast } from "sonner";

export default function GeneratedSites() {
  const { data: sites = [], isLoading } = useGeneratedSites();
  const deleteMutation = useDeleteGeneratedSite();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSites = sites.filter(s => {
    const companyName = s.clientDetails?.companyName || '';
    return (
      companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Site deleted successfully");
    } catch (error) {
      toast.error("Failed to delete site");
    }
  };

  const handleDownload = (id: string) => {
    window.open(getDownloadUrl(id), '_blank');
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Generated Sites</h1>
            <p className="text-muted-foreground mt-1">Access and manage your generated projects</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by company name or slug..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-sites"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderOutput className="w-4 h-4" />
            {filteredSites.length} sites
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading generated sites...</p>
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="text-center py-16">
            <FolderOutput className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No sites found</h3>
            <p className="text-muted-foreground mt-1">
              {sites.length === 0 ? "Generate your first site to get started" : "Try adjusting your search"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSites.map((site) => (
              <Card
                key={site.id}
                className="glass border-card-border hover:border-primary/30 transition-all group"
                data-testid={`site-card-${site.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="font-display text-lg truncate">
                        {site.clientDetails?.companyName || site.slug}
                      </CardTitle>
                      <CardDescription className="font-mono text-xs mt-1">/{site.slug}/</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-site-menu-${site.id}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer"
                          onClick={() => handleDownload(site.id)}
                        >
                          <Download className="w-4 h-4" />
                          Download ZIP
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => handleDelete(site.id, site.slug)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Layers className="w-3 h-3 mr-1" />
                      {site.templateName}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(site.createdAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => handleDownload(site.id)}
                        data-testid={`button-download-${site.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
