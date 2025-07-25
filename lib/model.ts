"use server";

import { createAzure } from "@ai-sdk/azure";
import { env } from "process";

export const AzureOpenAI = createAzure({
  apiKey: env.AZURE_OPENAI_KEY,
  baseURL: env.AZURE_OPENAI_ENDPOINT,
  apiVersion: "2025-01-01-preview",
});
