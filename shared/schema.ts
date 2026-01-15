import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

function generateId() {
  return crypto.randomUUID();
}

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const templates = sqliteTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tags: text("tags", { mode: "json" }).notNull().$type<string[]>(),
  frameworkType: text("framework_type").notNull(),
  status: text("status").notNull().$type<'ready' | 'processing' | 'error'>(),
  statusMessage: text("status_message"),
  templateSpec: text("template_spec", { mode: "json" }).$type<Record<string, any>>(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  usageCount: integer("usage_count").notNull().default(0),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export const generatedSites = sqliteTable("generated_sites", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  slug: text("slug").notNull().unique(),
  templateId: text("template_id").notNull().references(() => templates.id),
  templateName: text("template_name").notNull(),
  clientDetails: text("client_details", { mode: "json" }).notNull().$type<Record<string, any>>(),
  brandInputs: text("brand_inputs", { mode: "json" }).notNull().$type<Record<string, any>>(),
  sections: text("sections", { mode: "json" }).notNull().$type<Array<{id: string, enabled: boolean, order: number}>>(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  outputPath: text("output_path").notNull(),
});

export const insertGeneratedSiteSchema = createInsertSchema(generatedSites).omit({
  id: true,
  createdAt: true,
});

export type InsertGeneratedSite = z.infer<typeof insertGeneratedSiteSchema>;
export type GeneratedSite = typeof generatedSites.$inferSelect;
