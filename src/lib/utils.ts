import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeConvert(localDateTime:string){
  const date = new Date(localDateTime);
  return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`
}