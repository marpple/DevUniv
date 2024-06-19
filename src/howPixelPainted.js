/**
 * @define howPixelPainted 이미지 데이터를 이용해서 원하는 픽셀을 한땀 한땀 그리는 방법
 * */
export function howPixelPainted() {
  const canvas = document.createElement('canvas');
  canvas.classList.add('pixels');
  canvas.width = 2;
  canvas.height = 2;

  const ctx = canvas.getContext('2d');
  const image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const pixel1 = [255, 0, 0, 255];
  const pixel2 = [0, 255, 0, 255];
  const pixel3 = [0, 0, 255, 255];
  const pixel4 = [255, 0, 255, 255];

  const pixel_data = new Uint8ClampedArray([pixel1, pixel2, pixel3, pixel4].flat());

  image_data.data.set(pixel_data);

  ctx.putImageData(image_data, 0, 0);

  document.body.appendChild(canvas);
}
