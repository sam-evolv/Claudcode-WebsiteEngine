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

const stats = [
  { label: "Templates", value: "5", icon: Layers, change: "+2 this week" },
  { label: "Generated Sites", value: "23", icon: FolderOutput, change: "+8 this month" },
  { label: "Time Saved", value: "147h", icon: Clock, change: "vs manual builds" },
];

const recentActivity = [
  { type: "generated", name: "Elite Plumbing Pro", template: "Trade Premium Dark", time: "2 hours ago" },
  { type: "template", name: "Modern SaaS Landing", template: null, time: "Yesterday" },
  { type: "generated", name: "Smith & Sons Electric", template: "Trade Premium Dark", time: "2 days ago" },
  { type: "generated", name: "Coastal Roofing", template: "Clean Light Business", time: "3 days ago" },
];

export default function Dashboard() {
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
