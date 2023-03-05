const HowToPlay = () => {
  return (
    <div>
      <div className="border-b-2 border-slate-400 pb-1 text-lg font-bold uppercase dark:border-slate-700">
        How to Play
      </div>
      <div className="mt-4 text-xs">
        A word in Spanish will be displayed on the screen. Your task is to guess
        its meaning in English, type it in the input field, and press the submit
        button. If you get it right, you will be shown the next word. If you get
        it wrong, you will be shown the correct answer and then the next word.
      </div>
    </div>
  );
};

export default HowToPlay;
