import { createRoot } from "react-dom/client";
import App from "./App";
import "./../src/shared/styles/global.css";
import "./hooks/toast.css";

createRoot(document.getElementById("root")!).render(<App />);
