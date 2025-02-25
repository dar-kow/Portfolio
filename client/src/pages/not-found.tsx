import { Card, CardContent } from "@/shared/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/shared/components/common/LanguageContext";

const notFoundMessages = {
  title: {
    pl: "Jeszcze treści nie ma",
    en: "Content not available yet",
  },
  description: {
    pl: "Sama forma :P Czekamy na deploy",
    en: "Just the form :P Waiting for deploy",
  },
};

export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--matrix-bg)]">
      <Card className="w-full max-w-md mx-4 bg-[var(--matrix-darker)] border border-[var(--matrix-dark)]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-[var(--matrix-light)]" />
            <h1 className="text-2xl font-bold text-[var(--matrix-white)]">
              {notFoundMessages.title[lang]}
            </h1>
          </div>

          <p className="mt-4 text-sm text-[var(--matrix-light)]">
            {notFoundMessages.description[lang]}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}