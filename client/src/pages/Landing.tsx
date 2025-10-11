import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import FeedbackModal from "@/components/FeedbackModal";

export default function Landing() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero onFeedbackClick={() => setFeedbackOpen(true)} />
      </main>
      <Footer onFeedbackClick={() => setFeedbackOpen(true)} />
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
