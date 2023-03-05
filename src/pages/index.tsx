import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "../utils/api";
import { OverallAccuracy } from "../components/OverallAccuracy";
import { MostCommonMistakes } from "../components/MostCommonMistakes";
import { Playarea } from "../components/Playarea";
import { HowToPlay } from "../components/HowToPlay";

const Home: NextPage = () => {
  // we store the current query key in state so that we can avoid refetching the exact same card when fetching the next card, after a submit
  // initially, this is null, but on each round, we update it, then send it back to the server, which can then use it to avoid returning the same card
  // essentially, the current query key is the current language card's ID
  const [currentQueryKey, setCurrentQueryKey] = useState("");
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
        <div className="flex w-full flex-col lg:flex-row">
          <div
            className={`flex min-h-screen w-full items-center justify-center lg:w-4/5 lg:border-r-[5rem] ${getBorderColor()} bg-purple-200 dark:bg-purple-800`}
          >
            <div className="w-full lg:w-2/3">
              <Playarea
                isLoading={languageCard.isLoading}
                data={languageCard.data}
                setCurrentQueryKey={setCurrentQueryKey}
                isCorrectAnswer={isCorrectAnswer}
                setIsCorrectAnswer={setIsCorrectAnswer}
              />
            </div>
          </div>

          <div className="flex h-screen w-full flex-col space-y-10 bg-slate-800 p-6 text-slate-400 shadow dark:bg-gray-900 dark:text-slate-500 lg:w-1/5">
            <HowToPlay />
            <OverallAccuracy queryKey={currentQueryKey} />
            <MostCommonMistakes queryKey={currentQueryKey} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
