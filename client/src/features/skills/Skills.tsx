import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useLanguage } from "../../shared/components/common/LanguageContext";
import { skillsMessages, skills, learning } from "./data";
type AnimatedProgressBarProps = {
  percentage: number;
  modifierClass: string;
  delay: number;
};

const AnimatedProgressBar = ({ percentage, modifierClass, delay }: AnimatedProgressBarProps) => (
  <div className="progress-bar">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 1, delay }}
      className={`progress-fill ${modifierClass}`}
    />
  </div>
);

const Skills = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"skills" | "learning">("skills");

  return (
    <div className="skills-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Global Tabs */}
        <div className="tabs flex justify-center border-b border-[#204829] mb-6">
          <button
            onClick={() => setActiveTab("skills")}
            className={`tab-button ${activeTab === "skills" ? "active-skills" : ""}`}
          >
            {skillsMessages.skillsTab[lang]}
          </button>
          <button
            onClick={() => setActiveTab("learning")}
            className={`tab-button ${activeTab === "learning" ? "active-learning" : ""}`}
          >
            {skillsMessages.learningTab[lang]}
          </button>
        </div>

        {activeTab === "skills" && (
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name.en}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-transparent border-0 shadow-none">
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#e5e0d6]">
                        {skill.name[lang]}
                      </span>
                      <span className="text-sm text-[#e5e0d6]">
                        {skill.level}%
                      </span>
                    </div>
                    <AnimatedProgressBar
                      percentage={skill.level}
                      modifierClass="progress-fill-primary"
                      delay={index * 0.1}
                    />
                    {/* Dodanie opisu pod paskiem postępu */}
                    <p className="mt-1 text-[#e5e0d6]">
                      {skill.description?.[lang] || ''}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        {activeTab === "learning" && (
          <div className="mt-4 space-y-6">
            <p className="learning-description">{skillsMessages.learningDescription[lang]}</p>
            <div className="learning-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
              {learning.map((item, index) => (
                <motion.div
                  key={item.name.en}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-transparent border-0 shadow-none">
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[#F59E0B]">
                          {item.name[lang]}
                        </span>
                        <span className="text-sm text-[#F59E0B]">{item.level}%</span>
                      </div>
                      {/* Use the learning modifier class here */}
                      <AnimatedProgressBar
                        percentage={item.level}
                        modifierClass="progress-fill-learning"
                        delay={index * 0.1}
                      />
                      <p className="learning-skill-desc mt-1">{item.description[lang]}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Skills;
