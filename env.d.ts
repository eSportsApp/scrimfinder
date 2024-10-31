export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_OPTIONS: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_TOKEN: string;
      DATABASE_URL: string;
      ESPORTSAPP_API_KEY: string;
    }
  }
}