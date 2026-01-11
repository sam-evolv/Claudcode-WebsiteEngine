import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Layers,
  Wand2,
  FolderOutput,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { useTemplates, useGeneratedSites } from "@/lib/api";
import { useMemo } from "react";

export default function Dashboard() {
  const { data: templates = [], isLoading: templatesLoading } = useTemplates();
  const { data: sites = [], isLoading: sitesLoading } = useGeneratedSites();

  // Calculate stats from real data
  const stats = useMemo(() => {
    const readyTemplates = templates.filter(t => t.status === 'ready').length;
    const totalSites = sites.length;

    // Calculate sites generated in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSites = sites.filter(s => new Date(s.createdAt) > thirtyDaysAgo).length;

    // Calculate sites generated in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekSites = sites.filter(s => new Date(s.createdAt) > sevenDaysAgo).length;

    // Estimate time saved (6 hours per site vs 1 hour with factory = 5 hours saved per site)
    const timeSaved = totalSites * 5;

    return [
      {
        label: "Templates",
        value: readyTemplates.toString(),
        icon: Layers,
        change: templates.length > readyTemplates ? `${templates.length - readyTemplates} processing` : "All ready",
        isLoading: templatesLoading
      },
      {
        label: "Generated Sites",
        value: totalSites.toString(),
        icon: FolderOutput,
        change: recentSites > 0 ? `+${recentSites} this month` : "No recent activity",
        isLoading: sitesLoading
      },
      {
        label: "Time Saved",
        value: `${timeSaved}h`,
        icon: Clock,
        change: "vs manual builds",
        isLoading: sitesLoading
      },
    ];
  }, [templates, sites, templatesLoading, sitesLoading]);

  // Get recent activity from sites and templates
  const recentActivity = useMemo(() => {
    const activities: Array<{ type: string; name: string; template: string | null; time: string; date: Date }> = [];

    // Add recent sites
    sites.slice(0, 3).forEach(site => {
      const createdDate = new Date(site.createdAt);
      activities.push({
        type: "generated",
        name: site.clientDetails?.companyName || site.slug,
        template: site.templateName,
        time: getRelativeTime(createdDate),
        date: createdDate
      });
    });

    // Add recently uploaded templates
    templates
      .filter(t => t.status === 'ready')
      .slice(0, 2)
      .forEach(template => {
        const createdDate = new Date(template.createdAt);
        activities.push({
          type: "template",
          name: template.name,
          template: null,
          time: getRelativeTime(createdDate),
          date: createdDate
        });
      });

    // Sort by date, most recent first
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);
  }, [sites, templates]);

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back to your Website Factory</p>
          </div>
          <Link href="/generator">
            <Button className="glow gap-2" data-testid="button-new-site">
              <Wand2 className="w-4 h-4" />
              Generate New Site
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass border-card-border hover:border-primary/30 transition-colors" data-testid={`stat-${stat.label.toLowerCase()}`}>
              <CardContent className="p-6">
                {stat.isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-20 mb-4"></div>
                    <div className="h-10 bg-muted rounded w-16 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-4xl font-display font-bold text-foreground mt-2">{stat.value}</p>
                      <p className="text-xs text-primary flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="glass border-card-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/templates" className="block">
                <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20 transition-all cursor-pointer group" data-testid="action-upload-template">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Upload New Template</p>
                        <p className="text-sm text-muted-foreground">Add a codebase to your template library</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
              
              <Link href="/generator" className="block">
                <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20 transition-all cursor-pointer group" data-testid="action-generate-site">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                        <Wand2 className="w-5 h-5 text-chart-2" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Generate New Site</p>
                        <p className="text-sm text-muted-foreground">Create a branded website from a template</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-chart-2 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
              
              <Link href="/generated" className="block">
                <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20 transition-all cursor-pointer group" data-testid="action-view-generated">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                        <FolderOutput className="w-5 h-5 text-chart-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">View Generated Sites</p>
                        <p className="text-sm text-muted-foreground">Access and download your projects</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-chart-4 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass border-card-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4" data-testid={`activity-${index}`}>
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'generated' ? 'bg-chart-2' : 'bg-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.type === 'generated' ? `Generated from ${activity.template}` : 'Template added'}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
