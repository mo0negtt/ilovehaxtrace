import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { HaxMap, Vertex, Segment, BackgroundImage } from '@shared/schema';

export type Tool = 'vertex' | 'segment' | 'pan';

interface HaxTraceContextType {
  map: HaxMap;
  setMap: (map: HaxMap) => void;
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
  selectedVertices: number[];
  selectedSegments: number[];
  hoveredVertex: number | null;
  setHoveredVertex: (index: number | null) => void;
  segmentColor: string;
  setSegmentColor: (color: string) => void;
  curveType: 'angle' | 'radius' | 'sagitta';
  setCurveType: (type: 'angle' | 'radius' | 'sagitta') => void;
  curveValue: number;
  setCurveValue: (value: number) => void;
  addVertex: (x: number, y: number) => void;
  addSegment: (v0: number, v1: number, color?: string) => void;
  selectVertex: (index: number) => void;
  clearVertexSelection: () => void;
  selectSegment: (index: number, multiSelect?: boolean) => void;
  clearSegmentSelection: () => void;
  updateVertex: (index: number, x: number, y: number) => void;
  updateSegmentCurve: (index: number, type: 'angle' | 'radius' | 'sagitta', value: number) => void;
  deleteSelectedSegments: () => void;
  setBackgroundImage: (dataURL: string) => void;
  updateBackgroundImage: (bgImage: BackgroundImage) => void;
  removeBackgroundImage: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  importMap: (mapData: HaxMap) => void;
  exportMap: () => HaxMap;
}

const HaxTraceContext = createContext<HaxTraceContextType | undefined>(undefined);

export const useHaxTrace = () => {
  const context = useContext(HaxTraceContext);
  if (!context) {
    throw new Error('useHaxTrace must be used within HaxTraceProvider');
  }
  return context;
};

interface HaxTraceProviderProps {
  children: ReactNode;
}

const defaultMap: HaxMap = {
  id: '1',
  name: 'HaxTrace',
  width: 420,
  height: 200,
  bg: { color: '#718C5A' },
  vertexes: [
    { x: -115, y: -87.9921875 },
    { x: 74, y: -89.9921875 },
    { x: 74, y: 108.0078125 }
  ],
  segments: [
    { v0: 0, v1: 1 },
    { v0: 1, v1: 2 },
    { v0: 0, v1: 2, curve: -90.56402280711765 },
    { v0: 2, v1: 0, curve: -90.56402280711765 }
  ],
};

