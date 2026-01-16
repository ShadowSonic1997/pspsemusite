import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(), // URL to the ROM file
  platform: text("platform").notNull().default("psp"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameSchema = createInsertSchema(games).omit({ 
  id: true, 
  createdAt: true 
});

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
