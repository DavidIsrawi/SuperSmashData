import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      "https://api.smash.gg/gql/alpha": {
        headers: {
          Authorization: process.env.STARTGG_TOKEN || "",
        },
      },
    },
  ],
  documents: "src/queries/**/*.ts",
  generates: {
    "src/gql/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"]
    }
  }
};

export default config;
