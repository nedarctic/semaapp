CREATE TYPE "public"."user_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'Handler';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'Inactive'::"public"."user_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE "public"."user_status" USING "status"::"public"."user_status";