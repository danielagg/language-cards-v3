import { LanguageCard } from "@prisma/client";
import { AnswerFeedback } from "./AnswerFeedback";
import { AnswerStatistics } from "./AnswerStatistics";
import { Loader } from "./Loader";
import { api } from "../utils/api";
import { useState } from "react";

export const Playarea = ({
  data,
  isLoading,
  setCurrentQueryKey,
  isCorrectAnswer,
  setIsCorrectAnswer,
}: {
  data: LanguageCard | undefined;
  isLoading: boolean;
  setCurrentQueryKey: (newQueryKey: string) => void;
  isCorrectAnswer: boolean | null;
  setIsCorrectAnswer: (isAnswerCorrect: boolean | null) => void;
}) => {
  const setStatistics = api.languageCards.setStatistics.useMutation();
  const [answer, setAnswer] = useState("");

  const onSubmitAnswer = () => {
    const isCorrectAnswer =
      data!.englishTranslations
        .map((x) => x.toUpperCase())
        .indexOf(answer.toUpperCase().trim()) > -1;

    setIsCorrectAnswer(isCorrectAnswer);
    setAnswer("");

    setStatistics.mutate({
      id: data!.id,
      correct: isCorrectAnswer,
    });

    // we show a success/failure feedback for a bit
    // in case of a successful answer, we can get by with .5 sec, as we only show "Correct!",
    // but with failures, we explain the correct answers, therefore more time is necessary to read
    setTimeout(
      () => {
        setCurrentQueryKey(data!.id);
        setIsCorrectAnswer(null);
      },
      isCorrectAnswer ? 500 : 2500
    );
  };

  return (
    <div className="flex flex-col items-center lg:items-start">
      <div className="text-4xl font-bold lg:text-8xl">
        {isLoading ? (
          <Loader height="h-24" width="w-24" />
        ) : (
          <>{data?.dutch}</> // todo: error handling
        )}
      </div>

      {data ? <AnswerStatistics data={data} /> : <></>}

      <div className="mt-6 flex w-full flex-col items-center lg:mt-16 lg:flex-row lg:shadow-md">
        <div className="w-full px-4 lg:px-0">
          <input
            type="text"
            id="answer"
            value={answer}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSubmitAnswer();
              }
            }}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            autoFocus
            className="inline-block w-full rounded-lg border-2 p-2 text-slate-800 ring-0 lg:rounded-tr-none lg:rounded-br-none lg:p-3"
            placeholder={`${data?.dutch ?? ""} in English is...`}
          />
        </div>

        <div className="mt-1 w-full px-4 lg:mt-0 lg:w-auto lg:px-0">
          <button
            className="inline w-full rounded-lg bg-teal-600 px-12 py-3 text-center text-white hover:bg-emerald-500 lg:rounded-bl-none lg:rounded-tl-none lg:px-20 lg:text-lg"
            onClick={() => {
              if (data) {
                onSubmitAnswer();
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="h-12 py-4">
        {isCorrectAnswer != null && (
          <AnswerFeedback isCorrect={isCorrectAnswer} data={data!} />
        )}
      </div>
    </div>
  );
};
