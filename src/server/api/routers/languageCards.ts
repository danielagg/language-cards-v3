import { contextProps } from "@trpc/react-query/shared";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const languageCardsRouter = createTRPCRouter({
  getRandom: publicProcedure
    .input(z.object({ previousCardId: z.string().nullable() }))
    .query(async ({ input, ctx }) => {
      const languageCardCount = await ctx.prisma.languageCard.count();

      if (input.previousCardId) {
        const previousCard = await ctx.prisma.languageCard.findUnique({
          where: {
            id: input.previousCardId,
          },
        });

        if (previousCard) {
          const result = await ctx.prisma.languageCard.findMany({
            take: 1,
            where: {
              id: {
                not: previousCard.id,
              },
            },
            orderBy: {
              id: "desc",
            },
          });

          return result[0];
        }
      }

      const skip = Math.floor(Math.random() * languageCardCount);
      const result = await ctx.prisma.languageCard.findMany({
        take: 1,
        skip: skip,
        orderBy: {
          id: "desc",
        },
      });

      return result[0];
    }),
  // getRandom: publicProcedure
  // .input(z.object({ text: z.string() }))
  // .query(({ input }) => {
  //   return {
  //     greeting: `Hello ${input.text}`,
  //   };
  // }),
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.languageCard.findMany();
  // }),
});
