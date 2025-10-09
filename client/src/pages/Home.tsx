import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import ToolCard from "@/components/ToolCard";
import Footer from "@/components/Footer";
import HelpModal from "@/components/HelpModal";
import FeedbackModal from "@/components/FeedbackModal";
import {
  Sparkles,
  Palette,
  Scissors,
  FileImage,
  Download,
  Zap,
} from "lucide-react";

const categories = [
  { id: "all", label: "Todos" },
  { id: "editor", label: "Editor" },
  { id: "emphasis", label: "Énfasis" },
  { id: "tools", label: "Herramientas" },
];

const tools = [
  {
    title: "Emphasize",
    description:
      "Herramienta de énfasis para resaltar y trabajar con contenido visual de manera profesional",
    icon: <Sparkles className="w-7 h-7 text-primary" />,
    url: "https://mo0negtt.github.io/ilovehax/",
    category: "emphasis",
    isNew: false,
  },
  {
    title: "Editor",
    description:
      "Editor avanzado para desarrollo y personalización de proyectos con funciones completas",
    icon: <Palette className="w-7 h-7 text-primary" />,
    url: "https://mo0negtt.github.io/haxpuck/",
    category: "editor",
    isNew: false,
  },
  {
    title: "Recortar Contenido",
    description:
      "Recorta tus elementos definiendo un rectángulo en píxeles o usando herramientas visuales",
    icon: <Scissors className="w-7 h-7 text-primary" />,
    url: "#",
    category: "tools",
    isNew: false,
  },
  {
    title: "Convertir Formato",
    description:
      "Convierte los formatos de tus archivos fácilmente entre diferentes extensiones",
    icon: <FileImage className="w-7 h-7 text-primary" />,
    url: "#",
    category: "tools",
    isNew: false,
  },
  {
    title: "Comprimir Archivos",
    description:
      "Comprime tus archivos sin pérdida visible de calidad para optimizar el tamaño",
    icon: <Download className="w-7 h-7 text-primary" />,
    url: "#",
    category: "tools",
    isNew: false,
  },
  {
    title: "Optimizar Recursos",
    description:
      "Optimiza tus recursos automáticamente para mejor rendimiento y carga rápida",
    icon: <Zap className="w-7 h-7 text-primary" />,
    url: "#",
    category: "tools",
    isNew: false,
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [helpOpen, setHelpOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "e" || e.key === "E") {
        window.open(tools[0].url, "_blank");
      } else if (e.key === "d" || e.key === "D") {
        window.open(tools[1].url, "_blank");
      } else if (e.key === "/" && e.shiftKey) {
        e.preventDefault();
        setHelpOpen(true);
      } else if (e.key === "?") {
        e.preventDefault();
        setHelpOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearch={setSearchQuery} />

      <main className="flex-1">
        <Hero />

        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.title} {...tool} index={index} />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <p
                className="text-muted-foreground text-lg"
                data-testid="text-no-results"
              >
                No se encontraron herramientas que coincidan con tu búsqueda
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer onFeedbackClick={() => setFeedbackOpen(true)} />

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}
