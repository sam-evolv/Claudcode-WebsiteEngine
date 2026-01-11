import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Template,
  type InsertTemplate,
  type GeneratedSite,
  type InsertGeneratedSite,
  users,
  templates,
  generatedSites
} from "@shared/schema";
import * as schema from "@shared/schema";
import { mkdir } from "fs/promises";
import { dirname } from "path";

const DATABASE_PATH = process.env.DATABASE_URL || "./data/database.db";

// Initialize storage - ensure data directory exists
let db: ReturnType<typeof drizzle>;
let isInitialized = false;

export async function initStorage() {
  if (isInitialized) return;

  await mkdir(dirname(DATABASE_PATH), { recursive: true });
  const sqlite = new Database(DATABASE_PATH);
  db = drizzle(sqlite, { schema });
  isInitialized = true;
}

export { db };

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Templates
  getAllTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  incrementTemplateUsage(id: string): Promise<void>;

  // Generated Sites
  getAllGeneratedSites(): Promise<GeneratedSite[]>;
  getGeneratedSite(id: string): Promise<GeneratedSite | undefined>;
  getGeneratedSiteBySlug(slug: string): Promise<GeneratedSite | undefined>;
  createGeneratedSite(site: InsertGeneratedSite): Promise<GeneratedSite>;
  deleteGeneratedSite(id: string): Promise<boolean>;
}

export class SqliteStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.id, id)
    });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Templates
  async getAllTemplates(): Promise<Template[]> {
    return await db.query.templates.findMany({
      orderBy: (templates, { desc }) => [desc(templates.createdAt)]
    });
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return await db.query.templates.findFirst({
      where: eq(templates.id, id)
    });
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [created] = await db.insert(templates).values(template).returning();
    return created;
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined> {
    const [updated] = await db.update(templates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return updated;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await db.delete(templates).where(eq(templates.id, id));
    return result.changes > 0;
  }

  async incrementTemplateUsage(id: string): Promise<void> {
    const template = await this.getTemplate(id);
    if (template) {
      await db.update(templates)
        .set({ usageCount: template.usageCount + 1 })
        .where(eq(templates.id, id));
    }
  }

  // Generated Sites
  async getAllGeneratedSites(): Promise<GeneratedSite[]> {
    return await db.query.generatedSites.findMany({
      orderBy: (generatedSites, { desc }) => [desc(generatedSites.createdAt)]
    });
  }

  async getGeneratedSite(id: string): Promise<GeneratedSite | undefined> {
    return await db.query.generatedSites.findFirst({
      where: eq(generatedSites.id, id)
    });
  }

  async getGeneratedSiteBySlug(slug: string): Promise<GeneratedSite | undefined> {
    return await db.query.generatedSites.findFirst({
      where: eq(generatedSites.slug, slug)
    });
  }

  async createGeneratedSite(site: InsertGeneratedSite): Promise<GeneratedSite> {
    const [created] = await db.insert(generatedSites).values(site).returning();
    return created;
  }

  async deleteGeneratedSite(id: string): Promise<boolean> {
    const result = await db.delete(generatedSites).where(eq(generatedSites.id, id));
    return result.changes > 0;
  }
}

export const storage = new SqliteStorage();
