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
    <>
      <div className="text-8xl font-bold">
        {isLoading ? (
          <Loader height="h-24" width="w-24" />
        ) : (
          <>{data?.spanish}</> // todo: error handling
        )}
      </div>

      {data ? <AnswerStatistics data={data} /> : <></>}

      <div className="mt-12 flex w-full items-center shadow-md lg:mt-16">
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
          className="block w-full rounded-tl-lg rounded-bl-lg border-2 p-1 text-slate-800 ring-0 lg:p-3"
          placeholder={`${data?.spanish ?? ""} in English is...`}
        />
        <div>
          <button
            className="inline-block rounded-tr-lg rounded-br-lg bg-teal-600 px-20 py-3 text-center text-lg text-white hover:bg-emerald-500"
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
    </>
  );
};
