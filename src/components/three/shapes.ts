import * as THREE from "three";

export function heartShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.1, -0.35, -0.55, -0.15, -0.55, 0.15);
  s.bezierCurveTo(-0.55, 0.42, -0.3, 0.55, -0.12, 0.48);
  s.bezierCurveTo(-0.05, 0.45, 0, 0.38, 0, 0.32);
  s.bezierCurveTo(0, 0.38, 0.05, 0.45, 0.12, 0.48);
  s.bezierCurveTo(0.3, 0.55, 0.55, 0.42, 0.55, 0.15);
  s.bezierCurveTo(0.55, -0.15, 0.1, -0.35, 0, -0.5);
  return s;
}

/** Ngôi sao 4 cánh kiểu sparkle Y2K */
export function sparkleShape(outer = 0.5, inner = 0.12) {
  const s = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / 8) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

/** Đùn hình 2D thành khối bo tròn, căn tâm về gốc toạ độ */
export function puffy(
  shape: THREE.Shape,
  options: THREE.ExtrudeGeometryOptions = {},
) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 6,
    curveSegments: 24,
    ...options,
  });
  g.center();
  return g;
}
