import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: "./src/**/*.{tsx,ts}",
  generates: {
    "./src/__generated__/types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ]
    }
  }
};

export default config;
