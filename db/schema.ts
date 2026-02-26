import { pgTable, varchar, timestamp, uuid, text, pgEnum, date } from "drizzle-orm/pg-core";

export const incidentStatusEnum = pgEnum("incident_status", [
    "New",
    "In Review",
    "Investigation",
    "Resolved",
    "Closed"
]);

export const reporterTypeEnum = pgEnum("reporter_type", [
    "Anonymous",
    "Confidential",
]);

export const userRoleEnum = pgEnum("user_role", [
    "Admin",
    "Handler"
]);

export const userStatusEnum = pgEnum("user_status", [
    "Active",
    "Inactive"
]);

export const users = pgTable("users", {
    id: uuid("users").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull(),
    name: text("name"),
    email: text("email").notNull(),
    password: text("password"),
    role: userRoleEnum("role").default("Handler"),
    status: userStatusEnum("status").default("Inactive"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reporters = pgTable("reporters", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    incidentId: uuid("incident_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const incidents = pgTable("incidents", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull(),
    incidentIdDisplay: text("incident_id_display").notNull().unique(),
    category: text("category").notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    involvedPeople: text("involved_people"),
    incidentDate: text("incident_date").notNull(),
    reporterType: reporterTypeEnum("reporter_type").notNull(),
    reporterId: uuid("reporter_id").notNull(),
    status: incidentStatusEnum("status").notNull(),
    assignedHandlerId: uuid("assigned_handler_id"),
    secretCodeHash: text("secret_code_hash").notNull(),
    deadlineAt: timestamp("deadline_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
    closedAt: timestamp("closed_at", { withTimezone: true }), 
});

export const companies = pgTable("companies", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    reportingLinkSlug: text("reporting_link_slug"),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const secretCodes = pgTable("secret_codes", {
    id: uuid("id").defaultRandom().primaryKey(),
    incidentId: uuid("incident_id").notNull(),
    secretCodeHash: text("secret_code_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attachmentUploaderTypeEnum = pgEnum("attachment_uploader", [
    "Reporter",
    "Handler"
]);

export const attachments = pgTable("attachments", {
    id: uuid("id").defaultRandom().primaryKey(),
    incidentId: uuid("incident_id").notNull(),
    uploadedBy: attachmentUploaderTypeEnum("uploaded_by").notNull(),
    fileName: text("file_name").notNull(),
    filePath: text("file_path").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull(),
    categoryName: text("category_name").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reportingPages = pgTable("reporting_pages", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull(),
    title: text("title"),
    introContent: text("intro_content"),
    policyUrl: text("policy_url"),
});

export const senderTypeEnum = pgEnum("sender_type", [
    "Reporter",
    "Handler",
]);

export const messages = pgTable("messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    incidentId: uuid("incident_id").notNull(),
    senderType: senderTypeEnum("sender_type").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});