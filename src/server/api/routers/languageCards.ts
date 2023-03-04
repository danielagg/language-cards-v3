import { LanguageCard } from "@prisma/client";
import { contextProps } from "@trpc/react-query/shared";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const languageCardsRouter = createTRPCRouter({
  getRandom: publicProcedure
    .input(z.object({ previousCardId: z.string().nullable() }))
    .query(async ({ input, ctx }) => {
      const languageCardCount = await ctx.prisma.languageCard.count();
      const skip = Math.floor(Math.random() * languageCardCount);

      if (input.previousCardId) {
        const result = await ctx.prisma.languageCard.findMany({
          take: 1,
          skip: skip - 1,
          where: {
            id: {
              not: input.previousCardId,
            },
          },
        });

        return result[0];
      }

      const result = await ctx.prisma.languageCard.findMany({
        take: 1,
        skip: skip,
      });

      return result[0];
    }),
  getStatistics: publicProcedure
    .input(
      z.object({
        queryKey: z.string(),
        hasTop5Limit: z.boolean(),
      })
    )
    .query(async ({ input, ctx }) => {
      const allLanguageCards = await ctx.prisma.languageCard.findMany({
        where: {
          allAttemptedAnswerCount: {
            gt: 0,
          },
        },
      });
      const sorted = allLanguageCards
        .filter((x) => x.allAttemptedAnswerCount !== x.correctAnswerCount)
        .sort((a: LanguageCard, b: LanguageCard) => {
          const ratioA = a.allAttemptedAnswerCount - a.correctAnswerCount;
          const ratioB = b.allAttemptedAnswerCount - b.correctAnswerCount;
          return ratioB - ratioA;
        });

      return input.hasTop5Limit ? sorted.slice(0, 5) : sorted;
    }),
  setStatistics: publicProcedure
    .input(z.object({ id: z.string(), correct: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const languageCard: LanguageCard | null =
        await ctx.prisma.languageCard.findUnique({
          where: {
            id: input.id,
          },
        });

      if (!languageCard) {
        throw new Error("Language card not found");
      }

      await ctx.prisma.languageCard.update({
        where: {
          id: input.id,
        },
        data: {
          ...languageCard,
          allAttemptedAnswerCount:
            Number(languageCard.allAttemptedAnswerCount) + 1,
          correctAnswerCount:
            Number(languageCard.correctAnswerCount) +
            Number(input.correct ? 1 : 0),
        },
      });

      return languageCard;
    }),
});
