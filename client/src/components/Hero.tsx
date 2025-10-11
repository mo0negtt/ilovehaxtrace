import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Rocket, MessageSquare, ArrowUpRight } from "lucide-react";

type HeroProps = {
  onFeedbackClick?: () => void;
};

export default function Hero({ onFeedbackClick }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background inspired by dripzels clothing viewer */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-background to-background dark:from-black/70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.05),transparent_60%),linear-gradient(to_bottom,transparent,transparent_70%,rgba(0,0,0,0.4))]"
      />
      
      <motion.div
        className="absolute top-20 left-10 text-primary/20"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 right-20 text-primary/20"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Zap className="w-20 h-20" />
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 right-10 text-primary/15"
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Rocket className="w-14 h-14" />
      </motion.div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          className="inline-block mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Diseño renovado
          </span>
        </motion.div>
        
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          data-testid="text-hero-title"
        >
          Preview Your Clothing
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          data-testid="text-hero-subtitle"
        >
          And find more useful Roblox tools!
        </motion.p>
        
        <motion.div
          className="flex justify-center items-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="text-base px-8 min-h-12 shadow-lg shadow-yellow-400/30 border-yellow-400 bg-yellow-400 text-black hover:bg-yellow-300"
            asChild
            data-testid="button-web-app"
          >
            <a href="/app">
              Web App
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 min-h-12"
            onClick={onFeedbackClick}
            data-testid="button-feedback-hero"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Feedback
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-base px-8 min-h-12"
            asChild
            data-testid="button-tiktok"
          >
            <a href="https://www.tiktok.com/@mo0negtt" target="_blank" rel="noopener noreferrer">
              TikTok
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
