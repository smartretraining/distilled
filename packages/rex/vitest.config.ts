import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, ".env") });

export default {
  test: {
    include: ["test/**/*.test.ts"],
    testTimeout: 120000,
    // Rex's testing account is shared; run serially to stay friendly.
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
};
