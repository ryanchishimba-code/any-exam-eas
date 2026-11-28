/** A simple ECG trace. Higher intensity means a wilder, less stable rhythm. */
export function ecgPath(width: number, height: number, intensity: number): string {
  const mid = height * 0.56;
  const beat = Math.max(48, width / 5);
  const amp = Math.max(0.2, intensity);
  let path = "";
  for (let x = 0; x <= width; x += 2) {
    const phase = (x % beat) / beat;
    let y = mid;
    if (phase > 0.12 && phase < 0.22) {
      y -= amp * height * 0.06 * Math.sin(((phase - 0.12) / 0.1) * Math.PI);
    } else if (phase >= 0.3 && phase < 0.36) {
      y += amp * height * 0.12;
    } else if (phase >= 0.36 && phase < 0.46) {
      y -= amp * height * 0.42 * Math.sin(((phase - 0.36) / 0.1) * Math.PI);
    } else if (phase >= 0.46 && phase < 0.52) {
      y += amp * height * 0.16;
    } else if (phase >= 0.6 && phase < 0.78) {
      y -= amp * height * 0.1 * Math.sin(((phase - 0.6) / 0.18) * Math.PI);
    }
    y += Math.sin(x / 18) * amp * 1.4;
    path += `${x === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return path;
}
