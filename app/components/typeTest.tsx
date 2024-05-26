import { use, useEffect, useRef, useState } from "react";

interface TypeTestProps {
  text: string;
  size: number;
  showStats: boolean;
  punctuationMode: boolean;
  capsMode: boolean;
  mistakesMode: boolean;
  onRestart: () => void;
}

const TypeTest: React.FC<TypeTestProps> = ({
  text,
  size,
  showStats,
  punctuationMode,
  capsMode,
  mistakesMode,
  onRestart,
}) => {
  const [time, setTime] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [WPM, setWPM] = useState<number>(0);
  const [timediff, setTimediff] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [breakpoint, setBreakpoint] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const punctuation = [
    ".",
    ",",
    "!",
    "?",
    ":",
    ";",
    "-",
    "(",
    ")",
    "[",
    "]",
    "'",
    '"',
  ];

  const finishedTyping = () => {
    setIsTyping(false);
    const endTime = new Date().getTime();
    const timeDiff = endTime - time;
    const minutes = timeDiff / 60000;
    const WPM = Math.floor(charRefs.current.length / 5 / minutes);
    setWPM(WPM);
    setTimediff(timeDiff);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const characters = charRefs.current;
    let currentChar = charRefs.current[charIndex];
    let nextChar = charRefs.current[charIndex + 1];
    let nextNextChar = charRefs.current[charIndex + 2];
    let typedChar = e.target.value.slice(-1);

    if (charIndex <= characters.length) {
      if (!isTyping) {
        setTime(new Date().getTime());
        setIsTyping(true);
      }

      if (
        (capsMode &&
          typedChar.toLocaleLowerCase() ===
            currentChar?.textContent?.toLocaleLowerCase()) ||
        typedChar === currentChar?.textContent ||
        (typedChar === " " && currentChar?.textContent === "\u00A0")
      ) {
        console.log("correct");
        currentChar?.classList.remove("bg-cyan-500/70");
        currentChar?.classList.remove("bg-red-500");
        currentChar?.classList.add("text-emerald-500");
        nextChar?.classList.add("bg-cyan-500/70");
        setCharIndex(charIndex + 1);
        if (
          punctuationMode &&
          nextChar?.textContent &&
          punctuation.includes(nextChar?.textContent)
        ) {
          if (charIndex === characters.length - 2) {
            nextChar?.classList.add("text-emerald-500");
            setCharIndex(charIndex + 2);
            finishedTyping();
          } else {
            nextChar?.classList.add("text-emerald-500");
            nextNextChar?.classList.add("bg-cyan-500/70");
            setCharIndex(charIndex + 2);
          }
        }
      } else {
        currentChar?.classList.remove("bg-cyan-500/70");
        currentChar?.classList.add("bg-red-500");
        console.log("mistake");
        setMistakes(mistakes + 1);
        if (mistakesMode) {
          setCharIndex(charIndex + 1);
          nextChar?.classList.add("bg-cyan-500/70");
        }
      }

      if (charIndex >= characters.length - 1) {
        finishedTyping();
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isTyping) {
      interval = setInterval(() => {
        const endTime = new Date().getTime();
        const timeDiff = endTime - time;
        const minutes = timeDiff / 60000;
        const WPM = Math.floor(charIndex / 5 / minutes);
        setTimediff(timeDiff);
        setWPM(WPM);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTyping, timediff]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="min-h-screen min-w-screen flex flex-col gap-8 items-center px-64"
      onClick={() => inputRef.current?.focus()}>
      <button
        onClick={onRestart}
        className="text-gray-200 font-bold text-lg underline">
        Restart
      </button>
      <div className="flex flex-col gap-4 items-center">
        <input
          type="text"
          className="opacity-0 z-[-999] absolute"
          ref={inputRef}
          onChange={handleChange}
        />
        <div className="flex w-full flex-wrap">
          {text &&
            text.split("").map((char, i) => (
              <>
                <span
                  key={i}
                  className={`text-2xl font-bold  min-w-2 ${
                    i === 0 && "bg-cyan-500/70"
                  }`}
                  // @ts-ignore
                  ref={(e) => (charRefs.current[i] = e)}>
                  {char === " " ? "\u00A0" : char}
                </span>
              </>
            ))}
        </div>
        {showStats && (
          <div className="flex w-full justify-between text-gray-400">
            <div className="flex flex-col gap-2">
              <span>
                {charIndex}/{text.length}
              </span>
              {/* <span className="text-emerald-400">
              {(timediff / 1000).toFixed(0)}
            </span> */}
            </div>
            <div className="flex gap-4">
              <span>WPM: {WPM}</span>
              <span>
                Accuracy:{" "}
                {mistakes === 0
                  ? 100
                  : Math.round(((charIndex - mistakes) / charIndex) * 100)}
                %
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeTest;
