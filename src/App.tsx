import React, { useState, useEffect } from "react";
import { generate2DGrid } from "./generate2DArray";

type numObject = {
  id: number;
  value: number;
  guessed: boolean;
  opened: boolean;
  disabled: boolean;
};
let correctGuesses = 0;

function App() {
  // Must be 4, 6 or 8
  const [defaultGridSize, setDefaultGridSize] = useState(4);
  const [grid, setGrid] = useState<numObject[][]>();
  const [prevNumber, setPrevNumber] = useState<numObject | null>(null);
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gameInit = () => {
    correctGuesses = 0;
    setGrid(generate2DGrid(defaultGridSize));
    setPrevNumber(null);
    setSteps(0);
    setTime(0);
    setGameFinished(false);
    setMenuOpened(false);
    setGameStarted(false);
  };

  const handleCardClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    numberObj: numObject
  ) => {
    e.preventDefault();
    if (!gameStarted) {
      setGameStarted(true);
    }
    const current = numberObj;

    if (!prevNumber) {
      setGrid((oldGrid) => {
        return oldGrid?.map((insideArray) => {
          return insideArray.map((item) => {
            if (item.id === current.id) {
              return { ...item, opened: true, disabled: true };
            } else {
              return item;
            }
          });
        });
      });
      setPrevNumber(numberObj);
    } else {
      if (prevNumber.value === current.value) {
        setGrid((oldGrid) => {
          return oldGrid?.map((insideArray) => {
            return insideArray.map((item) => {
              if (item.id === current.id) {
                return {
                  ...item,
                  opened: false,
                  guessed: true,
                  disabled: true,
                };
              } else if (item.id === prevNumber.id) {
                return {
                  ...item,
                  opened: false,
                  guessed: true,
                  disabled: true,
                };
              } else {
                return item;
              }
            });
          });
        });
        correctGuesses += 1;
      } else {
        setGrid((oldGrid) => {
          return oldGrid?.map((insideArray) => {
            return insideArray.map((item) => {
              if (item.id === current.id) {
                return {
                  ...item,
                  opened: true,
                  guessed: false,
                  disabled: true,
                };
              } else if (item.id === prevNumber.id) {
                return {
                  ...item,
                  opened: true,
                  guessed: false,
                  disabled: true,
                };
              } else {
                return { ...item, disabled: true };
              }
            });
          });
        });
        setTimeout(() => {
          setGrid((oldGrid) => {
            return oldGrid?.map((insideArray) => {
              return insideArray.map((item) => {
                if (item.id === current.id) {
                  return {
                    ...item,
                    opened: false,
                    guessed: false,
                    disabled: false,
                  };
                } else if (item.id === prevNumber.id) {
                  return {
                    ...item,
                    opened: false,
                    guessed: false,
                    disabled: false,
                  };
                } else {
                  return { ...item, disabled: item.guessed ? true : false };
                }
              });
            });
          });
        }, 1000);
      }

      setPrevNumber(null);
      setSteps((prev) => prev + 1);

      let gameFinished =
        correctGuesses === (defaultGridSize * defaultGridSize) / 2;
      if (gameFinished) {
        setGameStarted(false);
        setGameFinished(gameFinished);
      }
    }
  };

  const changeDifficulty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setDefaultGridSize(+e.target.value);
  };

  useEffect(() => {
    gameInit();
  }, []);

  useEffect(() => {
    let stopwatch: number;
    if (gameStarted) {
      stopwatch = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(stopwatch);
    };
  }, [gameStarted]);

  return (
    <>
      {gameFinished ? (
        <div className="fixed h-screen w-screen flex flex-col items-center justify-center bg-black bg-opacity-80 text-white">
          <div className="bg-gray-600 rounded-md flex flex-col p-12 items-center justify-center">
            <h5 className="text-[3rem] mb-12">FINISHED!</h5>
            <h6 className="text-lg mb-6">Your score:</h6>
            <p className="flex items-center">
              Moves: <span className="font-bold text-2xl pl-6">{steps}</span>
            </p>
            <p>
              Time:{" "}
              <span className="font-bold text-2xl pl-6">
                {Math.floor(time / 60)}:
                {(time % 60).toString().padStart(2, "0")}
              </span>
            </p>
            <button
              onClick={gameInit}
              className="tracking-wider bg-teal-800 hover:bg-teal-700 border-2 hover:border-teal-100 border-opacity-50 transition-colors duration-300 font-bold mt-12 py-1 px-3 rounded-full"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      ) : null}
      {menuOpened ? (
        <div className="fixed h-screen w-screen flex flex-col items-center justify-center bg-black bg-opacity-80">
          <div className=" bg-gray-600 rounded-md flex flex-col p-12 items-center justify-center">
            <label
              htmlFor="game-difficulty"
              className="text-[3rem] mb-12 text-white"
            >
              Difficulty
            </label>
            <select
              defaultValue={defaultGridSize}
              onChange={(e) => changeDifficulty(e)}
              className="w-full p-3 rounded-md"
              name="level"
              id="game-difficulty"
            >
              <option value="4">Easy</option>
              <option value="6">Medium</option>
              <option value="8">Hard</option>
            </select>
            <button
              onClick={gameInit}
              className="tracking-wider bg-teal-800 hover:bg-teal-700 border-2 hover:border-teal-100 border-opacity-50 transition-colors duration-300 text-white font-bold mt-12 py-1 px-3 rounded-full"
            >
              START
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col justify-between min-h-[100dvh] max-w-[900px] mx-auto dark:bg-neutral-800">
        <header className="py-6 px-6 flex justify-between">
          <h1 className="font-bold font-mono text-2xl text-blue-600">memo</h1>
          <div>
            <button
              onClick={gameInit}
              className="tracking-wider bg-teal-800 hover:bg-teal-700 border-2 hover:border-teal-100 border-opacity-50 transition-colors duration-300 text-white font-bold py-1 px-3 rounded-full"
            >
              RESTART
            </button>
            <button
              className="tracking-wider bg-zinc-100 hover:bg-zinc-200 border-2 transition-colors duration-300 text-teal-800 font-bold py-1 ml-3 px-3 rounded-full"
              onClick={() => setMenuOpened((prev) => !prev)}
            >
              LEVELS
            </button>
          </div>
        </header>
        <main className="flex items-center justify-center">
          <section className="h-[100vw] max-w-[500px] lg:max-w-[700px] max-h-[500px] lg:max-h-[700px] w-full flex flex-col gap-1 items-center justify-center p-2 sm:p-6">
            {grid?.map((arr, i) => {
              return (
                <div
                  className={`flex items-center h-1/4 justify-center w-full gap-1`}
                  key={i}
                >
                  {arr.map((number, j) => {
                    return (
                      <button
                        name="game-button"
                        className={`w-1/4 h-full group flex items-center justify-center rounded-xl text-white text-3xl ${
                          defaultGridSize === 6 ? "text-2xl" : ""
                        } ${
                          defaultGridSize === 8 ? "text-xl" : ""
                        } transition-colors duration-200 ${
                          number.opened ? "bg-green-600" : "bg-blue-600"
                        } ${number.guessed ? "bg-orange-400" : ""}`}
                        key={number.id}
                        id={number.id.toString()}
                        onClick={(e) => handleCardClick(e, number)}
                        disabled={number.disabled}
                      >
                        <p
                          className={
                            number.guessed || number.opened
                              ? "inline"
                              : "hidden"
                          }
                        >
                          {number.value}
                        </p>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </section>
        </main>
        <footer className="flex gap-1">
          <div className="bg-blue-200 dark:bg-gray-600 w-1/2 my-6 ml-2 sm:ml-6 mr-0 py-3 flex flex-col items-center rounded-md">
            <p>Time</p>
            <p className="text-2xl font-bold">
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
            </p>
          </div>
          <div className="bg-blue-200 dark:bg-gray-600 w-1/2 my-6 mr-2 sm:mr-6 ml-0 py-3 flex flex-col items-center rounded-md">
            <p>Moves</p>
            <p className="text-2xl font-bold">{steps}</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
