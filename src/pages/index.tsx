import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "../utils/api";
import { AnswerFeedback } from "./AnswerFeedback";
import { AnswerStatistics } from "./AnswerStatistics";
import { HowToPlay } from "./HowToPlay";
import { OverallAccuracy } from "./OverallAccuracy";
import { Loader } from "./shared/Loader";
import { Top10Mistakes } from "./Top10Mistakes";

const Home: NextPage = () => {
  const [currentQueryKey, setCurrentQueryKey] = useState("");

  const languageCard = api.languageCards.getRandom.useQuery(
    { previousCardId: currentQueryKey },
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const setStatistics = api.languageCards.setStatistics.useMutation();

  const [answer, setAnswer] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

  const onSubmitAnswer = () => {
    const isCorrectAnswer =
      languageCard
        .data!.englishTranslations.map((x) => x.toUpperCase())
        .indexOf(answer.toUpperCase().trim()) > -1;

    setIsCorrectAnswer(isCorrectAnswer);
    setAnswer("");

    setStatistics.mutate({
      id: languageCard.data!.id,
      correct: isCorrectAnswer,
    });

    setTimeout(
      () => {
        setCurrentQueryKey(languageCard.data!.id);
        setIsCorrectAnswer(null);
      },
      isCorrectAnswer ? 500 : 2500
    );
  };

  const getBorderColor = () => {
    if (isCorrectAnswer === true) {
      return "border-r-green-500";
    }
    if (isCorrectAnswer === false) {
      return "border-r-red-500";
    }
    return "border-r-purple-300 dark:border-r-purple-900";
  };

  return (
    <>
      <Head>
        <title>ES - EN Language Cards</title>
        <meta
          name="description"
          content="ES - EN Language Cards to memorize vocab"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-200 text-purple-700 dark:bg-slate-800 dark:text-purple-200">
        <div className="flex w-full">
          <div
            className={`flex min-h-screen w-4/5 items-center justify-center border-r-[5rem] ${getBorderColor()} bg-purple-200 dark:bg-purple-800`}
          >
            <div className="w-2/3">
              <div className="text-8xl font-bold">
                {languageCard.isLoading ? (
                  <Loader height="h-24" width="w-24" />
                ) : (
                  <>{languageCard.data?.spanish}</>
                )}
              </div>

              {languageCard.data ? (
                <AnswerStatistics data={languageCard.data} />
              ) : (
                <></>
              )}

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
                  className="block w-full rounded-tl-lg rounded-bl-lg border-2 p-1 uppercase text-slate-800 ring-0 lg:p-3"
                  placeholder={`${
                    languageCard.data?.spanish ?? ""
                  } in English is...`}
                />
                <div>
                  <button
                    className="inline-block rounded-tr-lg rounded-br-lg bg-teal-600 px-20 py-3 text-center text-lg text-white hover:bg-emerald-500"
                    onClick={() => {
                      if (languageCard.data) {
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
                  <AnswerFeedback
                    isCorrect={isCorrectAnswer}
                    data={languageCard.data!}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex h-screen w-1/5 flex-col space-y-10 bg-slate-800 p-6 text-slate-400 shadow dark:bg-gray-900 dark:text-slate-500">
            <HowToPlay />
            <OverallAccuracy queryKey={currentQueryKey} />
            <Top10Mistakes queryKey={currentQueryKey} />
          </div>
        </div>

        {/* <div className="flex w-full flex-col lg:w-1/2">
          <div className="text-center text-4xl font-bold uppercase text-gray-200 lg:text-8xl">
            {languageCard.data?.spanish}
          </div>
          <div className="mt-12 flex w-full flex-col items-center space-x-2 px-4 lg:mt-16 lg:flex-row lg:px-12">
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
              className="block w-full rounded border-0 p-1 uppercase text-slate-800 ring-0 lg:rounded-lg lg:p-3"
              placeholder={`${
                languageCard.data?.spanish ?? ""
              } in English is...`}
            />
            <button
              className="mt-4 w-full rounded bg-blue-500 px-12 py-3 text-white hover:bg-blue-300 lg:mt-0 lg:w-36"
              onClick={() => {
                if (languageCard.data) {
                  onSubmitAnswer();
                }
              }}
            >
              Submit
            </button>
          </div>
          <div className="mt-6 h-32 px-12 text-xl">
            {isCorrectAnswer === false && (
              <div>
                The correct answer was:{" "}
                <span className="font-bold">
                  {languageCard.data!.englishTranslations[0]}
                </span>
              </div>
            )}
          </div>
        </div> */}
      </main>
    </>
  );
};

export default Home;
