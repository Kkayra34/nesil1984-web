import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

// Betikler Next dışında çalıştığı için src/db/index.ts (server-only) yerine bunu kullanır.
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL tanımlı değil (.env).");

export const db = drizzle({ client: neon(url), schema });
export { schema };
