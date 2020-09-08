/**
 * covert canvas to image
 * and save the image file
 */
export declare const Canvas2Image: {
    saveAsImage: (canvas: any, width: any, height: any, type: any) => void;
    saveAsPNG: (canvas: any, width: number, height: number) => void;
    saveAsJPEG: (canvas: any, width: number, height: number) => void;
    saveAsGIF: (canvas: any, width: number, height: number) => void;
    saveAsBMP: (canvas: any, width: number, height: number) => void;
    convertToImage: (canvas: any, width: any, height: any, type: any) => HTMLImageElement | undefined;
    convertToPNG: (canvas: any, width: number, height: number) => HTMLImageElement | undefined;
    convertToJPEG: (canvas: any, width: number, height: number) => HTMLImageElement | undefined;
    convertToGIF: (canvas: any, width: number, height: number) => HTMLImageElement | undefined;
    convertToBMP: (canvas: any, width: number, height: number) => HTMLImageElement | undefined;
};