export const HaxTraceProvider = ({ children }: HaxTraceProviderProps) => {
  const [map, setMapInternal] = useState<HaxMap>(defaultMap);
  const [currentTool, setCurrentTool] = useState<Tool>('vertex');
  const [selectedVertices, setSelectedVertices] = useState<number[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<number[]>([]);
  const [hoveredVertex, setHoveredVertex] = useState<number | null>(null);
  const [segmentColor, setSegmentColor] = useState<string>('ffffff');
  const [curveType, setCurveType] = useState<'angle' | 'radius' | 'sagitta'>('angle');
  const [curveValue, setCurveValue] = useState<number>(0);
  
  const [history, setHistory] = useState<HaxMap[]>([defaultMap]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveHistory = useCallback((newMap: HaxMap) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newMap]);
    setHistoryIndex(prev => prev + 1);
    setMapInternal(newMap);
  }, [historyIndex]);

  const setMap = useCallback((newMap: HaxMap) => {
    saveHistory(newMap);
  }, [saveHistory]);

  const addVertex = useCallback((x: number, y: number) => {
    const newMap = {
      ...map,
      vertexes: [...map.vertexes, { x, y }],
    };
    saveHistory(newMap);
  }, [map, saveHistory]);

  const addSegment = useCallback((v0: number, v1: number, color?: string) => {
    const segment: Segment = {
      v0,
      v1,
      ...(color && { color }),
      ...(curveValue !== 0 && {
        curveData: {
          type: curveType,
          value: curveValue,
        },
      }),
    };
    const newMap = {
      ...map,
      segments: [...map.segments, segment],
    };
    saveHistory(newMap);
    setSelectedVertices([]);
  }, [map, saveHistory, curveType, curveValue]);

  const selectVertex = useCallback((index: number) => {
    if (currentTool === 'segment') {
      setSelectedVertices(prev => {
        if (prev.includes(index)) return prev;
        const newSelection = [...prev, index];
        
        if (newSelection.length === 2) {
          addSegment(newSelection[0], newSelection[1], segmentColor);
          return [];
        }
        
        return newSelection;
      });
    }
  }, [currentTool, addSegment, segmentColor]);

  const clearVertexSelection = useCallback(() => {
    setSelectedVertices([]);
  }, []);

  const selectSegment = useCallback((index: number, multiSelect: boolean = false) => {
    if (multiSelect) {
      setSelectedSegments(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setSelectedSegments([index]);
    }
  }, []);

  const clearSegmentSelection = useCallback(() => {
    setSelectedSegments([]);
  }, []);

  const updateVertex = useCallback((index: number, x: number, y: number) => {
    const newVertexes = [...map.vertexes];
    newVertexes[index] = { x, y };
    const newMap = {
      ...map,
      vertexes: newVertexes,
    };
    saveHistory(newMap);
  }, [map, saveHistory]);

  const updateSegmentCurve = useCallback((index: number, type: 'angle' | 'radius' | 'sagitta', value: number) => {
    const newSegments = [...map.segments];
    newSegments[index] = {
      ...newSegments[index],
      curveData: { type, value },
    };
    const newMap = {
      ...map,
      segments: newSegments,
    };
    saveHistory(newMap);
  }, [map, saveHistory]);

  const deleteSelectedSegments = useCallback(() => {
    if (selectedSegments.length === 0) return;
    
    const newSegments = map.segments.filter((_, index) => !selectedSegments.includes(index));
    const newMap = {
      ...map,
      segments: newSegments,
    };
    saveHistory(newMap);
    setSelectedSegments([]);
  }, [map, selectedSegments, saveHistory]);

  const setBackgroundImage = useCallback((dataURL: string) => {
    const newMap = {
      ...map,
      bg: {
        ...map.bg,
        image: {
          dataURL,
          opacity: 0.5,
          scale: 1,
          offsetX: 0,
          offsetY: 0,
          fitMode: 'center' as const,
          locked: false,
        },
      },
    };
    saveHistory(newMap);
  }, [map, saveHistory]);

  const updateBackgroundImage = useCallback((bgImage: BackgroundImage) => {
    const newMap = {
      ...map,
      bg: {
        ...map.bg,
        image: bgImage,
      },
    };
    saveHistory(newMap);
  }, [map, saveHistory]);

  const removeBackgroundImage = useCallback(() => {
    const newMap = {
      ...map,
      bg: {
        color: map.bg.color,
      },
    };
    saveHistory(newMap);
  }, [map, saveHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setMapInternal(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setMapInternal(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  const importMap = useCallback((mapData: HaxMap) => {
    const importedMap = {
      ...mapData,
      vertexes: mapData.vertexes.map(v => ({ ...v })),
      segments: mapData.segments.map(s => ({
        ...s,
        curve: s.curve ? -s.curve : s.curve,
      })),
    };
    setHistory([importedMap]);
    setHistoryIndex(0);
    setMapInternal(importedMap);
    setSelectedVertices([]);
    setSelectedSegments([]);
  }, []);

  const exportMap = useCallback(() => {
    return {
      ...map,
      segments: map.segments.map(s => ({
        ...s,
        curve: s.curve ? -s.curve : s.curve,
      })),
    };
  }, [map]);

  const value: HaxTraceContextType = {
    map,
    setMap,
    currentTool,
    setCurrentTool,
    selectedVertices,
    selectedSegments,
    hoveredVertex,
    setHoveredVertex,
    segmentColor,
    setSegmentColor,
    curveType,
    setCurveType,
    curveValue,
    setCurveValue,
    addVertex,
    addSegment,
    selectVertex,
    clearVertexSelection,
    selectSegment,
    clearSegmentSelection,
    updateVertex,
    updateSegmentCurve,
    deleteSelectedSegments,
    setBackgroundImage,
    updateBackgroundImage,
    removeBackgroundImage,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    importMap,
    exportMap,
  };

  return (
    <HaxTraceContext.Provider value={value}>
      {children}
    </HaxTraceContext.Provider>
  );
};
