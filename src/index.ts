import { z } from "zod"

import { mcpServer } from "./todo-index.js"

export const configSchema = z
  .object({
    accessToken: z.string().min(1).describe("Microsoft Graph access token with Microsoft To Do scopes").optional(),
    refreshToken: z
      .string()
      .min(1)
      .describe("Microsoft Graph refresh token used to renew access tokens")
      .optional(),
    clientId: z.string().min(1).describe("Azure application (client) ID used for token refresh").optional(),
    clientSecret: z.string().min(1).describe("Azure application client secret used for token refresh").optional(),
    tenantId: z
      .string()
      .min(1)
      .describe("Directory tenant ID (or 'organizations') for token refresh operations")
      .optional(),
    tokenFilePath: z
      .string()
      .min(1)
      .describe("Optional path for reading/writing token cache JSON inside the container")
      .optional(),
  })
  .describe("Configuration for connecting to Microsoft Graph")

export type SmitheryConfig = z.infer<typeof configSchema>

interface CreateServerArgs {
  config?: SmitheryConfig
}

export default async function createServer({ config }: CreateServerArgs = {}) {
  const parsedConfig = configSchema.parse(config ?? {})

  if (parsedConfig.accessToken) {
    process.env.MS_TODO_ACCESS_TOKEN = parsedConfig.accessToken
  }

  if (parsedConfig.refreshToken) {
    process.env.MS_TODO_REFRESH_TOKEN = parsedConfig.refreshToken
  }

  if (parsedConfig.clientId) {
    process.env.CLIENT_ID = parsedConfig.clientId
  }

  if (parsedConfig.clientSecret) {
    process.env.CLIENT_SECRET = parsedConfig.clientSecret
  }

  if (parsedConfig.tenantId) {
    process.env.TENANT_ID = parsedConfig.tenantId
  }

  if (parsedConfig.tokenFilePath) {
    process.env.MSTODO_TOKEN_FILE = parsedConfig.tokenFilePath
  }

  return mcpServer
}
