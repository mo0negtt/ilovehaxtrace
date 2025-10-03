import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { type Layer, type Tile, type GameMap } from "@shared/schema";

type Tool = 'select' | 'pencil' | 'eraser' | 'fill' | 'rectangle' | 'circle' | 'move' | 'pan';

interface EditorState {
  currentMap: Omit<GameMap, 'id' | 'createdAt' | 'updatedAt'> | null;
  activeTool: Tool;
  activeLayerId: string | null;
  selectedTileColor: string;
  zoom: number;
  history: Omit<GameMap, 'id' | 'createdAt' | 'updatedAt'>[];
  historyIndex: number;
}

interface EditorContextType extends EditorState {
  setActiveTool: (tool: Tool) => void;
  setActiveLayer: (layerId: string) => void;
  setSelectedTileColor: (color: string) => void;
  setZoom: (zoom: number) => void;
  addTile: (layerId: string, tile: Tile) => void;
  removeTile: (layerId: string, x: number, y: number) => void;
  fillArea: (layerId: string, startX: number, startY: number, color: string) => void;
  addLayer: (name: string) => void;
  removeLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  updateMapSettings: (settings: Partial<Pick<GameMap, 'name' | 'width' | 'height' | 'tileSize'>>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  createNewMap: (name: string, width: number, height: number, tileSize: number) => void;
  loadMap: (map: GameMap) => void;
  exportMap: () => string;
  importMap: (jsonData: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EditorState>({
    currentMap: {
      name: "Untitled Map",
      width: 32,
      height: 24,
      tileSize: 32,
      layers: [
        { id: '1', name: 'Background', visible: true, locked: false, tiles: [], opacity: 100 },
        { id: '2', name: 'Terrain', visible: true, locked: false, tiles: [], opacity: 100 },
        { id: '3', name: 'Objects', visible: true, locked: false, tiles: [], opacity: 100 },
      ],
    },
    activeTool: 'pencil',
    activeLayerId: '2',
    selectedTileColor: '#3b82f6',
    zoom: 100,
    history: [],
    historyIndex: -1,
  });

  const saveToHistory = useCallback((newMap: Omit<GameMap, 'id' | 'createdAt' | 'updatedAt'>) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newMap);
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const setActiveTool = useCallback((tool: Tool) => {
    setState(prev => ({ ...prev, activeTool: tool }));
  }, []);

  const setActiveLayer = useCallback((layerId: string) => {
    setState(prev => ({ ...prev, activeLayerId: layerId }));
  }, []);

  const setSelectedTileColor = useCallback((color: string) => {
    setState(prev => ({ ...prev, selectedTileColor: color }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom }));
  }, []);

  const addTile = useCallback((layerId: string, tile: Tile) => {
    setState(prev => {
      if (!prev.currentMap) return prev;
      
      const newLayers = prev.currentMap.layers.map(layer => {
        if (layer.id !== layerId) return layer;
        const existingTileIndex = layer.tiles.findIndex(t => t.x === tile.x && t.y === tile.y);
        const newTiles = [...layer.tiles];
        if (existingTileIndex >= 0) {
          newTiles[existingTileIndex] = tile;
        } else {
          newTiles.push(tile);
        }
        return { ...layer, tiles: newTiles };
      });

      const newMap = { ...prev.currentMap, layers: newLayers };
      saveToHistory(newMap);
      return { ...prev, currentMap: newMap };
    });
  }, [saveToHistory]);

  const removeTile = useCallback((layerId: string, x: number, y: number) => {
    setState(prev => {
      if (!prev.currentMap) return prev;
      
      const newLayers = prev.currentMap.layers.map(layer => {
        if (layer.id !== layerId) return layer;
        return { ...layer, tiles: layer.tiles.filter(t => !(t.x === x && t.y === y)) };
      });

      const newMap = { ...prev.currentMap, layers: newLayers };
      saveToHistory(newMap);
      return { ...prev, currentMap: newMap };
    });
  }, [saveToHistory]);

  const fillArea = useCallback((layerId: string, startX: number, startY: number, color: string) => {
    setState(prev => {
      if (!prev.currentMap) return prev;

      const layer = prev.currentMap.layers.find(l => l.id === layerId);
      if (!layer) return prev;

      const targetTile = layer.tiles.find(t => t.x === startX && t.y === startY);
      const targetColor = targetTile?.color || '';

      if (targetColor === color) return prev;

      const visited = new Set<string>();
      const toFill: Tile[] = [];
      const queue: [number, number][] = [[startX, startY]];

      while (queue.length > 0) {
        const [x, y] = queue.shift()!;
        const key = `${x},${y}`;

        if (visited.has(key)) continue;
        if (x < 0 || x >= prev.currentMap.width || y < 0 || y >= prev.currentMap.height) continue;

        visited.add(key);

        const tile = layer.tiles.find(t => t.x === x && t.y === y);
        const tileColor = tile?.color || '';

        if (tileColor === targetColor) {
          toFill.push({ x, y, color });
          queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
      }

      const newLayers = prev.currentMap.layers.map(l => {
        if (l.id !== layerId) return l;
        const newTiles = [...l.tiles.filter(t => !toFill.some(f => f.x === t.x && f.y === t.y)), ...toFill];
        return { ...l, tiles: newTiles };
      });

      const newMap = { ...prev.currentMap, layers: newLayers };
      saveToHistory(newMap);
      return { ...prev, currentMap: newMap };
    });
  }, [saveToHistory]);

  const addLayer = useCallback((name: string) => {
    setState(prev => {
      if (!prev.currentMap) return prev;
      const newLayer: Layer = {
        id: String(Date.now()),
        name,
        visible: true,
        locked: false,
        tiles: [],
        opacity: 100,
      };
      const newMap = { ...prev.currentMap, layers: [...prev.currentMap.layers, newLayer] };
      saveToHistory(newMap);
      return { ...prev, currentMap: newMap };
    });
  }, [saveToHistory]);

  const removeLayer = useCallback((layerId: string) => {
    setState(prev => {
      if (!prev.currentMap) return prev;
      const newLayers = prev.currentMap.layers.filter(l => l.id !== layerId);
      const newMap = { ...prev.currentMap, layers: newLayers };
      saveToHistory(newMap);
      return { ...prev, currentMap: newMap };
    });
  }, [saveToHistory]);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setState(prev => {
      if (!prev.currentMap) return prev;
      const newLayers = prev.currentMap.layers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      );
      return { ...prev, currentMap: { ...prev.currentMap, layers: newLayers } };
    });
  }, []);

  const toggleLayerLock = useCallback((layerId: string) => {
    setState(prev => {
      if (!prev.currentMap) return prev;
      const newLayers = prev.currentMap.layers.map(layer =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      );
      return { ...prev, currentMap: { ...prev.currentMap, layers: newLayers } };
    });
  }, []);

  const updateMapSettings = useCallback((settings: Partial<Pick<GameMap, 'name' | 'width' | 'height' | 'tileSize'>>) => {
    setState(prev => {
      if (!prev.currentMap) return prev;
      const newMap = { ...prev.currentMap, ...settings };
      return { ...prev, currentMap: newMap };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex <= 0) return prev;
      const newIndex = prev.historyIndex - 1;
      return {
        ...prev,
        currentMap: prev.history[newIndex],
        historyIndex: newIndex,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      const newIndex = prev.historyIndex + 1;
      return {
        ...prev,
        currentMap: prev.history[newIndex],
        historyIndex: newIndex,
      };
    });
  }, []);

  const createNewMap = useCallback((name: string, width: number, height: number, tileSize: number) => {
    const newMap = {
      name,
      width,
      height,
      tileSize,
      layers: [
        { id: '1', name: 'Background', visible: true, locked: false, tiles: [], opacity: 100 },
      ],
    };
    setState(prev => ({
      ...prev,
      currentMap: newMap,
      activeLayerId: '1',
      history: [newMap],
      historyIndex: 0,
    }));
  }, []);

  const loadMap = useCallback((map: GameMap) => {
    const mapWithoutMeta = {
      name: map.name,
      width: map.width,
      height: map.height,
      tileSize: map.tileSize,
      layers: map.layers,
    };
    setState(prev => ({
      ...prev,
      currentMap: mapWithoutMeta,
      activeLayerId: map.layers[0]?.id || null,
      history: [mapWithoutMeta],
      historyIndex: 0,
    }));
  }, []);

  const exportMap = useCallback(() => {
    if (!state.currentMap) return '';
    return JSON.stringify(state.currentMap, null, 2);
  }, [state.currentMap]);

  const importMap = useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      setState(prev => ({
        ...prev,
        currentMap: parsed,
        activeLayerId: parsed.layers[0]?.id || null,
        history: [parsed],
        historyIndex: 0,
      }));
    } catch (error) {
      console.error('Failed to import map:', error);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      } else {
        switch (e.key.toLowerCase()) {
          case 'v': setActiveTool('select'); break;
          case 'b': setActiveTool('pencil'); break;
          case 'e': setActiveTool('eraser'); break;
          case 'f': setActiveTool('fill'); break;
          case 'r': setActiveTool('rectangle'); break;
          case 'c': setActiveTool('circle'); break;
          case 'm': setActiveTool('move'); break;
          case 'h': setActiveTool('pan'); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setActiveTool]);

  const value: EditorContextType = {
    ...state,
    setActiveTool,
    setActiveLayer,
    setSelectedTileColor,
    setZoom,
    addTile,
    removeTile,
    fillArea,
    addLayer,
    removeLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    updateMapSettings,
    undo,
    redo,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    createNewMap,
    loadMap,
    exportMap,
    importMap,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}
