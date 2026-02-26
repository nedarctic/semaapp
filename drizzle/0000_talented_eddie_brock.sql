CREATE TYPE "public"."attachment_uploader" AS ENUM('Reporter', 'Handler');--> statement-breakpoint
CREATE TYPE "public"."incident_status" AS ENUM('New', 'In Review', 'Investigation', 'Resolved', 'Closed');--> statement-breakpoint
CREATE TYPE "public"."reporter_type" AS ENUM('Anonymous', 'Confidential');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('Admin', 'Handler');--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"uploaded_by" "attachment_uploader" NOT NULL,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"category_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"reporting_link_slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"incident_id_display" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"involved_people" text,
	"incident_date" text NOT NULL,
	"reporter_type" "reporter_type" NOT NULL,
	"reporter_id" uuid NOT NULL,
	"status" "incident_status" NOT NULL,
	"assigned_handler_id" uuid,
	"deadline_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone,
	CONSTRAINT "incidents_incident_id_display_unique" UNIQUE("incident_id_display")
);
--> statement-breakpoint
CREATE TABLE "reporters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"incident_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reporting_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"title" text,
	"intro_content" text,
	"policy_url" text
);
--> statement-breakpoint
CREATE TABLE "secret_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"secret_code_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"users" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"role" "user_role",
	"status" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
