import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { betterAuthOptions } from "./options";
import { openAPI } from "better-auth/plugins";

import * as schema from "../../db/schema";

export const auth = (
  env: CloudflareBindings
): ReturnType<typeof betterAuth> => {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  return betterAuth({
    ...betterAuthOptions,
    database: drizzleAdapter(db, { provider: "pg", schema }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    plugins: [openAPI()],
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: ["http://localhost:5173", "http://127.0.0.1:8787"],
  });
};
