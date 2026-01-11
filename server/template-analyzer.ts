import { readdir, readFile } from "fs/promises";
import { join, basename } from "path";
import { exists, readJsonFile, findFiles } from "./filesystem";

export interface AnalysisResult {
  success: boolean;
  frameworkType?: string;
  errors: string[];
  warnings: string[];
  detectedFiles: {
    packageJson?: boolean;
    tailwindConfig?: boolean;
    nextConfig?: boolean;
    viteConfig?: boolean;
    tsConfig?: boolean;
    publicDir?: boolean;
    srcDir?: boolean;
  };
  themeLocations: {
    tailwindConfig?: string;
    cssVariables?: string[];
    colorScheme?: string;
  };
  contentLocations: string[];
}

export interface TemplateSpec {
  templateId: string;
  name: string;
  description: string;
  frameworkType: string;
  version: string;
  tokens: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      muted: string;
      border: string;
    };
    typography: {
      fontFamilyHeading: string;
      fontFamilyBody: string;
      baseFontSize: string;
    };
    spacing: {
      layoutMaxWidth: string;
      borderRadius: string;
    };
  };
  sections: Array<{
    id: string;
    label: string;
    enabled: boolean;
    order: number;
    contentFields: string[];
    mediaFields: string[];
  }>;
  fileMap: {
    logo: string;
    heroMedia: string;
    contentJson: string;
    themeConfig: string;
    cssVariables: string;
  };
  replacementStrategy: {
    colors: "tailwind" | "css-variables" | "both";
    typography: "tailwind" | "css-variables" | "both";
    content: "json-file" | "component-props";
  };
}

/**
 * Analyze a template directory to detect framework and structure
 */
export async function analyzeTemplate(templateDir: string): Promise<AnalysisResult> {
  const result: AnalysisResult = {
    success: false,
    errors: [],
    warnings: [],
    detectedFiles: {},
    themeLocations: {},
    contentLocations: [],
  };

  // Check for package.json
  const packageJsonPath = join(templateDir, "package.json");
  if (await exists(packageJsonPath)) {
    result.detectedFiles.packageJson = true;
    try {
      const packageJson = await readJsonFile(packageJsonPath);

      // Detect framework
      if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
        result.frameworkType = "nextjs-app";
      } else if (packageJson.dependencies?.vite || packageJson.devDependencies?.vite) {
        result.frameworkType = "vite-react";
      } else if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
        result.frameworkType = "react";
      }
    } catch (e) {
      result.errors.push("Invalid package.json file");
    }
  } else {
    result.errors.push("No package.json found - not a valid Node.js project");
    return result;
  }

  // Check for Tailwind config
  const tailwindConfigs = ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.mjs"];
  for (const configFile of tailwindConfigs) {
    if (await exists(join(templateDir, configFile))) {
      result.detectedFiles.tailwindConfig = true;
      result.themeLocations.tailwindConfig = configFile;
      break;
    }
  }

  if (!result.detectedFiles.tailwindConfig) {
    result.errors.push("No Tailwind config found - template must use Tailwind CSS");
    return result;
  }

  // Check for Next.js config (if Next.js detected)
  if (result.frameworkType === "nextjs-app") {
    const nextConfigs = ["next.config.js", "next.config.ts", "next.config.mjs"];
    for (const configFile of nextConfigs) {
      if (await exists(join(templateDir, configFile))) {
        result.detectedFiles.nextConfig = true;
        break;
      }
    }
  }

  // Check for TypeScript
  if (await exists(join(templateDir, "tsconfig.json"))) {
    result.detectedFiles.tsConfig = true;
  } else {
    result.warnings.push("No TypeScript configuration found - TypeScript is recommended");
  }

  // Check for source directory
  const srcDirs = ["src", "app", "pages"];
  for (const dir of srcDirs) {
    if (await exists(join(templateDir, dir))) {
      result.detectedFiles.srcDir = true;
      break;
    }
  }

  // Find CSS files with variables
  const cssFiles = await findFiles(templateDir, /\.(css|scss)$/);
  const cssVariableFiles: string[] = [];

  for (const cssFile of cssFiles) {
    const content = await readFile(cssFile, 'utf-8');
    if (content.includes('--') || content.includes(':root')) {
      cssVariableFiles.push(cssFile.replace(templateDir + '/', ''));
    }
  }

  result.themeLocations.cssVariables = cssVariableFiles;

  // Check for public/static directory
  const publicDirs = ["public", "static"];
  for (const dir of publicDirs) {
    if (await exists(join(templateDir, dir))) {
      result.detectedFiles.publicDir = true;
      break;
    }
  }

  // Look for content files
  const contentFiles = await findFiles(templateDir, /\.(json|md|mdx)$/);
  result.contentLocations = contentFiles
    .map(f => f.replace(templateDir + '/', ''))
    .filter(f => !f.includes('node_modules') && !f.includes('package.json'));

  // Final validation
  if (result.errors.length === 0) {
    result.success = true;
  }

  return result;
}

