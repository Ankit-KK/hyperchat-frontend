import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Sculptural interpretation of the owner's HC / speech-tail reference.
 * These paths are model geometry, never a substitute for the official logo asset.
 * Coordinates follow the supplied reference's proportions; material finishes
 * belong to the neutral/copper scene, while the logo artwork keeps its colors.
 */
export function createHyperchatGeometry(part: "h" | "chat") {
  const centerX = part === "h" ? 646.5 : 842.5;
  const unit = 0.0107;
  const shape = new THREE.Shape();
  const point = (x: number, y: number) =>
    [(x - centerX) * unit, (500 - y) * unit] as const;
  const move = (x: number, y: number) => shape.moveTo(...point(x, y));
  const line = (x: number, y: number) => shape.lineTo(...point(x, y));
  const curve = (cx: number, cy: number, x: number, y: number) =>
    shape.quadraticCurveTo(...point(cx, cy), ...point(x, y));
  if (part === "h") {
    move(576, 355);
    line(633, 355);
    curve(638, 355, 638, 360);
    line(638, 450);
    line(722, 450);
    line(722, 511);
    line(638, 511);
    line(638, 609);
    curve(638, 614, 633, 614);
    line(576, 614);
    curve(571, 614, 571, 609);
    line(571, 360);
    curve(571, 355, 576, 355);
  } else {
    move(779, 355);
    line(884, 355);
    curve(955, 355, 971, 424);
    curve(973, 428, 968, 430);
    line(915, 449);
    curve(910, 451, 908, 445);
    curve(900, 413, 866, 413);
    line(813, 413);
    curve(777, 413, 777, 449);
    line(777, 514);
    curve(777, 550, 813, 550);
    line(865, 550);
    curve(902, 550, 908, 517);
    curve(909, 510, 915, 512);
    line(968, 532);
    curve(972, 533, 970, 539);
    curve(953, 614, 884, 614);
    line(831, 614);
    line(831, 641);
    curve(831, 647, 826, 644);
    line(767, 614);
    curve(713, 588, 713, 546);
    line(713, 420);
    curve(713, 355, 779, 355);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.48,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 20,
  });
  geometry.translate(0, 0, -0.24);
  geometry.deleteAttribute("normal");
  geometry.deleteAttribute("uv");
  const smooth = mergeVertices(geometry, 0.0001);
  geometry.dispose();
  smooth.computeVertexNormals();
  return smooth;
}
