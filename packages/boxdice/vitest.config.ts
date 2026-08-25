import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, ".env") });

export default {
  test: {
    include: ["test/**/*.test.ts"],
    // The decode tests are offline (fixtures only). Live tests, once a
    // tenant key exists, will need the same headroom Reapit's do.
    testTimeout: 120000,
  },
};
