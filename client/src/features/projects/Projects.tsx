import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { SiGithub } from "react-icons/si";
import { ExternalLink, Clock } from "lucide-react";
import { useLanguage } from "../../shared/components/common/LanguageContext";
import { projectsMessages, projects as initialProjects, Project } from "./data";
import MatrixEffect from "@/shared/components/common/MatrixRain";
import { getMatrixColors } from "../articles/Articles";
import { extractRepoInfo, fetchLastCommitDateWithCache, formatCommitDate, isRecentCommit } from "@/shared/services/github-api";

const Projects = () => {
  const { lang } = useLanguage();
  const [projects, setProjects] = useState<(Project)[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch last commit dates when component mounts
  useEffect(() => {
    const fetchCommitDates = async () => {
      setIsLoading(true);

      const updatedProjects = await Promise.all(
        initialProjects.map(async (project) => {
          // Only try to fetch for GitHub repos with valid links
          if (!project.link || project.link.trim() === '') {
            return project;
          }

          const repoInfo = extractRepoInfo(project.link);
          if (!repoInfo) {
            return project;
          }

          try {
            const lastCommitDate = await fetchLastCommitDateWithCache(repoInfo.owner, repoInfo.repo);
            return {
              ...project,
              lastCommitDate: lastCommitDate === null ? undefined : lastCommitDate
            };
          } catch (error) {
            console.error(`Error fetching commit date for ${project.title.en}:`, error);
            return project;
          }
        })
      );

      setProjects(updatedProjects);
      setIsLoading(false);
    };

    fetchCommitDates();
  }, []);

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
                <Card className="cursor-pointer bg-[var(--matrix-bg)] border border-[var(--matrix-dark)] hover:shadow-[0_0_8px_#80ce87] transition-all duration-200 flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="text-[var(--matrix-white)] text-xl font-bold flex items-center gap-2 flex-wrap">
                      {project.title[lang]}
                      {isRecentCommit(project.lastCommitDate) && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded bg-[#22b455] text-[var(--matrix-bg)]">
                          {lang === "en" ? "NEW" : "NOWY"}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-[var(--matrix-white)] text-sm md:text-base whitespace-pre-line">
                      {project.description[lang]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    {/* Using flex-col and mt-auto to push links to bottom */}
                    <div className="flex flex-row space-x-2 flex-wrap gap-y-2 mt-auto">
                      {project.link && project.link.trim() !== "" && (
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
                      )}
                      {project.demo && project.demo.trim() !== "" && (
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
                      )}
                    </div>
                  </CardContent>
                  {project.lastCommitDate ? (
                    <CardFooter className="border-t border-[var(--matrix-darker)] pt-3 mt-auto">
                      <div className="flex items-center text-xs text-[var(--matrix-mid-light)]">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>
                          {projectsMessages.lastUpdated[lang]}: {formatCommitDate(project.lastCommitDate, lang)}
                        </span>
                      </div>
                    </CardFooter>
                  ) : project.link && isLoading ? (
                    <CardFooter className="border-t border-[var(--matrix-darker)] pt-3 mt-auto">
                      <div className="flex items-center text-xs text-[var(--matrix-mid-light)] animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{projectsMessages.lastUpdated[lang]}...</span>
                      </div>
                    </CardFooter>
                  ) : null}
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