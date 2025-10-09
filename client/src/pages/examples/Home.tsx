import Home from "../Home";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function HomeExample() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}
