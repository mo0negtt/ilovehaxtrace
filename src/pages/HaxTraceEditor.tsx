import { HaxTraceProvider, useHaxTrace } from '@/contexts/HaxTraceContext';
import { HaxTraceCanvas } from '@/components/HaxTraceCanvas';
import { HaxTraceToolbar } from '@/components/HaxTraceToolbar';
import { HaxTraceCurveEditor } from '@/components/HaxTraceCurveEditor';
import { BackgroundImagePanel } from '@/components/BackgroundImagePanel';
import { ViewControls } from '@/components/ViewControls';

function EditorContent() {
  const { map, setBackgroundImage, updateBackgroundImage, removeBackgroundImage } = useHaxTrace();

  return (
    <div className="flex flex-col h-screen bg-background">
      <HaxTraceToolbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <HaxTraceCanvas />
          <HaxTraceCurveEditor />
        </div>
        <div className="w-80 border-l p-4 overflow-y-auto space-y-4">
          <ViewControls />
          <BackgroundImagePanel
            backgroundImage={map.bg.image}
            onImageLoad={setBackgroundImage}
            onUpdate={updateBackgroundImage}
            onRemove={removeBackgroundImage}
          />
        </div>
      </div>
    </div>
  );
}

export default function HaxTraceEditor() {
  return (
    <HaxTraceProvider>
      <EditorContent />
    </HaxTraceProvider>
  );
}
