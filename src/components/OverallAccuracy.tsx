import { api } from "../utils/api";
import { Loader } from "../components/Loader";

export const OverallAccuracy = ({ queryKey }: { queryKey: string }) => {
  const { isLoading, data } = api.languageCards.getOverallAccuracy.useQuery({
    queryKey,
  });

  return (
    <div>
      <div className="border-b-2 border-slate-400 pb-1 text-lg font-bold uppercase dark:border-slate-700">
        Overall Accuracy
      </div>
      <div className="mt-2 text-4xl font-bold text-purple-400 dark:text-purple-400">
        {isLoading ? (
          <div className="p-2">
            <Loader height="h-8" width="w-8" />
          </div>
        ) : (
          <>
            {new Intl.NumberFormat("en-US", { style: "percent" }).format(
              data!.accuracy
            )}
          </>
        )}
      </div>
    </div>
  );
};
