import type { LanguageCard } from "@prisma/client";

export const AnswerStatistics = ({ data }: { data: LanguageCard }) => {
  return (
    <div className="mt-4 text-xs opacity-70 lg:text-base">
      {data.allAttemptedAnswerCount > 0 ? (
        <div>
          This word has a successful answer ratio of{" "}
          {(data.correctAnswerCount / data.allAttemptedAnswerCount) * 100}%
          (answered successfully {data.correctAnswerCount} times out of{" "}
          {data.allAttemptedAnswerCount}).
        </div>
      ) : (
        <div>This word has never been answered.</div>
      )}
    </div>
  );
};
