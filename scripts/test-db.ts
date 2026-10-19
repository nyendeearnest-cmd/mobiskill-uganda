import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  try {
    const result = await prisma.$queryRaw<
      { database_name: string; connected: number }[]
    >`
      SELECT
        current_database() AS database_name,
        1 AS connected
    `;

    console.log("Database connection successful!");
    console.log(result);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();