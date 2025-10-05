import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Grid3x3, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useHaxTrace } from '@/contexts/HaxTraceContext';

export const ViewControls = () => {
  const { gridVisible, toggleGrid, gridSize, setGridSize, zoom, setZoom } = useHaxTrace();

  return (
    <Card className="p-4" data-testid="card-view-controls">
      <h3 className="text-sm font-medium mb-4">View Controls</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="grid-toggle" className="text-sm">Show Grid</Label>
          <Button
            id="grid-toggle"
            data-testid="button-toggle-grid"
            size="sm"
            variant={gridVisible ? 'default' : 'outline'}
            onClick={toggleGrid}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
        </div>

        {gridVisible && (
          <div className="space-y-2">
            <Label htmlFor="grid-size" className="text-sm">Grid Size</Label>
            <Input
              id="grid-size"
              data-testid="input-grid-size"
              type="number"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              min={10}
              max={200}
              step={10}
              className="h-8"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="zoom-level" className="text-sm">Zoom Level</Label>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(zoom / 1.2)}
              disabled={zoom <= 0.1}
              data-testid="button-zoom-out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center text-sm font-mono">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(zoom * 1.2)}
              disabled={zoom >= 5}
              data-testid="button-zoom-in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          <Slider
            id="zoom-level"
            data-testid="slider-zoom-level"
            value={[zoom * 100]}
            onValueChange={(values) => setZoom(values[0] / 100)}
            min={10}
            max={500}
            step={10}
          />
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(1)}
          data-testid="button-reset-zoom"
          className="w-full"
        >
          <Maximize2 className="w-4 h-4 mr-1" />
          Reset View
        </Button>
      </div>
    </Card>
  );
};
