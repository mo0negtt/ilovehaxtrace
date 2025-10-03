import { Vertex, Segment } from "@shared/schema";

export interface RendererState {
  offsetX: number;
  offsetY: number;
  zoom: number;
  isPanning: false | { startX: number; startY: number; startOffsetX: number; startOffsetY: number };
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public state: RendererState;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;
    this.state = {
      offsetX: 0,
      offsetY: 0,
      zoom: 1,
      isPanning: false,
    };
    this.updateCanvasSize();
  }

  updateCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const canvasCenterX = rect.width / 2;
    const canvasCenterY = rect.height / 2;
    
    return {
      x: (screenX - canvasCenterX - this.state.offsetX) / this.state.zoom,
      y: (screenY - canvasCenterY - this.state.offsetY) / this.state.zoom,
    };
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const canvasCenterX = rect.width / 2;
    const canvasCenterY = rect.height / 2;
    
    return {
      x: worldX * this.state.zoom + canvasCenterX + this.state.offsetX,
      y: worldY * this.state.zoom + canvasCenterY + this.state.offsetY,
    };
  }

  clear(bgColor: string = '#1a1a1a') {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, rect.width, rect.height);
  }

  drawGrid(width: number, height: number) {
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);

    const gridSize = 50;
    const startX = Math.floor(-width / 2 / gridSize) * gridSize;
    const endX = Math.ceil(width / 2 / gridSize) * gridSize;
    const startY = Math.floor(-height / 2 / gridSize) * gridSize;
    const endY = Math.ceil(height / 2 / gridSize) * gridSize;

    for (let x = startX; x <= endX; x += gridSize) {
      const screenStart = this.worldToScreen(x, -height / 2);
      const screenEnd = this.worldToScreen(x, height / 2);
      this.ctx.beginPath();
      this.ctx.moveTo(screenStart.x, screenStart.y);
      this.ctx.lineTo(screenEnd.x, screenEnd.y);
      this.ctx.stroke();
    }

    for (let y = startY; y <= endY; y += gridSize) {
      const screenStart = this.worldToScreen(-width / 2, y);
      const screenEnd = this.worldToScreen(width / 2, y);
      this.ctx.beginPath();
      this.ctx.moveTo(screenStart.x, screenStart.y);
      this.ctx.lineTo(screenEnd.x, screenEnd.y);
      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
  }

  drawVertex(vertex: Vertex, isSelected: boolean = false, isHovered: boolean = false) {
    const screen = this.worldToScreen(vertex.x, vertex.y);
    const radius = 6;

    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
    
    if (isSelected) {
      this.ctx.fillStyle = '#3b82f6';
      this.ctx.strokeStyle = '#60a5fa';
      this.ctx.lineWidth = 2;
    } else if (isHovered) {
      this.ctx.fillStyle = '#6b7280';
      this.ctx.strokeStyle = '#9ca3af';
      this.ctx.lineWidth = 2;
    } else {
      this.ctx.fillStyle = '#ef4444';
      this.ctx.strokeStyle = '#f87171';
      this.ctx.lineWidth = 1;
    }
    
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawSegment(segment: Segment, vertices: Vertex[], isSelected: boolean = false) {
    const v0 = vertices[segment.v0];
    const v1 = vertices[segment.v1];
    
    if (!v0 || !v1) return;

    const start = this.worldToScreen(v0.x, v0.y);
    const end = this.worldToScreen(v1.x, v1.y);

    this.ctx.strokeStyle = segment.color ? `#${segment.color}` : '#ffffff';
    this.ctx.lineWidth = isSelected ? 3 : 2;

    if (segment.curve && segment.curve !== 0) {
      const curve = segment.curve;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const normalX = -dy / distance;
      const normalY = dx / distance;
      
      const controlX = (start.x + end.x) / 2 + normalX * curve * this.state.zoom;
      const controlY = (start.y + end.y) / 2 + normalY * curve * this.state.zoom;

      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
    }
  }

  getVertexAt(x: number, y: number, vertices: Vertex[]): number | null {
    const world = this.screenToWorld(x, y);
    const threshold = 10 / this.state.zoom;

    for (let i = vertices.length - 1; i >= 0; i--) {
      const vertex = vertices[i];
      const dx = world.x - vertex.x;
      const dy = world.y - vertex.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= threshold) {
        return i;
      }
    }
    
    return null;
  }

  getSegmentAt(x: number, y: number, segments: Segment[], vertices: Vertex[]): number | null {
    const world = this.screenToWorld(x, y);
    const threshold = 10 / this.state.zoom;

    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i];
      const v0 = vertices[segment.v0];
      const v1 = vertices[segment.v1];
      
      if (!v0 || !v1) continue;

      if (segment.curve && segment.curve !== 0) {
        const curve = segment.curve;
        const dx = v1.x - v0.x;
        const dy = v1.y - v0.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const normalX = -dy / distance;
        const normalY = dx / distance;
        
        const controlX = (v0.x + v1.x) / 2 + normalX * curve;
        const controlY = (v0.y + v1.y) / 2 + normalY * curve;

        for (let t = 0; t <= 1; t += 0.05) {
          const x = Math.pow(1 - t, 2) * v0.x + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * v1.x;
          const y = Math.pow(1 - t, 2) * v0.y + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * v1.y;
          
          const dist = Math.sqrt(Math.pow(world.x - x, 2) + Math.pow(world.y - y, 2));
          if (dist <= threshold) {
            return i;
          }
        }
      } else {
        const A = world.x - v0.x;
        const B = world.y - v0.y;
        const C = v1.x - v0.x;
        const D = v1.y - v0.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) param = dot / lenSq;

        let xx, yy;

        if (param < 0) {
          xx = v0.x;
          yy = v0.y;
        } else if (param > 1) {
          xx = v1.x;
          yy = v1.y;
        } else {
          xx = v0.x + param * C;
          yy = v0.y + param * D;
        }

        const dx = world.x - xx;
        const dy = world.y - yy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= threshold) {
          return i;
        }
      }
    }

    return null;
  }

  zoomIn() {
    this.state.zoom = Math.min(this.state.zoom * 1.2, 5);
  }

  zoomOut() {
    this.state.zoom = Math.max(this.state.zoom / 1.2, 0.1);
  }

  resetZoom() {
    this.state.zoom = 1;
    this.state.offsetX = 0;
    this.state.offsetY = 0;
  }

  startPan(x: number, y: number) {
    this.state.isPanning = {
      startX: x,
      startY: y,
      startOffsetX: this.state.offsetX,
      startOffsetY: this.state.offsetY,
    };
  }

  updatePan(x: number, y: number) {
    if (this.state.isPanning) {
      this.state.offsetX = this.state.isPanning.startOffsetX + (x - this.state.isPanning.startX);
      this.state.offsetY = this.state.isPanning.startOffsetY + (y - this.state.isPanning.startY);
    }
  }

  endPan() {
    this.state.isPanning = false;
  }
}
