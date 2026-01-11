import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, initStorage } from "./storage";
import multer from "multer";
import { join } from "path";
import { unlink } from "fs/promises";
import {
  ensureDataDirectories,
  extractZip,
  createZip,
  copyDirectory,
  getTemplatePaths,
  getGeneratedSitePath,
  generateSlug,
  writeJsonFile,
  UPLOADS_DIR,
  removeDirectory,
} from "./filesystem";
import {
  analyzeTemplate,
  createTemplateSpec,
  validateTemplateCompatibility,
} from "./template-analyzer";
import { GenerationEngine } from "./generation-engine";

// Configure multer for file uploads
const upload = multer({
  dest: UPLOADS_DIR,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize storage and ensure data directories exist
  await initStorage();
  await ensureDataDirectories();
  // ==================== TEMPLATES ====================

  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get single template
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Upload and process template
  app.post("/api/templates/upload", upload.single("file"), async (req, res) => {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { name, description, tags } = req.body;

    if (!name || !description) {
      await unlink(uploadedFile.path);
      return res.status(400).json({ message: "Name and description are required" });
    }

    const templateId = generateSlug(name);
    const templatePaths = getTemplatePaths(templateId);

    try {
      // Check if template already exists
      const existing = await storage.getTemplate(templateId);
      if (existing) {
        await unlink(uploadedFile.path);
        return res.status(400).json({ message: "Template with this name already exists" });
      }

      // Create initial template record
      const template = await storage.createTemplate({
        id: templateId,
        name,
        description,
        tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
        frameworkType: "unknown",
        status: "processing",
        statusMessage: "Extracting and analyzing template...",
        templateSpec: null,
        usageCount: 0,
      });

      // Process template asynchronously
      processTemplate(uploadedFile.path, templateId, name, description, tags)
        .then(() => console.log(`Template ${templateId} processed successfully`))
        .catch((error) => console.error(`Error processing template ${templateId}:`, error));

      res.json(template);
    } catch (error) {
      console.error("Error uploading template:", error);
      await unlink(uploadedFile.path);
      res.status(500).json({ message: "Failed to upload template" });
    }
  });

  // Delete template
  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplate(id);

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Delete template directories
      const templatePaths = getTemplatePaths(id);
      await removeDirectory(templatePaths.raw);
      await removeDirectory(templatePaths.standard);

      // Delete from database
      await storage.deleteTemplate(id);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // ==================== GENERATION ====================

  // Generate new site
  app.post("/api/generate", async (req, res) => {
    try {
      const { templateId, slug, clientDetails, brandInputs, sections } = req.body;

      // Validate inputs
      if (!templateId || !slug || !clientDetails || !brandInputs) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if template exists
      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      if (template.status !== "ready") {
        return res.status(400).json({ message: "Template is not ready for use" });
      }

      // Check if slug already exists
      const existing = await storage.getGeneratedSiteBySlug(slug);
      if (existing) {
        return res.status(400).json({ message: "A site with this slug already exists" });
      }

      // Generate the site
      const engine = new GenerationEngine();
      const result = await engine.generate({
        templateId,
        slug,
        clientDetails,
        brandInputs,
        sections: sections || [],
      });

      if (!result.success) {
        return res.status(500).json({
          message: "Generation failed",
          logs: result.logs,
        });
      }

      // Save to database
      const generatedSite = await storage.createGeneratedSite({
        slug,
        templateId,
        templateName: template.name,
        clientDetails,
        brandInputs,
        sections: sections || [],
        outputPath: result.outputPath,
      });

      // Increment template usage count
      await storage.incrementTemplateUsage(templateId);

      res.json({
        success: true,
        site: generatedSite,
        logs: result.logs,
      });
    } catch (error) {
      console.error("Error generating site:", error);
      res.status(500).json({ message: "Failed to generate site" });
    }
  });

  // ==================== GENERATED SITES ====================

  // Get all generated sites
  app.get("/api/generated-sites", async (req, res) => {
    try {
      const sites = await storage.getAllGeneratedSites();
      res.json(sites);
    } catch (error) {
      console.error("Error fetching generated sites:", error);
      res.status(500).json({ message: "Failed to fetch generated sites" });
    }
  });

  // Get single generated site
  app.get("/api/generated-sites/:id", async (req, res) => {
    try {
      const site = await storage.getGeneratedSite(req.params.id);
      if (!site) {
        return res.status(404).json({ message: "Generated site not found" });
      }
      res.json(site);
    } catch (error) {
      console.error("Error fetching generated site:", error);
      res.status(500).json({ message: "Failed to fetch generated site" });
    }
  });

  // Download generated site as zip
  app.get("/api/generated-sites/:id/download", async (req, res) => {
    try {
      const site = await storage.getGeneratedSite(req.params.id);
      if (!site) {
        return res.status(404).json({ message: "Generated site not found" });
      }

      const zipPath = join(UPLOADS_DIR, `${site.slug}.zip`);
      await createZip(site.outputPath, zipPath);

      res.download(zipPath, `${site.slug}.zip`, async (err) => {
        if (err) {
          console.error("Error downloading file:", err);
        }
        // Clean up zip file after download
        await unlink(zipPath).catch(() => {});
      });
    } catch (error) {
      console.error("Error downloading generated site:", error);
      res.status(500).json({ message: "Failed to download site" });
    }
  });

  // Delete generated site
  app.delete("/api/generated-sites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const site = await storage.getGeneratedSite(id);

      if (!site) {
        return res.status(404).json({ message: "Generated site not found" });
      }

      // Delete site directory
      await removeDirectory(site.outputPath);

      // Delete from database
      await storage.deleteGeneratedSite(id);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting generated site:", error);
      res.status(500).json({ message: "Failed to delete generated site" });
    }
  });

  return httpServer;
}

