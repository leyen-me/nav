import "dotenv/config";
import { defineConfig, env } from "prisma/config";

let DATABASE_URL = "";
try {
  DATABASE_URL = env("DATABASE_URL");
} catch (error) {
  // console.error(error);
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: DATABASE_URL,
  },
});
