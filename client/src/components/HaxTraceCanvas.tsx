import { useEffect, useRef, useState, useCallback } from 'react';
import { useHaxTrace } from '@/contexts/HaxTraceContext';
import { CanvasRenderer } from '@/lib/canvasRenderer';

export const HaxTraceCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const animationFrameRef = useRef<number>();
  
  const {
    map,
    currentTool,
    selectedVertices,
    selectedSegments,
    hoveredVertex,
    setHoveredVertex,
    addVertex,
    selectVertex,
    selectSegment,
    clearSegmentSelection,
    updateVertex,
    updateSegmentCurve,
  } = useHaxTrace();

  const [isDraggingVertex, setIsDraggingVertex] = useState<number | null>(null);
  const [isDraggingSegment, setIsDraggingSegment] = useState<{ index: number; startX: number; initialCurve: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const renderer = new CanvasRenderer(canvasRef.current);
    rendererRef.current = renderer;

    const handleResize = () => {
      renderer.updateCanvasSize();
      render();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const render = useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    renderer.clear(map.bg.color);
    renderer.drawGrid(map.width, map.height);

    map.segments.forEach((segment, index) => {
      const isSelected = selectedSegments.includes(index);
      renderer.drawSegment(segment, map.vertexes, isSelected);
    });

    map.vertexes.forEach((vertex, index) => {
      const isSelected = selectedVertices.includes(index);
      const isHovered = hoveredVertex === index;
      renderer.drawVertex(vertex, isSelected, isHovered);
    });
  }, [map, selectedVertices, selectedSegments, hoveredVertex]);

  useEffect(() => {
    render();
  }, [render]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const renderer = rendererRef.current;
    if (!renderer || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (e.button === 2) {
      const vertexIndex = renderer.getVertexAt(x, y, map.vertexes);
      if (vertexIndex !== null) {
        setIsDraggingVertex(vertexIndex);
        return;
      }

      const segmentIndex = renderer.getSegmentAt(x, y, map.segments, map.vertexes);
      if (segmentIndex !== null) {
        const segment = map.segments[segmentIndex];
        setIsDraggingSegment({
          index: segmentIndex,
          startX: x,
          initialCurve: segment.curve || 0,
        });
        return;
      }
    }

    if (e.button === 0) {
      if (currentTool === 'pan') {
        renderer.startPan(x, y);
        return;
      }

      if (currentTool === 'vertex') {
        const world = renderer.screenToWorld(x, y);
        addVertex(Math.round(world.x), Math.round(world.y));
        return;
      }

      if (currentTool === 'segment') {
        const vertexIndex = renderer.getVertexAt(x, y, map.vertexes);
        if (vertexIndex !== null) {
          selectVertex(vertexIndex);
          return;
        }
      }

      const segmentIndex = renderer.getSegmentAt(x, y, map.segments, map.vertexes);
      if (segmentIndex !== null) {
        selectSegment(segmentIndex, e.shiftKey);
      } else if (!e.shiftKey) {
        clearSegmentSelection();
      }
    }
  }, [currentTool, map, addVertex, selectVertex, selectSegment, clearSegmentSelection]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const renderer = rendererRef.current;
    if (!renderer || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDraggingVertex !== null) {
      const world = renderer.screenToWorld(x, y);
      updateVertex(isDraggingVertex, Math.round(world.x), Math.round(world.y));
      render();
      return;
    }

    if (isDraggingSegment !== null) {
      const deltaX = x - isDraggingSegment.startX;
      const curveChange = deltaX * 0.5;
      const newCurve = Math.max(-500, Math.min(500, isDraggingSegment.initialCurve + curveChange));
      updateSegmentCurve(isDraggingSegment.index, Math.round(newCurve));
      render();
      return;
    }

    if (renderer.state.isPanning) {
      renderer.updatePan(x, y);
      render();
      return;
    }

    const vertexIndex = renderer.getVertexAt(x, y, map.vertexes);
    if (vertexIndex !== hoveredVertex) {
      setHoveredVertex(vertexIndex);
    }
  }, [isDraggingVertex, isDraggingSegment, map, hoveredVertex, setHoveredVertex, updateVertex, updateSegmentCurve, render]);

  const handleMouseUp = useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    setIsDraggingVertex(null);
    setIsDraggingSegment(null);
    renderer.endPan();
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const renderer = rendererRef.current;
    if (!renderer) return;

    if (e.deltaY < 0) {
      renderer.zoomIn();
    } else {
      renderer.zoomOut();
    }
    render();
  }, [render]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="canvas-haxtrace"
      className="w-full h-full cursor-crosshair"
      style={{ cursor: currentTool === 'pan' ? 'grab' : 'crosshair' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
    />
  );
};
