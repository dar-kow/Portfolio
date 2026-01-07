/**
 * Extracts owner and repository name from GitHub URL
 * @param url GitHub repository URL
 * @returns Object with owner and repo properties, or null if URL is invalid
 */
export function extractRepoInfo(url: string): { owner: string; repo: string } | null {
    // Handle empty URLs
    if (!url) {
      return null;
    }
    
    try {
      // Extract the path from GitHub URL
      const githubUrlRegex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = url.match(githubUrlRegex);
      
      if (match && match.length >= 3) {
        return {
          owner: match[1],
          repo: match[2].split('#')[0].split('?')[0] // Remove any hash or query params
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting repo info:', error);
      return null;
    }
  }
  
  /**
   * Fetches the last commit date for a GitHub repository
   * @param owner Repository owner
   * @param repo Repository name
   * @returns Promise with the last commit date string or null if API call fails
   */
  export async function fetchLastCommitDate(owner: string, repo: string): Promise<string | null> {
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
  
  /**
   * Format date string into a more readable format
   * @param dateString ISO date string
   * @param locale Locale for date formatting
   * @returns Formatted date string
   */
  export function formatCommitDate(dateString: string, locale: string = 'en'): string {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }

  /**
   * Check if commit date is within the last N days
   * @param dateString ISO date string
   * @param days Number of days to check (default 7)
   * @returns true if commit is recent
   */
  export function isRecentCommit(dateString: string | undefined, days: number = 7): boolean {
    if (!dateString) return false;
    try {
      const commitDate = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - commitDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days;
    } catch {
      return false;
    }
  }
  
  // Simple in-memory cache for commit dates
  const commitDateCache: Record<string, { date: string; timestamp: number }> = {};
  const CACHE_TTL = 3600000; // 1 hour in milliseconds
  
  /**
   * Fetches the last commit date with caching
   */
  export async function fetchLastCommitDateWithCache(owner: string, repo: string): Promise<string | null> {
    const cacheKey = `${owner}/${repo}`;
    const cachedData = commitDateCache[cacheKey];
    
    // Return cached data if it's still valid
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return cachedData.date;
    }
    
    // Fetch new data
    const date = await fetchLastCommitDate(owner, repo);
    
    // Cache the result if successful
    if (date) {
      commitDateCache[cacheKey] = { date, timestamp: Date.now() };
    }
    
    return date;
  }