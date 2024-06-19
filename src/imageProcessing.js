/**
 * @define imageProcessing 이미지 픽셀일 1:1 매핑하여 원하는 효과를 구현하는 방법
 * */
export async function imageProcessing() {
  const image = await getImageFromSrc({
    src: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  });

  const canvas = getCanvasFromImage({ image });
  const dest_canvas = pixelManipulation({ src_canvas: canvas });

  document.body.appendChild(canvas);
  document.body.appendChild(dest_canvas);
}

/**
 * @define pixelManipulation 원하는 효과를 얻기 위한 픽셀 처리 방법
 * @param {HTMLCanvasElement} src_canvas
 * @return {HTMLCanvasElement} dest_canvas
 * */
export function pixelManipulation({ src_canvas }) {
  const src_ctx = src_canvas.getContext('2d');
  const src_image_data = src_ctx.getImageData(0, 0, src_canvas.width, src_canvas.height);

  const dest_canvas = document.createElement('canvas');
  dest_canvas.width = src_canvas.width;
  dest_canvas.height = src_canvas.height;

  const dest_ctx = dest_canvas.getContext('2d');
  const dest_image_data = dest_ctx.getImageData(0, 0, dest_canvas.width, dest_canvas.height);

  // 픽셀 처리를 위한 함수 자유롭게 적용 가능
  function process(x, coefficient, gray) {
    // brightness - linear
    return x * coefficient;

    // brightness - gamma
    // return 255 * Math.pow(x / 255, coefficient);

    // contrast - linear
    // return 255 * ((x / 255 - 0.5) * coefficient + 0.5);

    // contrast - sigmoid
    // return 255 / (1 + Math.exp(-coefficient * (x / 255 - 0.5)));

    // saturation
    // return x * coefficient + gray * (1 - coefficient);
  }

  const COEFF = 1.3;

  for (let y = 0; y < src_canvas.height; y++) {
    for (let x = 0; x < src_canvas.width; x++) {
      const offset = getOffset(x, y, src_canvas.width);
      const r = src_image_data.data[offset];
      const g = src_image_data.data[offset + 1];
      const b = src_image_data.data[offset + 2];

      const gray = (r + g + b) / 3;

      dest_image_data.data[offset] = process(r, COEFF, gray);
      dest_image_data.data[offset + 1] = process(g, COEFF, gray);
      dest_image_data.data[offset + 2] = process(b, COEFF, gray);
      dest_image_data.data[offset + 3] = src_image_data.data[offset + 3];
    }
  }

  dest_ctx.putImageData(dest_image_data, 0, 0);

  return dest_canvas;
}

/**
 * @define 이미지 데이터 내 픽셀 어레이의 인덱스를 구하는 방법
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @return {number} index in pixel array
 * */
export function getOffset(x, y, w) {
  return (y * w + x) * 4;
}

/**
 * @define getCanvasFromImage 이미지 객체를 받아 캔버스로 변환하는 방법
 * @param {HTMLImageElement} image
 * @return {HTMLCanvasElement} canvas
 * */
export function getCanvasFromImage({ image }) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return canvas;
}

/**
 * @define getImageFromSrc
 * @param {string} src
 * @return {Promise<HTMLImageElement>} image
 * */
export function getImageFromSrc({ src }) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;
  });
}
