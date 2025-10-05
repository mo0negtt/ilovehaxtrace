import { HaxTraceProvider, useHaxTrace } from '@/contexts/HaxTraceContext';
import { HaxTraceCanvas } from '@/components/HaxTraceCanvas';
import { HaxTraceToolbar } from '@/components/HaxTraceToolbar';
import { HaxTraceCurveEditor } from '@/components/HaxTraceCurveEditor';
import { BackgroundImagePanel } from '@/components/BackgroundImagePanel';
import { ViewControls } from '@/components/ViewControls';
import { useEffect } from 'react';

function EditorContent() {
  const { 
    map, 
    setBackgroundImage, 
    updateBackgroundImage, 
    removeBackgroundImage, 
    undo, 
    redo,
    selectedVertices,
    selectedSegments,
    deleteSelectedVertices,
    deleteSelectedSegments
  } = useHaxTrace();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (!isInputField) {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        if (!isInputField) {
          e.preventDefault();
          redo();
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputField) {
        e.preventDefault();
        if (selectedVertices.length > 0) {
          deleteSelectedVertices();
        } else if (selectedSegments.length > 0) {
          deleteSelectedSegments();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedVertices, selectedSegments, deleteSelectedVertices, deleteSelectedSegments]);

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
