CREATE TYPE "public"."collection" AS ENUM('DAILY', 'SIGNATURE', 'HERITAGE');--> statement-breakpoint
CREATE TYPE "public"."delivery" AS ENUM('CARGO', 'PICKUP');--> statement-breakpoint
CREATE TYPE "public"."metal" AS ENUM('K8', 'K14', 'K18', 'K22', 'AG925');--> statement-breakpoint
CREATE TYPE "public"."order_item_kind" AS ENUM('PRODUCT', 'DESIGN');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PENDING_PAYMENT', 'PAID', 'PREPARING', 'SHIPPED', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."part_kind" AS ENUM('CHAIN', 'CHARM', 'CONNECTOR');--> statement-breakpoint
CREATE TYPE "public"."pricing_mode" AS ENUM('GRAM', 'FIXED');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('NEW', 'QUOTED', 'CLOSED');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "custom_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "request_status" DEFAULT 'NEW' NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"product_type" text NOT NULL,
	"metal" "metal",
	"details" text NOT NULL,
	"reference_url" text,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_parts" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "part_kind" NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"weight_mg" integer NOT NULL,
	"labor_kurus" integer DEFAULT 0 NOT NULL,
	"stone_kurus" integer DEFAULT 0 NOT NULL,
	"image_url" text,
	"thumb_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "design_parts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "metal_rates" (
	"metal" "metal" PRIMARY KEY NOT NULL,
	"price_per_gram_kurus" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"kind" "order_item_kind" NOT NULL,
	"product_id" integer,
	"title" text NOT NULL,
	"metal" "metal" NOT NULL,
	"color" text,
	"variant_label" text,
	"design" jsonb,
	"unit_price_kurus" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_no" text NOT NULL,
	"status" "order_status" DEFAULT 'PENDING_PAYMENT' NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"delivery" "delivery" NOT NULL,
	"address" text,
	"city" text,
	"district" text,
	"note" text,
	"subtotal_kurus" integer NOT NULL,
	"shipping_kurus" integer DEFAULT 0 NOT NULL,
	"total_kurus" integer NOT NULL,
	"paytr_oid" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_no_unique" UNIQUE("order_no"),
	CONSTRAINT "orders_paytr_oid_unique" UNIQUE("paytr_oid")
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"label" text NOT NULL,
	"weight_mg" integer,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"category_id" integer,
	"collection" "collection",
	"metal" "metal" NOT NULL,
	"pricing_mode" "pricing_mode" DEFAULT 'GRAM' NOT NULL,
	"weight_mg" integer DEFAULT 0 NOT NULL,
	"labor_kurus" integer DEFAULT 0 NOT NULL,
	"stone_kurus" integer DEFAULT 0 NOT NULL,
	"fixed_price_kurus" integer,
	"compare_at_kurus" integer,
	"colors" text[] DEFAULT '{}' NOT NULL,
	"stones" text[] DEFAULT '{}' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_code_unique" UNIQUE("code"),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");