import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon,
  Folder,
  Database,
  Bell,
  Shield,
  Palette
} from "lucide-react";

export default function Settings() {
  return (
    <AppLayout>
      <div className="p-8 space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your Website Factory preferences</p>
        </div>

        <div className="space-y-6">
          <Card className="glass border-card-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Folder className="w-5 h-5 text-primary" />
                Storage Paths
              </CardTitle>
              <CardDescription>Configure where templates and generated sites are stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templates-path">Templates Directory</Label>
                <Input 
                  id="templates-path" 
                  defaultValue="/data/templates"
                  className="font-mono text-sm"
                  data-testid="input-templates-path"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generated-path">Generated Sites Directory</Label>
                <Input 
                  id="generated-path" 
                  defaultValue="/data/generated"
                  className="font-mono text-sm"
                  data-testid="input-generated-path"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-card-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Default Brand Settings
              </CardTitle>
              <CardDescription>Set default values for new site generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-heading-font">Default Heading Font</Label>
                  <Input 
                    id="default-heading-font" 
                    defaultValue="Space Grotesk"
                    data-testid="input-default-heading-font"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-body-font">Default Body Font</Label>
                  <Input 
                    id="default-body-font" 
                    defaultValue="Inter"
                    data-testid="input-default-body-font"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-style">Default Style Preset</Label>
                <Input 
                  id="default-style" 
                  defaultValue="EvolvAI Premium Dark"
                  data-testid="input-default-style"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-card-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Template Validation
              </CardTitle>
              <CardDescription>Configure template ingestion rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Strict Mode</p>
                  <p className="text-sm text-muted-foreground">Reject templates that don't fully conform to spec</p>
                </div>
                <Switch defaultChecked data-testid="toggle-strict-mode" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-fix Common Issues</p>
                  <p className="text-sm text-muted-foreground">Automatically resolve minor compatibility issues</p>
                </div>
                <Switch defaultChecked data-testid="toggle-auto-fix" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Framework Allowlist</p>
                  <p className="text-sm text-muted-foreground">Only accept Next.js + Tailwind templates</p>
                </div>
                <Switch defaultChecked data-testid="toggle-framework-allowlist" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-card-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Configure alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Generation Complete</p>
                  <p className="text-sm text-muted-foreground">Notify when site generation finishes</p>
                </div>
                <Switch defaultChecked data-testid="toggle-notify-generation" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Template Errors</p>
                  <p className="text-sm text-muted-foreground">Notify when template ingestion fails</p>
                </div>
                <Switch defaultChecked data-testid="toggle-notify-errors" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-card-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your factory data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Export All Data</p>
                  <p className="text-sm text-muted-foreground">Download templates and configuration as ZIP</p>
                </div>
                <Button variant="outline" data-testid="button-export-data">Export</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Clear Generated Sites</p>
                  <p className="text-sm text-muted-foreground">Remove all generated projects (keeps templates)</p>
                </div>
                <Button variant="outline" className="text-destructive hover:text-destructive" data-testid="button-clear-generated">Clear</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="glow" data-testid="button-save-settings">Save Settings</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
