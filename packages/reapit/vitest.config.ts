import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, ".env") });

export default {
  test: {
    include: ["test/**/*.test.ts"],
    // Every test hits the live API; a 25-record page over a slow link
    // comfortably exceeds vitest's 5s default.
    testTimeout: 120000,
    // Reapit API keys are IP-restricted and rate-limited per client; run
    // serially rather than hammering the account from several workers.
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
};
