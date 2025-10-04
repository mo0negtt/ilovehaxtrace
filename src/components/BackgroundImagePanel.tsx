import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Trash2, Maximize2, Move, RotateCcw } from 'lucide-react';
import { BackgroundImage } from '@shared/schema';

interface BackgroundImagePanelProps {
  backgroundImage?: BackgroundImage;
  onImageLoad: (dataURL: string) => void;
  onUpdate: (bgImage: BackgroundImage) => void;
  onRemove: () => void;
}

export const BackgroundImagePanel = ({
  backgroundImage,
  onImageLoad,
  onUpdate,
  onRemove,
}: BackgroundImagePanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target?.result as string;
      onImageLoad(dataURL);
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target?.result as string;
      onImageLoad(dataURL);
    };
    reader.readAsDataURL(file);
  };

  if (!backgroundImage) {
    return (
      <Card className="p-4" data-testid="card-background-panel">
        <h3 className="text-sm font-medium mb-4">Background Image</h3>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          data-testid="dropzone-background"
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click or drag image here
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>
    );
  }

  return (
    <Card className="p-4" data-testid="card-background-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Background Image</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          data-testid="button-remove-background"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bg-opacity" className="text-sm">Opacity</Label>
          <Slider
            id="bg-opacity"
            data-testid="slider-bg-opacity"
            value={[backgroundImage.opacity * 100]}
            onValueChange={(values) =>
              onUpdate({ ...backgroundImage, opacity: values[0] / 100 })
            }
            min={0}
            max={100}
            step={1}
          />
          <div className="text-xs text-muted-foreground text-right">
            {Math.round(backgroundImage.opacity * 100)}%
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bg-scale" className="text-sm">Scale</Label>
          <Slider
            id="bg-scale"
            data-testid="slider-bg-scale"
            value={[backgroundImage.scale * 100]}
            onValueChange={(values) =>
              onUpdate({ ...backgroundImage, scale: values[0] / 100 })
            }
            min={10}
            max={500}
            step={1}
          />
          <div className="text-xs text-muted-foreground text-right">
            {Math.round(backgroundImage.scale * 100)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="bg-offset-x" className="text-sm">Offset X</Label>
            <Input
              id="bg-offset-x"
              data-testid="input-bg-offset-x"
              type="number"
              value={backgroundImage.offsetX}
              onChange={(e) =>
                onUpdate({ ...backgroundImage, offsetX: Number(e.target.value) })
              }
              className="h-8"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bg-offset-y" className="text-sm">Offset Y</Label>
            <Input
              id="bg-offset-y"
              data-testid="input-bg-offset-y"
              type="number"
              value={backgroundImage.offsetY}
              onChange={(e) =>
                onUpdate({ ...backgroundImage, offsetY: Number(e.target.value) })
              }
              className="h-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bg-fit-mode" className="text-sm">Fit Mode</Label>
          <Select
            value={backgroundImage.fitMode}
            onValueChange={(value: 'fit' | 'cover' | 'center') =>
              onUpdate({ ...backgroundImage, fitMode: value })
            }
          >
            <SelectTrigger id="bg-fit-mode" data-testid="select-bg-fit-mode" className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fit">Fit</SelectItem>
              <SelectItem value="cover">Cover</SelectItem>
              <SelectItem value="center">Center</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onUpdate({ ...backgroundImage, offsetX: 0, offsetY: 0, scale: 1 })
            }
            data-testid="button-reset-background"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onUpdate({ ...backgroundImage, offsetX: 0, offsetY: 0 })
            }
            data-testid="button-center-background"
            className="flex-1"
          >
            <Maximize2 className="w-4 h-4 mr-1" />
            Center
          </Button>
        </div>
      </div>
    </Card>
  );
};
