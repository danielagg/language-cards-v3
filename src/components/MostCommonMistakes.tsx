import { useState } from "react";
import { api } from "../utils/api";

export const MostCommonMistakes = ({ queryKey }: { queryKey: string }) => {
  const [hasTop5Limit, setHasTop5Limit] = useState(true);
  const { isLoading, data } = api.languageCards.getMistakes.useQuery({
    queryKey,
    hasTop5Limit,
  });

  return (
    <div>
      <div className="border-b-2 border-slate-400 pb-1 text-lg font-bold uppercase dark:border-slate-700">
        Most Common Mistakes
      </div>
      <div className="mt-4 pl-2 text-sm">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="h-[50vh] overflow-y-auto lg:h-[58vh]">
            <div className="space-y-4">
              {data!.map((x) => {
                return (
                  <div key={x.id}>
                    <div className="font-bold">
                      <span className="uppercase text-purple-400 dark:text-purple-400">
                        {x.spanish}
                      </span>{" "}
                      - {x.englishTranslations[0]}
                    </div>
                    <div className="text-xs">
                      Asked {x.allAttemptedAnswerCount} times, correctly
                      answered {x.correctAnswerCount} times.
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-5 inline-flex w-full cursor-pointer items-center space-x-1 text-purple-200 opacity-50 hover:opacity-80"
              onClick={() => setHasTop5Limit(!hasTop5Limit)}
            >
              <div>
                {hasTop5Limit
                  ? "View All Mistakes"
                  : "Show only the top 5 mistakes"}
              </div>
              {hasTop5Limit ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mt-1 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                  />
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
