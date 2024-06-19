import {
  getCanvasFromImage,
  getImageFromSrc,
  getOffset,
} from "./imageProcessing";

export async function convolution() {
  const image = await getImageFromSrc({
    src: "https://images.unsplash.com/photo-1492370284958-c20b15c692d2?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  });

  const src_canvas = getCanvasFromImage({ image });
  const src_ctx = src_canvas.getContext("2d");
  const src_image_data = src_ctx.getImageData(
    0,
    0,
    src_canvas.width,
    src_canvas.height,
  );

  const dest_canvas = document.createElement("canvas");
  dest_canvas.width = src_canvas.width;
  dest_canvas.height = src_canvas.height;

  const dest_ctx = dest_canvas.getContext("2d");
  const dest_image_data = dest_ctx.getImageData(
    0,
    0,
    dest_canvas.width,
    dest_canvas.height,
  );

  const kernel1 = [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
  ];
  const kernel = [
    [-2, -1, 0],
    [-1, 1, 1],
    [0, 1, 2],
  ];

  // 세로 경계 검출

  const half_kernel_size = Math.floor(kernel.length / 2);

  for (let y = 0; y < src_canvas.height; y++) {
    for (let x = 0; x < src_canvas.width; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let ky = -half_kernel_size; ky <= half_kernel_size; ky++) {
        for (let kx = -half_kernel_size; kx <= half_kernel_size; kx++) {
          const px = x + kx;
          const py = y + ky;

          if (
            inRange(px, 0, src_canvas.width) &&
            inRange(py, 0, src_canvas.height)
          ) {
            const offset = getOffset(px, py, src_canvas.width);
            const weight = kernel[ky + half_kernel_size][kx + half_kernel_size];
            r += src_image_data.data[offset] * weight;
            g += src_image_data.data[offset + 1] * weight;
            b += src_image_data.data[offset + 2] * weight;
          }
        }
      }

      const offset = getOffset(x, y, src_canvas.width);

      dest_image_data.data[offset] = r;
      dest_image_data.data[offset + 1] = g;
      dest_image_data.data[offset + 2] = b;
      dest_image_data.data[offset + 3] = src_image_data.data[offset + 3];
    }
  }

  dest_ctx.putImageData(dest_image_data, 0, 0);

  document.body.appendChild(src_canvas);
  document.body.appendChild(dest_canvas);
}

function inRange(val, min, max) {
  return val >= min && val <= max;
}