// ==================== HELPER FUNCTIONS ====================

async function processTemplate(
  uploadedFilePath: string,
  templateId: string,
  name: string,
  description: string,
  tags: string
) {
  const templatePaths = getTemplatePaths(templateId);

  try {
    // Extract to raw directory
    await extractZip(uploadedFilePath, templatePaths.raw);
    await unlink(uploadedFilePath);

    // Analyze template
    const analysis = await analyzeTemplate(templatePaths.raw);

    // Validate compatibility
    const compatibility = validateTemplateCompatibility(analysis);

    if (!compatibility.valid) {
      await storage.updateTemplate(templateId, {
        status: "error",
        statusMessage: `Template is not compatible: ${compatibility.reasons.join(", ")}`,
      });
      return;
    }

    // Create standard template
    await copyDirectory(templatePaths.raw, templatePaths.standard);

    // Create template spec
    const spec = createTemplateSpec(
      templateId,
      name,
      description,
      analysis
    );

    await writeJsonFile(templatePaths.spec, spec);

    // Create content directory structure
    const contentDir = join(templatePaths.standard, "content");
    await writeJsonFile(join(contentDir, "site.json"), {
      site: {
        name: "Example Company",
        domain: "example.com",
        tagline: "Your tagline here",
      },
      contact: {
        email: "contact@example.com",
        phone: "1-800-555-0123",
        address: "123 Main St, City, State 12345",
      },
    });

    await writeJsonFile(join(contentDir, "sections.json"), {
      sections: spec.sections,
      enabled: spec.sections.filter(s => s.enabled).map(s => s.id),
    });

    // Update template status
    await storage.updateTemplate(templateId, {
      status: "ready",
      statusMessage: null,
      frameworkType: spec.frameworkType,
      templateSpec: spec,
    });
  } catch (error) {
    console.error(`Error processing template ${templateId}:`, error);
    await storage.updateTemplate(templateId, {
      status: "error",
      statusMessage: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
