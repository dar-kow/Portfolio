# Automatic Update Dates in Project Portfolio

Showcasing the timeliness of your projects is an important element of building your professional online image. Here's how you can implement automatic display of repository last update dates in your React portfolio.

## Why Show Update Dates?

Displaying the last update dates of projects in your portfolio brings several important benefits:

1. **Transparency** - you show that your projects are actively developed
2. **Credibility** - visitors can see that you're not presenting "dead" projects
3. **Professionalism** - attention to detail and automation speak to your quality as a developer

## How to Implement It?

The foundation of the solution is the GitHub API, which allows you to retrieve information about the last commit in a repository. Here are the key steps:

### 1. Create a Service for GitHub API Communication

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
  // Implementation of fetching date from GitHub API with a cache mechanism
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

### 2. Update the Projects Component

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

### 3. Display the Date in the Project Card

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

## Advantages and Disadvantages of the Solution

### Advantages

1. **Automation** - dates are updated without manual intervention
2. **Currency** - the latest information is always presented
3. **Completeness** - date information is available for every GitHub project
4. **Personalization** - dates are formatted according to the selected UI language
5. **Credibility** - information comes directly from GitHub, not hardcoded

### Disadvantages

1. **API Limits** - GitHub API has a limit of 60 requests per hour for unauthenticated requests
2. **API Availability Dependency** - if the API is unavailable, information will not be displayed
3. **Performance** - additional API requests may slightly slow down portfolio loading
4. **Private Repository Visibility** - works only for public repositories

## Benefits for Portfolio Prestige

1. **Professional Image** - automatic dates show your commitment to updating projects
2. **Transparency** - visitors immediately see which projects are actively developed
3. **Technical Credibility** - implementing such a solution demonstrates your ability to integrate with APIs
4. **Attention to Detail** - caring about details like update dates demonstrates your thoroughness
5. **Consistency** - automatic dates are always current, creating a coherent and well-maintained portfolio image

Implementing automatic update dates is a small but significant element that makes your portfolio stand out with professionalism and attention to detail. This feature not only increases the informational value of your projects but also demonstrates your programming skills in practical application.