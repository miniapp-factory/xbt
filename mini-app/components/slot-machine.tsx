"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];

function getRandomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit))
  );
  const [spinning, setSpinning] = useState(false);

  const check = (a: string, b: string, c: string) => a === b && b === c;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setGrid(prev =>
        prev.map(col => {
          const newCol = [...col];
          newCol.pop(); // remove bottom
          newCol.unshift(getRandomFruit()); // add new top
          return newCol;
        })
      );
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  const winCondition =
    !spinning &&
    (check(grid[0][0], grid[0][1], grid[0][2]) ||
      check(grid[1][0], grid[1][1], grid[1][2]) ||
      check(grid[2][0], grid[2][1], grid[2][2]) ||
      check(grid[0][0], grid[1][0], grid[2][0]) ||
      check(grid[0][1], grid[1][1], grid[2][1]) ||
      check(grid[0][2], grid[1][2], grid[2][2]));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <div
              key={`${colIdx}-${rowIdx}`}
              className="w-16 h-16 flex items-center justify-center border rounded"
            >
              <Image
                src={`/${fruit.toLowerCase()}.png`}
                alt={fruit}
                width={48}
                height={48}
              />
            </div>
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning} variant="outline">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {!spinning && winCondition && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold text-green-600">You Win!</span>
          <Share text={`I just won with the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
