import { LanguageCard } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const [previousCardId, setPreviousCardId] = useState("");

  const languageCard = api.languageCards.getRandom.useQuery(
    { previousCardId },
    {
      onSuccess: (data) => {
        setPreviousCardId(data?.id ?? "");
      },
      enabled: previousCardId === "",
    }
  );

  const [answer, setAnswer] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);

  const onSubmitAnswer = async () => {
    setIsCorrectAnswer(
      languageCard
        .data!.englishTranslations.map((x) => x.toUpperCase())
        .indexOf(answer.toUpperCase()) > -1
    );

    const waitFor = () =>
      new Promise(() =>
        setTimeout(() => {
          setIsCorrectAnswer(null);
          setAnswer("");
        }, 2000)
      );

    await waitFor();

    await languageCard.refetch();
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-800 to-indigo-800 text-slate-800">
        <div className="flex w-1/2 flex-col">
          <div className="text-center text-8xl font-bold uppercase text-gray-200">
            {languageCard.data?.spanish}
          </div>
          <div className="mt-16 flex w-full items-center space-x-2 px-12">
            <input
              type="text"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              autoFocus
              className="block w-full rounded-lg border-0 p-3 uppercase text-slate-800 ring-0"
              placeholder={`${
                languageCard.data?.spanish ?? ""
              } in English is...`}
              required
            />
            <button
              className="w-36 rounded bg-green-500 px-12 py-3 hover:bg-green-300"
              onClick={() => {
                if (languageCard.data) {
                  onSubmitAnswer().catch((e) => {
                    console.log(e);
                  });
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
        {isCorrectAnswer === true && <div>Correct!</div>}
        {isCorrectAnswer === false && <div>InCorrect!</div>}
      </main>
    </>
  );
};

export default Home;
