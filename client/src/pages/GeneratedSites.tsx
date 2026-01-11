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

interface GeneratedSite {
  id: string;
  slug: string;
  companyName: string;
  templateName: string;
  templateId: string;
  createdAt: string;
  status: 'ready' | 'building';
}

const mockGeneratedSites: GeneratedSite[] = [
  {
    id: "1",
    slug: "elite-plumbing-pro",
    companyName: "Elite Plumbing Pro",
    templateName: "Trade Premium Dark",
    templateId: "trade-premium-dark",
    createdAt: "2024-01-20T14:30:00Z",
    status: "ready"
  },
  {
    id: "2",
    slug: "smith-sons-electric",
    companyName: "Smith & Sons Electric",
    templateName: "Trade Premium Dark",
    templateId: "trade-premium-dark",
    createdAt: "2024-01-18T09:15:00Z",
    status: "ready"
  },
  {
    id: "3",
    slug: "coastal-roofing",
    companyName: "Coastal Roofing",
    templateName: "Clean Light Business",
    templateId: "clean-light-business",
    createdAt: "2024-01-17T16:45:00Z",
    status: "ready"
  },
  {
    id: "4",
    slug: "apex-hvac",
    companyName: "Apex HVAC Solutions",
    templateName: "Trade Premium Dark",
    templateId: "trade-premium-dark",
    createdAt: "2024-01-15T11:20:00Z",
    status: "ready"
  },
  {
    id: "5",
    slug: "greenfield-landscaping",
    companyName: "Greenfield Landscaping",
    templateName: "Clean Light Business",
    templateId: "clean-light-business",
    createdAt: "2024-01-14T08:00:00Z",
    status: "ready"
  },
  {
    id: "6",
    slug: "metro-construction",
    companyName: "Metro Construction Co",
    templateName: "Trade Premium Dark",
    templateId: "trade-premium-dark",
    createdAt: "2024-01-12T14:00:00Z",
    status: "ready"
  },
];

export default function GeneratedSites() {
  const [sites] = useState<GeneratedSite[]>(mockGeneratedSites);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSites = sites.filter(s => 
    s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                    <CardTitle className="font-display text-lg truncate">{site.companyName}</CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">/{site.slug}/</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`button-site-menu-${site.id}`}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <ExternalLink className="w-4 h-4" />
                        Open in Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Download className="w-4 h-4" />
                        Download ZIP
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
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
                    <Button variant="ghost" size="sm" className="h-8 px-3" data-testid={`button-download-${site.id}`}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-primary hover:text-primary" data-testid={`button-open-${site.id}`}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-16">
            <FolderOutput className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No sites found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or generate a new site.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
