"use client";

import { useEffect, useState } from "react";
import TypeTest from "./components/typeTest";

export default function Home() {
  const [input, setInput] = useState("");
  const [text, setText] = useState("");
  const [size, setSize] = useState(30);
  const [showStats, setShowStats] = useState(false);
  const [caps, setCaps] = useState(false);
  const [punc, setPunc] = useState(false);
  const [mistakes, setMistakes] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full items-center justify-center">
        {text ? (
          <TypeTest
            text={text.replace(/(\r\n|\n|\r)/gm, "")}
            size={size}
            showStats={showStats}
            punctuationMode={punc}
            capsMode={caps}
            mistakesMode={mistakes}
            onRestart={() => setText("")}
          />
        ) : (
          <div className="flex gap-8">
            <div className="w-[20%] flex flex-col justify-between">
              <div className="flex">
                <h1 className="text-4xl font-bold text-gray-200">Type</h1>
                <h1 className="text-4xl font-bold text-emerald-400">Reader</h1>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex gap-4 items-center">
                  <label htmlFor="stats" className="text-gray-200">
                    Show Stats
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="stats"
                      name="stats"
                      className="sr-only peer"
                      checked={showStats}
                      onChange={() => setShowStats(!showStats)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <label htmlFor="stats" className="text-gray-200">
                      Mistakes OK
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={mistakes}
                        onChange={() => {
                          setMistakes(!mistakes);
                        }}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  {caps ? (
                    <p className="text-xs text-gray-400">
                      Can move on from mistakes
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Cannot move on from mistakes
                    </p>
                  )}
                  <div className="flex gap-4 items-center">
                    <label htmlFor="stats" className="text-gray-200">
                      Case sensitive
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={caps}
                        onChange={() => {
                          setCaps(!caps);
                        }}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  {caps ? (
                    <p className="text-xs text-gray-400">
                      No need for capitalization
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Capitalization required
                    </p>
                  )}
                  <div className="flex gap-4 items-center">
                    <label htmlFor="stats" className="text-gray-200">
                      Punctuation
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={punc}
                        onChange={() => {
                          setPunc(!punc);
                        }}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  {punc ? (
                    <p className="text-xs text-gray-400">
                      No need for punctuation
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Punctuation required
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="size" className="text-gray-200">
                    Paragraph Size
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      id="size"
                      name="size"
                      min="10"
                      max="100"
                      step="10"
                      className="appearance-none w-full h-2 bg-gray-300 rounded-lg outline-none"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                    />
                    <p>{size}</p>
                  </div>
                </div>
                <button
                  className="bg-emerald-600 hover:bg-emerald-700 w-full transition text-white font-bold py-2 px-4 rounded-xl"
                  onClick={() => setText(input)}>
                  Start reading
                </button>
              </div>
            </div>
            <textarea
              className="w-[80%] h-[75vh] bg-gray-200 p-4 rounded-xl text-gray-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type what you want to read"
            />
          </div>
        )}
      </div>
    </main>
  );
}
