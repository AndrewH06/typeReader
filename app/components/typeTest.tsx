import { use, useEffect, useRef, useState } from "react";

import Explosion from "react-canvas-confetti/dist/presets/fireworks";
import { IoArrowBackOutline } from "react-icons/io5";

interface TypeTestProps {
  text: string;
  size: number;
  showStats: boolean;
  punctuationMode: boolean;
  capsMode: boolean;
  mistakesMode: boolean;
  onRestart: () => void;
  finished: () => void;
  changeStats: (newVal: {
    time: number;
    mistakes: number;
    WPM: number;
    timediff: number;
  }) => void;
}

const TypeTest: React.FC<TypeTestProps> = ({
  text,
  size,
  showStats,
  punctuationMode,
  capsMode,
  mistakesMode,
  onRestart,
  finished,
  changeStats,
}) => {
  const [time, setTime] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [WPM, setWPM] = useState<number>(0);
  const [timediff, setTimediff] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

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
    "’",
    "”",
    "“",
    "`",
    "´",
  ];

  const impossibleToPossible: { [key: string]: string } = {
    "´": "`",
    "’": "'",
    "”": '"',
    "“": '"',
  };

  const wordsOfEncouragement = [
    "Nice!",
    "Keep going!",
    "You're doing great!",
    "Don't stop now!",
    "Keep it up!",
    "Boo ya!!",
    "You're on fire!",
    "You're a typing wizard!",
    "You're a typing ninja!",
    "You're a typing machine!",
  ];

  const finishedTyping = () => {
    setIsTyping(false);
    const endTime = new Date().getTime();
    const timeDiff = endTime - time;
    const minutes = timeDiff / 60000;
    const WPM = Math.floor(charRefs.current.length / 5 / minutes);
    setWPM(WPM);
    setTimediff(timeDiff);
    setDone(true);
  };

  const nextChunk = () => {
    finished();
    changeStats({
      time: time,
      mistakes: mistakes,
      WPM: WPM,
      timediff: timediff,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const characters = charRefs.current;
    let currentChar = charRefs.current[charIndex];
    let nextChar = charRefs.current[charIndex + 1];
    let nextNextChar = charRefs.current[charIndex + 2];
    let typedChar = e.target.value.slice(-1);

    if (charIndex <= characters.length - 1) {
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
            nextChar?.classList.remove("bg-cyan-500/70");
            nextChar?.classList.add("text-emerald-500");
            nextNextChar?.classList.add("bg-cyan-500/70");
            setCharIndex(charIndex + 2);
          }
        }
      } else {
        currentChar?.classList.remove("bg-cyan-500/70");
        currentChar?.classList.add("bg-red-500");
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
      className="min-h-screen min-w-screen flex flex-col gap-8 px-64"
      onClick={() => inputRef.current?.focus()}>
      <div className="flex">
        <button
          onClick={onRestart}
          className="flex text-gray-300 font-bold text-3xl">
          <IoArrowBackOutline />
        </button>
      </div>
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
                  {impossibleToPossible[char]
                    ? impossibleToPossible[char]
                    : char === " "
                    ? "\u00A0"
                    : char}
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
                  : charIndex === 0
                  ? 0
                  : Math.round(((charIndex - mistakes) / charIndex) * 100)}
                %
              </span>
            </div>
          </div>
        )}
        {done && (
          <div className="mt-12 flex flex-col justify-center">
            <Explosion autorun={{ speed: 1, duration: 3000 }} />
            <p className="text-xl font-bold">
              {
                wordsOfEncouragement[
                  Math.floor(Math.random() * wordsOfEncouragement.length)
                ]
              }
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => nextChunk()}
                className="flex justify-center font-bold bg-emerald-500 text-gray-200 px-4 py-2 rounded-md mt-4 hover:bg-emerald-600 transition-colors duration-300 ease-in-out">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeTest;
