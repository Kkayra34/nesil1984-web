import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Birimler: para her yerde KURUŞ (tam sayı), ağırlık her yerde MİLİGRAM (tam sayı).
// Böylece ondalık yuvarlama hatası olmaz. 12,5 gr = 12500 mg, 1.250,00 TL = 125000 kuruş.

export const metalEnum = pgEnum("metal", ["K8", "K14", "K18", "K22", "AG925"]);
export const collectionEnum = pgEnum("collection", ["DAILY", "SIGNATURE", "HERITAGE"]);
export const pricingModeEnum = pgEnum("pricing_mode", ["GRAM", "FIXED"]);
export const partKindEnum = pgEnum("part_kind", ["CHAIN", "CHARM", "CONNECTOR"]);
export const deliveryEnum = pgEnum("delivery", ["CARGO", "PICKUP"]);
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING_PAYMENT",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "CANCELLED",
]);
export const orderItemKindEnum = pgEnum("order_item_kind", ["PRODUCT", "DESIGN"]);
export const requestStatusEnum = pgEnum("request_status", ["NEW", "QUOTED", "CLOSED"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// Admin panelinden girilen güncel gram fiyatları (her maden için tek satır).
export const metalRates = pgTable("metal_rates", {
  metal: metalEnum("metal").primaryKey(),
  pricePerGramKurus: integer("price_per_gram_kurus").notNull(),
  updatedAt: timestamps.updatedAt,
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // ürün kodu, örn. KLY-0001
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  collection: collectionEnum("collection"),
  metal: metalEnum("metal").notNull(),
  pricingMode: pricingModeEnum("pricing_mode").notNull().default("GRAM"),
  // GRAM modunda: ağırlık × gram fiyatı + işçilik + taş
  weightMg: integer("weight_mg").notNull().default(0),
  laborKurus: integer("labor_kurus").notNull().default(0),
  stoneKurus: integer("stone_kurus").notNull().default(0),
  // FIXED modunda: doğrudan bu fiyat
  fixedPriceKurus: integer("fixed_price_kurus"),
  // İndirim öncesi gösterilecek fiyat (üstü çizili). Boşsa gösterilmez.
  compareAtKurus: integer("compare_at_kurus"),
  colors: text("colors").array().notNull().default([]), // "SARI" | "BEYAZ" | "ROSE"
  stones: text("stones").array().notNull().default([]), // "PIRLANTA" | "ZIRKON" | "INCI" | "DOGAL"
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  ...timestamps,
});

// Ölçü seçenekleri (zincir boyu, yüzük ölçüsü). Ölçüye göre ağırlık değişebilir.
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(), // "45 cm", "14 numara"
  weightMg: integer("weight_mg"), // boşsa ürünün ağırlığı kullanılır
  sortOrder: integer("sort_order").notNull().default(0),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Kendin Tasarla parçaları: zincir, charm, ara parça.
export const designParts = pgTable("design_parts", {
  id: serial("id").primaryKey(),
  kind: partKindEnum("kind").notNull(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  weightMg: integer("weight_mg").notNull(),
  laborKurus: integer("labor_kurus").notNull().default(0),
  stoneKurus: integer("stone_kurus").notNull().default(0),
  imageUrl: text("image_url"), // önizlemede üst üste konan şeffaf PNG
  thumbUrl: text("thumb_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNo: text("order_no").notNull().unique(), // müşteriye gösterilen numara, örn. N84-7K2Q9
  status: orderStatusEnum("status").notNull().default("PENDING_PAYMENT"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  delivery: deliveryEnum("delivery").notNull(),
  address: text("address"),
  city: text("city"),
  district: text("district"),
  note: text("note"),
  subtotalKurus: integer("subtotal_kurus").notNull(),
  shippingKurus: integer("shipping_kurus").notNull().default(0),
  totalKurus: integer("total_kurus").notNull(),
  paytrOid: text("paytr_oid").unique(), // PayTR merchant_oid
  paidAt: timestamp("paid_at", { withTimezone: true }),
  ...timestamps,
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  kind: orderItemKindEnum("kind").notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  // Sipariş anındaki bilgilerin kopyası: ürün sonradan değişse de sipariş bozulmaz.
  title: text("title").notNull(),
  metal: metalEnum("metal").notNull(),
  color: text("color"),
  variantLabel: text("variant_label"),
  design: jsonb("design"), // Kendin Tasarla: seçilen parçalar ve ağırlıkları
  unitPriceKurus: integer("unit_price_kurus").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

// Kişiye özel tasarım talepleri (isim kolyesi, harf, tarih...).
export const customRequests = pgTable("custom_requests", {
  id: serial("id").primaryKey(),
  status: requestStatusEnum("status").notNull().default("NEW"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  productType: text("product_type").notNull(),
  metal: metalEnum("metal"),
  details: text("details").notNull(),
  referenceUrl: text("reference_url"),
  adminNote: text("admin_note"),
  ...timestamps,
});

export const admins = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => [uniqueIndex("admins_email_idx").on(t.email)],
);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  variants: many(productVariants),
  images: many(productImages),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));
