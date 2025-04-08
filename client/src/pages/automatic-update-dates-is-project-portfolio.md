# Automatyczne Daty Aktualizacji w Portfolio Projektu

Prezentacja aktualności Twoich projektów to ważny element budowania profesjonalnego wizerunku online. Oto jak możesz zaimplementować automatyczne wyświetlanie dat ostatniej aktualizacji repozytorium w swoim portfolio React.

## Dlaczego warto pokazywać daty aktualizacji?

Wyświetlanie dat ostatnich aktualizacji projektów w portfolio przynosi kilka istotnych korzyści:

1. **Przejrzystość** - pokazujesz, że Twoje projekty są aktywnie rozwijane
2. **Wiarygodność** - odwiedzający mogą zobaczyć, że nie prezentujesz "martwych" projektów
3. **Profesjonalizm** - troska o szczegóły i automatyzacja stanowią o Twojej jakości jako dewelopera

## Jak to zaimplementować?

Podstawą rozwiązania jest GitHub API, które pozwala na pobieranie informacji o ostatnim commicie w repozytorium. Oto kluczowe kroki:

### 1. Utwórz serwis do komunikacji z GitHub API

```typescript
export function extractRepoInfo(url: string): { owner: string; repo: string } | null {
  if (!url) return null;
  
  try {
    const githubUrlRegex = /github\.com\/([^/]+)\/([^/]+)/;
    const match = url.match(githubUrlRegex);
    
    if (match && match.length >= 3) {
      return {
        owner: match[1],
        repo: match[2].split('#')[0].split('?')[0]
      };
    }
    return null;
  } catch (error) {
    console.error('Error extracting repo info:', error);
    return null;
  }
}

export async function fetchLastCommitDateWithCache(owner: string, repo: string): Promise<string | null> {
  // Implementacja pobierania daty z GitHub API z mechanizmem cache
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const commits = await response.json();
    
    if (commits && commits.length > 0 && commits[0].commit?.committer?.date) {
      return commits[0].commit.committer.date;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching commit data:', error);
    return null;
  }
}

export function formatCommitDate(dateString: string, locale: string = 'en'): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return dateString;
  }
}
```

### 2. Zaktualizuj komponent projektów

```tsx
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
              lastCommitDate
            };
          } catch (error) {
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
    // Render projects with date information
  );
};
```

### 3. Wyświetl datę w karcie projektu

```tsx
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
```

## Zalety i wady rozwiązania

### Zalety

1. **Automatyzacja** - daty aktualizowane są bez ręcznej interwencji
2. **Aktualność** - zawsze prezentowane są najnowsze dane
3. **Kompletność** - informacja o dacie dostępna jest dla każdego projektu z GitHub
4. **Personalizacja** - daty formatowane są zgodnie z wybranym językiem UI
5. **Wiarygodność** - informacje pochodzą bezpośrednio z GitHub, nie są "hardcodowane"

### Wady

1. **Limity API** - GitHub API ma limit 60 zapytań na godzinę dla nieautoryzowanych żądań
2. **Zależność od dostępności API** - jeśli API jest niedostępne, informacje nie będą wyświetlane
3. **Wydajność** - dodatkowe zapytania do API mogą nieznacznie spowolnić ładowanie portfolio
4. **Widoczność prywatnych repozytoriów** - działa tylko dla publicznych repozytoriów

## Korzyści dla prestiżu portfolio

1. **Profesjonalny wizerunek** - automatyczne daty pokazują Twoje zaangażowanie w aktualizację projektów
2. **Transparentność** - goście od razu widzą, które projekty są aktywnie rozwijane
3. **Wiarygodność techniczna** - implementacja takiego rozwiązania demonstruje umiejętność integracji z API
4. **Szczegółowość** - dbałość o detale jak daty aktualizacji świadczy o Twojej dokładności
5. **Spójność** - automatyczne daty są zawsze aktualne, co tworzy spójny i zadbany obraz portfolio

Zaimplementowanie automatycznych dat aktualizacji to drobny, ale znaczący element, który sprawia, że Twoje portfolio wyróżnia się profesjonalizmem i dbałością o szczegóły. Ta funkcja nie tylko zwiększa wartość informacyjną projektów, ale też demonstruje Twoje umiejętności programistyczne w praktycznym zastosowaniu.
