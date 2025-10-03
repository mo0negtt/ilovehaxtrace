import { useHaxTrace } from '@/contexts/HaxTraceContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export const HaxTraceCurveEditor = () => {
  const { selectedSegments, map, updateSegmentCurve } = useHaxTrace();

  if (selectedSegments.length === 0) {
    return null;
  }

  if (selectedSegments.length > 1) {
    return (
      <Card className="absolute top-20 right-4 p-4 w-64" data-testid="card-curve-editor">
        <h3 className="text-sm font-medium mb-2">Curve Editor</h3>
        <p className="text-sm text-muted-foreground">
          Multiple segments selected. Select a single segment to edit its curve.
        </p>
      </Card>
    );
  }

  const segmentIndex = selectedSegments[0];
  const segment = map.segments[segmentIndex];
  const curve = segment.curve || 0;

  const handleCurveChange = (value: number) => {
    updateSegmentCurve(segmentIndex, value);
  };

  return (
    <Card className="absolute top-20 right-4 p-4 w-64" data-testid="card-curve-editor">
      <h3 className="text-sm font-medium mb-4">Curve Editor</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="curve-value" className="text-sm">Curve Value</Label>
          <Input
            id="curve-value"
            data-testid="input-curve-value"
            type="number"
            value={curve}
            onChange={(e) => handleCurveChange(Number(e.target.value))}
            min={-500}
            max={500}
            className="h-8"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="curve-slider" className="text-sm">Adjust Curve</Label>
          <Slider
            id="curve-slider"
            data-testid="slider-curve"
            value={[curve]}
            onValueChange={(values) => handleCurveChange(values[0])}
            min={-500}
            max={500}
            step={1}
            className="w-full"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: Right-click drag on segment to adjust curve
        </p>
      </div>
    </Card>
  );
};
