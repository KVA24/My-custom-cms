import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===== String Utils =====
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export const truncate = (str: string, length: number) =>
  str.length > length ? str.substring(0, length) + "..." : str;

// ===== Number Utils =====
export const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-US").format(num);

export const formatCurrency = (
  num: number,
  currency: string = "USD",
  locale: string = "en-US"
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(num);

export const numberFormat = (value: number, locale: string = "vi-VN"): string => {
  return new Intl.NumberFormat(locale).format(value)
}

// ===== Date Utils =====
export const formatDate = (
  date: string | Date,
  locale: string = "en-US"
) => new Date(date).toLocaleDateString(locale);

export const timeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

export function dateTimeFormat(timestamp: number): string {
  const date = new Date(timestamp)
  const pad = (n: number) => n.toString().padStart(2, "0")
  
  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1) // tháng bắt đầu từ 0
  const year = date.getFullYear()
  
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

// ===== Object & Array Utils =====
export const deepClone = <T>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

export const uniqueArray = <T>(arr: T[]): T[] =>
  Array.from(new Set(arr));

export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => void>(
  fn: T,
  limit: number
) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ===== DOM Utils =====
export const scrollToTop = () =>
  window.scrollTo({top: 0, behavior: "smooth"});

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// ===== File Utils =====
export const downloadFile = (blob: Blob, filename: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
