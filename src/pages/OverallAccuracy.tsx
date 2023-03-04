export const OverallAccuracy = ({ queryKey }: { queryKey: string }) => {
  return (
    <div>
      <div className="border-b-2 border-slate-400 pb-1 text-lg font-bold uppercase dark:border-slate-700">
        Overall Accuracy
      </div>
      <div className="mt-2 text-4xl font-bold text-purple-400 dark:text-purple-400">
        95%
      </div>
    </div>
  );
};
