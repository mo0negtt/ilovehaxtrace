import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const tileSchema = z.object({
  x: z.number(),
  y: z.number(),
  color: z.string(),
  tileId: z.string().optional(),
});

export const layerSchema = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  locked: z.boolean(),
  tiles: z.array(tileSchema),
  opacity: z.number().min(0).max(100).default(100),
});

export const mapSchema = z.object({
  id: z.string(),
  name: z.string(),
  width: z.number().min(1),
  height: z.number().min(1),
  tileSize: z.number().min(1),
  layers: z.array(layerSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertMapSchema = mapSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Tile = z.infer<typeof tileSchema>;
export type Layer = z.infer<typeof layerSchema>;
export type GameMap = z.infer<typeof mapSchema>;
export type InsertMap = z.infer<typeof insertMapSchema>;
