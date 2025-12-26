import exifr from 'exifr';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            // @ts-ignore
            img.src = e.target.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function checkOriginal(file: File) {
    try {
        const exif = await exifr.parse(file, { xmp: true });
        return {
            is_google: exif?.Credit === 'Made with Google AI',
            is_original: ['ImageWidth', 'ImageHeight'].every(key => exif?.[key])
        }
    } catch {
        return { is_google: false, is_original: false };
    }
}
