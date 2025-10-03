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

export const vertexSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const segmentSchema = z.object({
  v0: z.number(),
  v1: z.number(),
  color: z.string().optional(),
  curve: z.number().optional(),
});

export const mapSchema = z.object({
  id: z.string(),
  name: z.string(),
  width: z.number().min(1),
  height: z.number().min(1),
  bg: z.object({
    color: z.string(),
  }),
  vertexes: z.array(vertexSchema),
  segments: z.array(segmentSchema),
});

export const insertMapSchema = mapSchema.omit({ id: true });

export type Vertex = z.infer<typeof vertexSchema>;
export type Segment = z.infer<typeof segmentSchema>;
export type HaxMap = z.infer<typeof mapSchema>;
export type InsertMap = z.infer<typeof insertMapSchema>;
