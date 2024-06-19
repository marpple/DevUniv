import './style.styl';
import { howPixelPainted } from './howPixelPainted';
import { getCanvasFromImage, getImageFromSrc, imageProcessing } from './imageProcessing';
import { convolution } from './convolution';

(async () => {
  await howPixelPainted();
  // await imageProcessing();
  // await convolution();
})();
