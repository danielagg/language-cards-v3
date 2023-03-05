import { LanguageCard } from "@prisma/client";

export const AnswerFeedback = ({
  isCorrect,
  data,
}: {
  isCorrect: boolean;
  data: LanguageCard;
}) => {
  return (
    <>
      {isCorrect ? (
        <div>
          You are <span className="font-bold text-green-400">correct!</span>
        </div>
      ) : (
        <div>
          You are <span className="font-bold text-red-400">incorrect.</span>{" "}
          {data.spanish} means{" "}
          <span className="font-bold">
            {data.englishTranslations.join(", ")}
          </span>
          .
        </div>
      )}
    </>
  );
};
