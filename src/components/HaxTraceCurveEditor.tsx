import { useHaxTrace } from '@/contexts/HaxTraceContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { chordLength, angleToRadius, angleToSagitta, radiusToAngle, radiusToSagitta, sagittaToAngle, sagittaToRadius, calculateCircularArc } from '@/lib/circularArc';

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
  const curveData = segment.curveData || { type: 'angle' as const, value: 0 };
  
  const v0 = map.vertexes[segment.v0];
  const v1 = map.vertexes[segment.v1];
  const chord = v0 && v1 ? chordLength(v0, v1) : 0;

  const arcData = v0 && v1 ? calculateCircularArc(v0, v1, curveData.type, curveData.value) : null;
  const direction = arcData ? (arcData.anticlockwise ? 'Counter-clockwise' : 'Clockwise') : 'Straight';

  const handleTypeChange = (newType: 'angle' | 'radius' | 'sagitta') => {
    let newValue = 0;
    
    if (chord <= 0) {
      updateSegmentCurve(segmentIndex, newType, 0);
      return;
    }

    const isNearZero = Math.abs(curveData.value) < 0.001;
    const sign = curveData.value >= 0 ? 1 : -1;
    
    if (isNearZero) {
      if (newType === 'radius') {
        newValue = sign * chord;
      } else if (newType === 'sagitta') {
        newValue = sign * 0.1;
      } else {
        newValue = 0;
      }
    } else {
      if (curveData.type === 'angle' && newType === 'radius') {
        const converted = angleToRadius(curveData.value, chord);
        newValue = isFinite(converted) ? converted : sign * chord;
      } else if (curveData.type === 'angle' && newType === 'sagitta') {
        const converted = angleToSagitta(curveData.value, chord);
        newValue = isFinite(converted) ? converted : sign * 0.1;
      } else if (curveData.type === 'radius' && newType === 'angle') {
        const converted = radiusToAngle(curveData.value, chord);
        newValue = isFinite(converted) ? converted : 0;
      } else if (curveData.type === 'radius' && newType === 'sagitta') {
        const converted = radiusToSagitta(curveData.value, chord);
        newValue = isFinite(converted) ? converted : sign * 0.1;
      } else if (curveData.type === 'sagitta' && newType === 'angle') {
        const converted = sagittaToAngle(curveData.value, chord);
        newValue = isFinite(converted) ? converted : 0;
      } else if (curveData.type === 'sagitta' && newType === 'radius') {
        const converted = sagittaToRadius(curveData.value, chord);
        newValue = isFinite(converted) ? converted : sign * chord;
      }
    }
    
    updateSegmentCurve(segmentIndex, newType, newValue);
  };

  const handleValueChange = (newValue: number) => {
    let finalValue = isFinite(newValue) ? newValue : 0;
    if (curveData.type === 'angle') {
      finalValue = Math.max(-340, Math.min(340, finalValue));
    }
    updateSegmentCurve(segmentIndex, curveData.type, finalValue);
  };

  const getSliderConfig = () => {
    switch (curveData.type) {
      case 'angle':
        return { min: -340, max: 340, step: 1 };
      case 'radius':
        return { min: -1000, max: 1000, step: 1 };
      case 'sagitta':
        return { min: -500, max: 500, step: 1 };
    }
  };

  const config = getSliderConfig();
  const displayValue = isFinite(curveData.value) ? Math.round(curveData.value * 100) / 100 : 0;

  return (
    <Card className="absolute top-20 right-4 p-4 w-64" data-testid="card-curve-editor">
      <h3 className="text-sm font-medium mb-4">Curve Editor</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="curve-type-editor" className="text-sm">Curve Type</Label>
          <Select value={curveData.type} onValueChange={handleTypeChange}>
            <SelectTrigger id="curve-type-editor" data-testid="select-curve-type-editor" className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="angle">Angle (degrees)</SelectItem>
              <SelectItem value="radius">Radius (pixels)</SelectItem>
              <SelectItem value="sagitta">Sagitta (height)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="curve-value-editor" className="text-sm">
            {curveData.type === 'angle' ? 'Angle' : curveData.type === 'radius' ? 'Radius' : 'Sagitta'}
          </Label>
          <Input
            id="curve-value-editor"
            data-testid="input-curve-value-editor"
            type="number"
            value={displayValue}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            step={config.step}
            className="h-8"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="curve-slider-editor" className="text-sm">Adjust</Label>
          <Slider
            id="curve-slider-editor"
            data-testid="slider-curve-editor"
            value={[isFinite(curveData.value) ? curveData.value : 0]}
            onValueChange={(values) => handleValueChange(values[0])}
            min={config.min}
            max={config.max}
            step={config.step}
            className="w-full"
          />
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Chord length: {Math.round(chord)}px</p>
          <p>Direction: {direction}</p>
          {curveData.type === 'angle' && (
            <p className="text-xs text-muted-foreground mt-2">
              Límite: ±340°. Si |curva| &gt; 180° se dibuja el arco mayor.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
