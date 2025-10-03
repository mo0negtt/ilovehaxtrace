import { HaxTraceProvider } from '@/contexts/HaxTraceContext';
import { HaxTraceCanvas } from '@/components/HaxTraceCanvas';
import { HaxTraceToolbar } from '@/components/HaxTraceToolbar';
import { HaxTraceCurveEditor } from '@/components/HaxTraceCurveEditor';

export default function HaxTraceEditor() {
  return (
    <HaxTraceProvider>
      <div className="flex flex-col h-screen bg-background">
        <HaxTraceToolbar />
        <div className="flex-1 relative">
          <HaxTraceCanvas />
          <HaxTraceCurveEditor />
        </div>
      </div>
    </HaxTraceProvider>
  );
}
