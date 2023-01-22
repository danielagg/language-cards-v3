import { LanguageCard } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { api } from "../utils/api";

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

  const [answer, setAnswer] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

  const onSubmitAnswer = () => {
    const isCorrectAnswer =
      languageCard
        .data!.englishTranslations.map((x) => x.toUpperCase())
        .indexOf(answer.toUpperCase()) > -1;

    setIsCorrectAnswer(isCorrectAnswer);
    setAnswer("");

    setTimeout(
      () => {
        setCurrentQueryKey(languageCard.data!.id);
        setIsCorrectAnswer(null);
      },
      isCorrectAnswer ? 500 : 2500
    );
  };

  const getBackgroundGradient = () => {
    if (isCorrectAnswer === true) {
      return "from-green-800 to-green-900 text-green-200";
    }
    if (isCorrectAnswer === false) {
      return "from-red-800 to-red-900 text-red-200";
    }
    return "from-slate-800 to-slate-900 text-slate-800";
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
      <main
        className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ${getBackgroundGradient()}`}
      >
        <div className="flex w-1/2 flex-col">
          <div className="text-center text-8xl font-bold uppercase text-gray-200">
            {languageCard.data?.spanish}
          </div>
          <div className="mt-16 flex w-full items-center space-x-2 px-12">
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
              className="block w-full rounded-lg border-0 p-3 uppercase text-slate-800 ring-0"
              placeholder={`${
                languageCard.data?.spanish ?? ""
              } in English is...`}
            />
            <button
              className="w-36 rounded bg-blue-500 px-12 py-3 text-white hover:bg-blue-300"
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
        </div>
      </main>
    </>
  );
};

export default Home;
