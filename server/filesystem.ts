import { mkdir, readFile, writeFile, cp, rm, readdir, stat } from "fs/promises";
import { join, dirname, basename } from "path";
import { createReadStream, createWriteStream } from "fs";
import { createGunzip } from "zlib";
import { Extract } from "unzipper";
import archiver from "archiver";
import { pipeline } from "stream/promises";

export const DATA_DIR = "./data";
export const TEMPLATES_RAW_DIR = join(DATA_DIR, "templates/raw");
export const TEMPLATES_STANDARD_DIR = join(DATA_DIR, "templates/standard");
export const GENERATED_DIR = join(DATA_DIR, "generated");
export const UPLOADS_DIR = join(DATA_DIR, "uploads");

// Ensure all data directories exist
export async function ensureDataDirectories() {
  await mkdir(TEMPLATES_RAW_DIR, { recursive: true });
  await mkdir(TEMPLATES_STANDARD_DIR, { recursive: true });
  await mkdir(GENERATED_DIR, { recursive: true });
  await mkdir(UPLOADS_DIR, { recursive: true });
}

/**
 * Extract a zip file to a destination directory
 */
export async function extractZip(zipPath: string, destDir: string): Promise<void> {
  await mkdir(destDir, { recursive: true });

  return new Promise((resolve, reject) => {
    createReadStream(zipPath)
      .pipe(Extract({ path: destDir }))
      .on('close', resolve)
      .on('error', reject);
  });
}

/**
 * Create a zip archive from a directory
 */
export async function createZip(sourceDir: string, outputPath: string): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

/**
 * Copy directory recursively
 */
export async function copyDirectory(src: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true });
  await cp(src, dest, { recursive: true });
}

/**
 * Remove directory recursively
 */
export async function removeDirectory(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
}

/**
 * Check if a file or directory exists
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a JSON file
 */
export async function readJsonFile<T = any>(path: string): Promise<T> {
  const content = await readFile(path, 'utf-8');
  return JSON.parse(content);
}

/**
 * Write a JSON file
 */
export async function writeJsonFile(path: string, data: any): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Read all files in a directory
 */
export async function listFiles(dir: string, recursive = false): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && recursive) {
      files.push(...await listFiles(fullPath, true));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Find all files matching a pattern in a directory
 */
export async function findFiles(dir: string, pattern: RegExp): Promise<string[]> {
  const allFiles = await listFiles(dir, true);
  return allFiles.filter(file => pattern.test(file));
}

/**
 * Get directory size in bytes
 */
export async function getDirectorySize(dir: string): Promise<number> {
  const files = await listFiles(dir, true);
  let totalSize = 0;

  for (const file of files) {
    const stats = await stat(file);
    totalSize += stats.size;
  }

  return totalSize;
}

/**
 * Generate a safe slug from a string
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get template paths for a given template ID
 */
export function getTemplatePaths(templateId: string) {
  return {
    raw: join(TEMPLATES_RAW_DIR, templateId),
    standard: join(TEMPLATES_STANDARD_DIR, templateId),
    spec: join(TEMPLATES_STANDARD_DIR, templateId, 'template.json'),
  };
}

/**
 * Get generated site path for a given slug
 */
export function getGeneratedSitePath(slug: string): string {
  return join(GENERATED_DIR, slug);
}
