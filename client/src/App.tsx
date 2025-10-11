import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HaxTraceEditor from "@/pages/HaxTraceEditor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HaxTraceEditor} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* Background gradients inspired by modern creator sites; keep original palette */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(800px 400px at 0% 0%, hsl(var(--primary) / 0.10), transparent 60%), radial-gradient(600px 300px at 100% 0%, hsl(var(--accent) / 0.12), transparent 60%), radial-gradient(900px 500px at 50% 100%, hsl(var(--muted-foreground) / 0.06), transparent 60%)',
          }}
        />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
