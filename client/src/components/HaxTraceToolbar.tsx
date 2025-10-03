import { useHaxTrace } from '@/contexts/HaxTraceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  MousePointer, 
  Hand, 
  Undo2, 
  Redo2,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { useRef } from 'react';

export const HaxTraceToolbar = () => {
  const {
    currentTool,
    setCurrentTool,
    segmentColor,
    setSegmentColor,
    segmentCurve,
    setSegmentCurve,
    undo,
    redo,
    canUndo,
    canRedo,
    importMap,
    exportMap,
    map,
    deleteSelectedSegments,
    selectedSegments,
  } = useHaxTrace();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const exportedMap = exportMap();
    const dataStr = JSON.stringify(exportedMap, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${map.name.replace(/\s+/g, '_')}.hbs`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const mapData = JSON.parse(event.target?.result as string);
        importMap(mapData);
      } catch (error) {
        console.error('Error importing map:', error);
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-card border-b">
      <div className="flex items-center gap-1">
        <Button
          data-testid="button-tool-vertex"
          size="sm"
          variant={currentTool === 'vertex' ? 'default' : 'ghost'}
          onClick={() => setCurrentTool('vertex')}
          title="Add Vertex (V)"
        >
          <MousePointer className="w-4 h-4" />
        </Button>
        <Button
          data-testid="button-tool-segment"
          size="sm"
          variant={currentTool === 'segment' ? 'default' : 'ghost'}
          onClick={() => setCurrentTool('segment')}
          title="Add Segment (S)"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          data-testid="button-tool-pan"
          size="sm"
          variant={currentTool === 'pan' ? 'default' : 'ghost'}
          onClick={() => setCurrentTool('pan')}
          title="Pan (P)"
        >
          <Hand className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-2">
        <Label htmlFor="segment-color" className="text-sm">Color:</Label>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">#</span>
          <Input
            id="segment-color"
            data-testid="input-segment-color"
            type="text"
            value={segmentColor}
            onChange={(e) => setSegmentColor(e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6))}
            className="w-20 h-8 font-mono text-sm"
            maxLength={6}
          />
          <div 
            className="w-8 h-8 rounded border" 
            style={{ backgroundColor: `#${segmentColor}` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="segment-curve" className="text-sm">Curve:</Label>
        <Input
          id="segment-curve"
          data-testid="input-segment-curve"
          type="number"
          value={segmentCurve}
          onChange={(e) => setSegmentCurve(Number(e.target.value))}
          className="w-20 h-8 text-sm"
          min={-500}
          max={500}
        />
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <Button
          data-testid="button-undo"
          size="sm"
          variant="ghost"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          data-testid="button-redo"
          size="sm"
          variant="ghost"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <Button
          data-testid="button-export"
          size="sm"
          variant="ghost"
          onClick={handleExport}
          title="Export HBS"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          data-testid="button-import"
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          title="Import HBS"
        >
          <Upload className="w-4 h-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".hbs,.json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      {selectedSegments.length > 0 && (
        <>
          <Separator orientation="vertical" className="h-8" />
          <Button
            data-testid="button-delete-segments"
            size="sm"
            variant="ghost"
            onClick={deleteSelectedSegments}
            title="Delete Selected Segments"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};
