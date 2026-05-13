import { pgTable, serial, varchar, timestamp, text, integer } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const Projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectId: varchar("project_id", { length: 255 }).notNull().unique(),
  createdBy: varchar("created_by", { length: 255 }).notNull(), // clerkId
  videoUrl: text("video_url"),
  transcription: text("transcription"),
  captions: text("captions"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const VideoShorts = pgTable("video_shorts", {
  id: serial("id").primaryKey(),
  projectId: varchar("project_id", { length: 255 }).notNull(),
  startTime: integer("start_time").notNull(), 
  endTime: integer("end_time").notNull(),
  reason: text("reason"),
  seoScore: integer("seo_score"),
  captions: text("captions"),
  videoUrl: text("video_url"), // Exported video URL
  captionStyle: text("caption_style"),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
