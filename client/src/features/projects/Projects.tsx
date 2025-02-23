import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { SiGithub } from "react-icons/si";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "../../shared/components/common/LanguageContext";
import { projectsMessages, projects } from "./data";
import MatrixEffect from "@/shared/components/common/MatrixRain";
import { getMatrixColors } from "../articles/Articles";

const Projects = () => {
  const { lang } = useLanguage();
  return (
    <>
      <MatrixEffect immediate bgOpacity={0.2} matrixColors={getMatrixColors()} />
      <div className="projects-container relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h1 className="projects-title text-[var(--matrix-light)]">
            {projectsMessages.title[lang]}
          </h1>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.div
                key={project.title.en}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cursor-pointer bg-[--matrix-black] border border-[var(--matrix-dark)] hover:shadow-[0_0_8px_#80ce87] transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="text-[var(--matrix-white)] text-xl font-bold">
                      {project.title[lang]}
                    </CardTitle>
                    <CardDescription className="text-[var(--matrix-white)] text-sm md:text-base whitespace-pre-line">
                      {project.description[lang]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-row space-x-2">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm transition-all duration-300 hover:-translate-y-1"
                      >
                        <SiGithub className="w-4 h-4 text-[var(--matrix-light)]" />
                        <span className="text-[var(--matrix-white)]">
                          {projectsMessages.sourceCode[lang]}
                        </span>
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm transition-all duration-300 hover:-translate-y-1"
                      >
                        <ExternalLink className="w-4 h-4 text-[var(--matrix-light)]" />
                        <span className="text-[var(--matrix-white)]">
                          {projectsMessages.liveDemo[lang]}
                        </span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Projects;
