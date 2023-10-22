import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray (array: Array<string>) {
  const toShuffle = [...array]

  for (let i = toShuffle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = toShuffle[i]
    toShuffle[i] = toShuffle[j]
    toShuffle[j] = temp
  }

  return toShuffle
}
