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
    return "border-r-slate-200";
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-slate-700">
        <div className="flex w-full">
          <div
            className={`min-h-screen w-5/6 border-r-[5rem] ${getBorderColor()} bg-white px-32 py-28`}
          >
            <div className="text-8xl font-bold">
              {languageCard.data?.spanish}
            </div>

            <div className="mt-12 w-full lg:mt-16">
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
                className="block w-full rounded border-2 p-1 uppercase text-slate-800 ring-0 lg:rounded-lg lg:p-3"
                placeholder={`${
                  languageCard.data?.spanish ?? ""
                } in English is...`}
              />
              <div className="mt-4">
                <button
                  className="w-full rounded bg-blue-500 px-12 py-3 text-white hover:bg-blue-300 lg:mt-0 lg:w-36"
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