/**
 * Create a standard template spec from analysis
 */
export function createTemplateSpec(
  templateId: string,
  name: string,
  description: string,
  analysis: AnalysisResult
): TemplateSpec {
  const spec: TemplateSpec = {
    templateId,
    name,
    description,
    frameworkType: analysis.frameworkType || "nextjs-app",
    version: "1.0.0",
    tokens: {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#f59e0b",
        background: "#ffffff",
        surface: "#f9fafb",
        text: "#111827",
        muted: "#6b7280",
        border: "#e5e7eb",
      },
      typography: {
        fontFamilyHeading: "Inter",
        fontFamilyBody: "Inter",
        baseFontSize: "16px",
      },
      spacing: {
        layoutMaxWidth: "1280px",
        borderRadius: "0.5rem",
      },
    },
    sections: [
      { id: "hero", label: "Hero Section", enabled: true, order: 1, contentFields: ["title", "subtitle", "cta"], mediaFields: ["background"] },
      { id: "services", label: "Services", enabled: true, order: 2, contentFields: ["title", "description", "items"], mediaFields: [] },
      { id: "about", label: "About Us", enabled: true, order: 3, contentFields: ["title", "description"], mediaFields: ["image"] },
      { id: "testimonials", label: "Testimonials", enabled: false, order: 4, contentFields: ["title", "items"], mediaFields: [] },
      { id: "gallery", label: "Gallery", enabled: false, order: 5, contentFields: ["title"], mediaFields: ["images"] },
      { id: "faq", label: "FAQ", enabled: false, order: 6, contentFields: ["title", "items"], mediaFields: [] },
      { id: "contact", label: "Contact", enabled: true, order: 7, contentFields: ["title", "email", "phone", "address"], mediaFields: [] },
      { id: "footer", label: "Footer", enabled: true, order: 8, contentFields: ["copyright", "links"], mediaFields: [] },
    ],
    fileMap: {
      logo: "public/logo.svg",
      heroMedia: "public/hero.jpg",
      contentJson: "content/site.json",
      themeConfig: analysis.themeLocations.tailwindConfig || "tailwind.config.ts",
      cssVariables: analysis.themeLocations.cssVariables?.[0] || "src/app/globals.css",
    },
    replacementStrategy: {
      colors: "both",
      typography: "both",
      content: "json-file",
    },
  };

  return spec;
}

/**
 * Validate template compatibility
 */
export function validateTemplateCompatibility(analysis: AnalysisResult): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (!analysis.detectedFiles.packageJson) {
    reasons.push("Missing package.json");
  }

  if (!analysis.detectedFiles.tailwindConfig) {
    reasons.push("Missing Tailwind CSS configuration");
  }

  if (!analysis.frameworkType) {
    reasons.push("Could not detect framework type");
  }

  if (analysis.frameworkType && !["nextjs-app", "vite-react"].includes(analysis.frameworkType)) {
    reasons.push(`Framework '${analysis.frameworkType}' is not supported in MVP (only nextjs-app and vite-react)`);
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
