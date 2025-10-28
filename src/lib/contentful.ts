// src/lib/contentful.ts
import { createClient } from "contentful";

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID!,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN!,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master",
});

export default client;
