/**
 * Wraps `prisma migrate deploy` with a few retries.
 *
 * Neon's serverless compute suspends after inactivity and occasionally takes
 * a few seconds longer to wake up than Prisma's connection attempt waits for,
 * which fails the whole Vercel build with P1001 ("Can't reach database
 * server"). A short retry with backoff absorbs that cold-start delay instead
 * of requiring a manual redeploy.
 *
 * Only retries on connection errors (P1001/P1002/P1017) - any other failure
 * (e.g. a genuinely broken migration) fails immediately, since retrying
 * would just repeat the same real error.
 */
import { spawnSync } from "node:child_process";

const MAX_ATTEMPTS = 4;
const RETRYABLE_CODES = ["P1001", "P1002", "P1017"];
const BACKOFF_MS = [5000, 10000, 20000];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runMigrateDeploy() {
  return spawnSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: ["inherit", "pipe", "pipe"],
    encoding: "utf8",
  });
}

async function main() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(
      `[migrate-deploy-retry] Attempt ${attempt}/${MAX_ATTEMPTS}: prisma migrate deploy`,
    );
    const result = runMigrateDeploy();
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
    process.stdout.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");

    if (result.status === 0) {
      console.log("[migrate-deploy-retry] Migration succeeded.");
      return;
    }

    const isRetryable = RETRYABLE_CODES.some((code) => output.includes(code));
    if (!isRetryable || attempt === MAX_ATTEMPTS) {
      console.error(
        `[migrate-deploy-retry] Giving up after attempt ${attempt} (retryable: ${isRetryable}).`,
      );
      process.exit(result.status ?? 1);
    }

    const delay = BACKOFF_MS[attempt - 1] ?? BACKOFF_MS[BACKOFF_MS.length - 1];
    console.warn(
      `[migrate-deploy-retry] Database not reachable yet (cold start?) - retrying in ${delay / 1000}s…`,
    );
    await sleep(delay);
  }
}

main();
