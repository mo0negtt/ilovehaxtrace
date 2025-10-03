import { Vertex } from '@shared/schema';

export interface CircularArcData {
  center: { x: number; y: number };
  radius: number;
  startAngle: number;
  endAngle: number;
  anticlockwise: boolean;
}

export function chordLength(v0: Vertex, v1: Vertex): number {
  const dx = v1.x - v0.x;
  const dy = v1.y - v0.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function angleToRadius(angleInDegrees: number, chord: number): number {
  const angleInRadians = (Math.abs(angleInDegrees) * Math.PI) / 180;
  if (Math.abs(angleInRadians) < 0.001) return Infinity;
  const radius = chord / (2 * Math.sin(angleInRadians / 2));
  return angleInDegrees >= 0 ? radius : -radius;
}

export function radiusToAngle(radius: number, chord: number): number {
  const absRadius = Math.abs(radius);
  if (absRadius === Infinity || absRadius <= 0 || absRadius < chord / 2) return 0;
  const sinHalfAngle = chord / (2 * absRadius);
  if (Math.abs(sinHalfAngle) > 1) return 0;
  const halfAngle = Math.asin(sinHalfAngle);
  const angle = (2 * halfAngle * 180) / Math.PI;
  return radius >= 0 ? angle : -angle;
}

export function sagittaToRadius(sagitta: number, chord: number): number {
  const absSagitta = Math.abs(sagitta);
  if (absSagitta < 0.001) return Infinity;
  const radius = (chord * chord) / (8 * absSagitta) + absSagitta / 2;
  return sagitta >= 0 ? radius : -radius;
}

export function radiusToSagitta(radius: number, chord: number): number {
  const absRadius = Math.abs(radius);
  if (absRadius === Infinity || absRadius <= 0 || absRadius < chord / 2) return 0;
  const sagitta = absRadius - Math.sqrt(absRadius * absRadius - (chord * chord) / 4);
  return radius >= 0 ? sagitta : -sagitta;
}

export function angleToSagitta(angleInDegrees: number, chord: number): number {
  const radius = angleToRadius(angleInDegrees, chord);
  return radiusToSagitta(radius, chord);
}

export function sagittaToAngle(sagitta: number, chord: number): number {
  const radius = sagittaToRadius(sagitta, chord);
  return radiusToAngle(radius, chord);
}

export function calculateCircularArc(
  v0: Vertex,
  v1: Vertex,
  curveType: 'angle' | 'radius' | 'sagitta',
  curveValue: number
): CircularArcData | null {
  const chord = chordLength(v0, v1);
  if (chord < 0.001) return null;

  let radius: number;
  let angleInDegrees: number;
  
  switch (curveType) {
    case 'angle':
      angleInDegrees = curveValue;
      radius = angleToRadius(angleInDegrees, chord);
      break;
    case 'radius':
      radius = curveValue;
      angleInDegrees = radiusToAngle(radius, chord);
      break;
    case 'sagitta':
      radius = sagittaToRadius(curveValue, chord);
      angleInDegrees = radiusToAngle(radius, chord);
      break;
  }

  const absRadius = Math.abs(radius);
  if (!isFinite(absRadius) || absRadius < chord / 2) {
    return null;
  }

  const midX = (v0.x + v1.x) / 2;
  const midY = (v0.y + v1.y) / 2;

  const dx = v1.x - v0.x;
  const dy = v1.y - v0.y;

  const normalX = -dy / chord;
  const normalY = dx / chord;

  const sign = radius >= 0 ? 1 : -1;
  const distanceToCenter = sign * Math.sqrt(absRadius * absRadius - (chord * chord) / 4);

  const centerX = midX + normalX * distanceToCenter;
  const centerY = midY + normalY * distanceToCenter;

  const angle0 = Math.atan2(v0.y - centerY, v0.x - centerX);
  const angle1 = Math.atan2(v1.y - centerY, v1.x - centerX);

  const anticlockwise = radius < 0;

  return {
    center: { x: centerX, y: centerY },
    radius: absRadius,
    startAngle: angle0,
    endAngle: angle1,
    anticlockwise,
  };
}

export function pointOnCircularArc(
  arcData: CircularArcData,
  t: number
): { x: number; y: number } {
  const { center, radius, startAngle, endAngle, anticlockwise } = arcData;
  
  let angle: number;
  if (anticlockwise) {
    let diff = startAngle - endAngle;
    if (diff < 0) diff += 2 * Math.PI;
    angle = startAngle - t * diff;
  } else {
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 2 * Math.PI;
    angle = startAngle + t * diff;
  }

  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  };
}

export function distanceToCircularArc(
  point: { x: number; y: number },
  arcData: CircularArcData
): number {
  const { center, radius } = arcData;
  const distToCenter = Math.sqrt(
    Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2)
  );

  const pointAngle = Math.atan2(point.y - center.y, point.x - center.x);
  
  const { startAngle, endAngle, anticlockwise } = arcData;
  
  let isOnArc = false;
  if (anticlockwise) {
    let diff = startAngle - endAngle;
    if (diff < 0) diff += 2 * Math.PI;
    let testDiff = startAngle - pointAngle;
    if (testDiff < 0) testDiff += 2 * Math.PI;
    isOnArc = testDiff <= diff;
  } else {
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 2 * Math.PI;
    let testDiff = pointAngle - startAngle;
    if (testDiff < 0) testDiff += 2 * Math.PI;
    isOnArc = testDiff <= diff;
  }

  if (isOnArc) {
    return Math.abs(distToCenter - radius);
  }

  const start = pointOnCircularArc(arcData, 0);
  const end = pointOnCircularArc(arcData, 1);
  const distToStart = Math.sqrt(
    Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2)
  );
  const distToEnd = Math.sqrt(
    Math.pow(point.x - end.x, 2) + Math.pow(point.y - end.y, 2)
  );

  return Math.min(distToStart, distToEnd);
}
