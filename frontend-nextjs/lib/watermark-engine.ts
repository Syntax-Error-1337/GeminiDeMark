import { calculateAlphaMap } from './alpha-map';
import { removeWatermark } from './blend-modes';

export interface WatermarkConfig {
    logoSize: number;
    marginRight: number;
    marginBottom: number;
}

export interface WatermarkPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface WatermarkInfo {
    size: number;
    position: WatermarkPosition;
    config: WatermarkConfig;
    imageWidth: number;
    imageHeight: number;
}

/**
 * Detect watermark configuration based on image size
 */
export function detectWatermarkConfig(imageWidth: number, imageHeight: number): WatermarkConfig {
    // Gemini's watermark rules:
    // If both image width and height are greater than 1024, use 96×96 watermark
    // Otherwise, use 48×48 watermark
    if (imageWidth > 1024 && imageHeight > 1024) {
        return {
            logoSize: 96,
            marginRight: 64,
            marginBottom: 64
        };
    } else {
        return {
            logoSize: 48,
            marginRight: 32,
            marginBottom: 32
        };
    }
}

/**
 * Calculate watermark position in image based on image size and watermark configuration
 */
export function calculateWatermarkPosition(imageWidth: number, imageHeight: number, config: WatermarkConfig): WatermarkPosition {
    const { logoSize, marginRight, marginBottom } = config;

    return {
        x: imageWidth - marginRight - logoSize,
        y: imageHeight - marginBottom - logoSize,
        width: logoSize,
        height: logoSize
    };
}

/**
 * Watermark engine class
 * Coordinate watermark detection, alpha map calculation, and removal operations
 */
export class WatermarkEngine {
    private bgCaptures: { bg48: HTMLImageElement; bg96: HTMLImageElement };
    private alphaMaps: Record<number, Float32Array>;

    constructor(bgCaptures: { bg48: HTMLImageElement; bg96: HTMLImageElement }) {
        this.bgCaptures = bgCaptures;
        this.alphaMaps = {};
    }

    static async create(): Promise<WatermarkEngine> {
        // Ensure this only runs in client-side environment
        if (typeof window === 'undefined') {
            throw new Error('WatermarkEngine can only be initialized on the client side');
        }

        const bg48 = new Image();
        const bg96 = new Image();

        await Promise.all([
            new Promise((resolve, reject) => {
                bg48.onload = resolve;
                bg48.onerror = reject;
                bg48.src = '/assets/bg_48.png';
            }),
            new Promise((resolve, reject) => {
                bg96.onload = resolve;
                bg96.onerror = reject;
                bg96.src = '/assets/bg_96.png';
            })
        ]);

        return new WatermarkEngine({ bg48, bg96 });
    }

    /**
     * Get alpha map from background captured image based on watermark size
     */
    async getAlphaMap(size: number): Promise<Float32Array> {
        // If cached, return directly
        if (this.alphaMaps[size]) {
            return this.alphaMaps[size];
        }

        // Select corresponding background capture based on watermark size
        const bgImage = size === 48 ? this.bgCaptures.bg48 : this.bgCaptures.bg96;

        // Create temporary canvas to extract ImageData
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');

        ctx.drawImage(bgImage, 0, 0);

        const imageData = ctx.getImageData(0, 0, size, size);

        // Calculate alpha map
        const alphaMap = calculateAlphaMap(imageData);

        // Cache result
        this.alphaMaps[size] = alphaMap;

        return alphaMap;
    }

    /**
     * Remove watermark from image based on watermark size
     */
    async removeWatermarkFromImage(image: HTMLImageElement | HTMLCanvasElement): Promise<HTMLCanvasElement> {
        // Create canvas to process image
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');

        // Draw original image onto canvas
        ctx.drawImage(image, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Detect watermark configuration
        const config = detectWatermarkConfig(canvas.width, canvas.height);
        const position = calculateWatermarkPosition(canvas.width, canvas.height, config);

        // Get alpha map for watermark size
        const alphaMap = await this.getAlphaMap(config.logoSize);

        // Remove watermark from image data
        removeWatermark(imageData, alphaMap, position);

        // Write processed image data back to canvas
        ctx.putImageData(imageData, 0, 0);

        return canvas;
    }

    /**
     * Get watermark information (for display)
     */
    getWatermarkInfo(imageWidth: number, imageHeight: number): WatermarkInfo {
        const config = detectWatermarkConfig(imageWidth, imageHeight);
        const position = calculateWatermarkPosition(imageWidth, imageHeight, config);

        return {
            size: config.logoSize,
            position: position,
            config: config,
            imageWidth,
            imageHeight
        };
    }

    /**
     * Process a file and return the result blob and watermark info
     */
    async process(file: File): Promise<{ blob: Blob; watermarkInfo: WatermarkInfo }> {
        // Load image
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = URL.createObjectURL(file);
        });

        const canvas = await this.removeWatermarkFromImage(img);
        const watermarkInfo = this.getWatermarkInfo(img.width, img.height);

        // Convert to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => {
                if (b) resolve(b);
                else reject(new Error('Canvas to Blob failed'));
            }, file.type);
        });

        return { blob, watermarkInfo };
    }
}
