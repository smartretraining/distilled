import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, ".env") });

export default {
  test: {
    include: ["test/**/*.test.ts"],
    // Only test/live.test.ts touches the network, and it skips itself without
    // credentials — but when it does run, a page over a slow link exceeds
    // vitest's 5s default.
    testTimeout: 120000,
    // VaultRE allows 10 requests/second per key; run serially rather than
    // spending the budget on parallel workers.
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
};
