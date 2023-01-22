import { createTRPCRouter } from "./trpc";
import { languageCardsRouter } from "./routers/languageCards";

export const appRouter = createTRPCRouter({
  languageCards: languageCardsRouter,
});

export type AppRouter = typeof appRouter;
