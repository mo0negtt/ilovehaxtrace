import { useHaxTrace } from '@/contexts/HaxTraceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  MousePointer, 
  Hand, 
  Undo2, 
  Redo2,
  Download,
  Upload,
  Trash2,
  ExternalLink,
  Info,
  Grid3x3,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useRef, useState } from 'react';

export const HaxTraceToolbar = () => {
  const {
    currentTool,
    setCurrentTool,
    segmentColor,
    setSegmentColor,
    curveType,
    setCurveType,
    curveValue,
    setCurveValue,
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
  const [creditsOpen, setCreditsOpen] = useState(false);

  const handleExport = () => {
    const exportedMap = exportMap();
    const dataStr = JSON.stringify(exportedMap, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'iLoveHax.hbs';
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
          <MousePointer className="w-4 h-4 mr-1" />
          Segment
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

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-2">
        <Label htmlFor="curve-type" className="text-sm">Curve:</Label>
        <Select value={curveType} onValueChange={(value: 'angle' | 'radius' | 'sagitta') => setCurveType(value)}>
          <SelectTrigger id="curve-type" data-testid="select-curve-type" className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="angle">Angle</SelectItem>
            <SelectItem value="radius">Radius</SelectItem>
            <SelectItem value="sagitta">Sagitta</SelectItem>
          </SelectContent>
        </Select>
        <Input
          id="curve-value"
          data-testid="input-curve-value"
          type="number"
          value={curveValue}
          onChange={(e) => setCurveValue(Number(e.target.value))}
          className="w-20 h-8 text-sm"
          step={curveType === 'angle' ? 5 : 1}
        />
        <span className="text-xs text-muted-foreground">
          {curveType === 'angle' ? '°' : curveType === 'radius' ? 'px' : 'h'}
        </span>
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

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button
          data-testid="button-open-haxpuck"
          size="sm"
          variant="ghost"
          onClick={() => window.open('https://mo0negtt.github.io/haxpuck/', '_blank')}
          title="Open HaxPuck"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Open HaxPuck
        </Button>
        <Button
          data-testid="button-credits"
          size="sm"
          variant="ghost"
          onClick={() => setCreditsOpen(true)}
          title="Credits"
        >
          <Info className="w-4 h-4 mr-1" />
          Credits
        </Button>
      </div>

      <Dialog open={creditsOpen} onOpenChange={setCreditsOpen}>
        <DialogContent data-testid="dialog-credits">
          <DialogHeader>
            <DialogTitle>Credits</DialogTitle>
            <DialogDescription>
              iLoveHax
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">Created by</p>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-muted-foreground">@mo0negtt</p>
                <p className="text-muted-foreground">@mush</p>
                <img src="https://i.ibb.co/whCMYMNh/tp-white-1x1.png" alt="Team Packet logo" className="h-14 w-auto mt-2 object-contain max-w-full" loading="lazy" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
