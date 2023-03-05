import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "../utils/api";
import { AnswerFeedback } from "../components/AnswerFeedback";
import { Loader } from "../components/Loader";
import { AnswerStatistics } from "../components/AnswerStatistics";
import { HowToPlay } from "../components/HowToPlay";
import { OverallAccuracy } from "../components/OverallAccuracy";
import { Top10Mistakes } from "../components/Top10Mistakes";

const Home: NextPage = () => {
  // we store the current query key in state so that we can avoid refetching the exact same card when fetching the next card, after a submit
  // initially, this is null, but on each round, we update it, then send it back to the server, which can then use it to avoid returning the same card
  // essentially, the current query key is the current language card's ID
  const [currentQueryKey, setCurrentQueryKey] = useState("");

  const [answer, setAnswer] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

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

    // we show a success/failure feedback for a bit
    // in case of a successful answer, we can get by with .5 sec, as we only show "Correct!",
    // but with failures, we explain the correct answers, therefore more time is necessary to read
    setTimeout(
      () => {
        setCurrentQueryKey(languageCard.data!.id);
        setIsCorrectAnswer(null);
      },
      isCorrectAnswer ? 500 : 2500
    );
  };

  const getBorderColor = () => {
    if (isCorrectAnswer === null)
      return "border-r-purple-300 dark:border-r-purple-900";

    return isCorrectAnswer ? "border-r-green-500" : "border-r-red-500";
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
      </main>
    </>
  );
};

export default Home;
