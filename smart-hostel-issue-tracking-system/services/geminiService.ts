
import { IssuePriority } from '../types';

// Mock AI service - analyzes description to suggest priority
const analyzePriority = (description: string): { priority: IssuePriority; reason: string } => {
  const lowerDesc = description.toLowerCase();
  
  // Emergency keywords
  if (/fire|flood|leak|gas|electric|danger|broken|urgent|emergency|injured|injury|gas leak|water overflow|electrical hazard/.test(lowerDesc)) {
    return {
      priority: IssuePriority.EMERGENCY,
      reason: "Potential safety hazard detected - requires immediate attention"
    };
  }
  
  // High priority keywords
  if (/no water|no electricity|no internet|power cut|router down|not working|broken|severe|major|multiple rooms|spread/.test(lowerDesc)) {
    return {
      priority: IssuePriority.HIGH,
      reason: "Affects multiple users or essential services - needs quick resolution"
    };
  }
  
  // Medium priority keywords
  if (/leak|drain|dirty|pest|mosquito|noise|temperature|hot|cold|uncomfortable|furniture|paint/.test(lowerDesc)) {
    return {
      priority: IssuePriority.MEDIUM,
      reason: "Affects comfort and hygiene - should be addressed soon"
    };
  }
  
  // Low priority keywords
  if (/minor|small|slight|cosmetic|aesthetic|light|door/.test(lowerDesc)) {
    return {
      priority: IssuePriority.LOW,
      reason: "Minor issue - can be scheduled for regular maintenance"
    };
  }
  
  // Default to medium if no keywords match
  return {
    priority: IssuePriority.MEDIUM,
    reason: "Standard maintenance issue"
  };
};

export const geminiService = {
  suggestPriority: async (description: string): Promise<{ priority: IssuePriority; reason: string }> => {
    try {
      // Simulate async API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return analyzePriority(description);
    } catch (error) {
      console.error("Error suggesting priority:", error);
      return { 
        priority: IssuePriority.MEDIUM, 
        reason: "Unable to suggest priority" 
      };
    }
  },

  summarizeIssues: async (issues: any[]): Promise<string> => {
    try {
      if (!issues || issues.length === 0) {
        return "No issues to summarize.";
      }

      // Count issues by category
      const categoryCount: { [key: string]: number } = {};
      const priorityCount: { [key: string]: number } = {};

      issues.forEach(issue => {
        categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1;
        priorityCount[issue.priority] = (priorityCount[issue.priority] || 0) + 1;
      });

      let summary = `Total Issues: ${issues.length}. `;
      
      const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
      if (topCategory) {
        summary += `Most reported: ${topCategory[0]} (${topCategory[1]} issues). `;
      }

      const emergencyCount = priorityCount['EMERGENCY'] || 0;
      const highCount = priorityCount['HIGH'] || 0;
      if (emergencyCount > 0) {
        summary += `⚠️ ${emergencyCount} emergency issue(s) need immediate attention. `;
      }
      if (highCount > 0) {
        summary += `${highCount} high priority issue(s) pending.`;
      }

      return summary;
    } catch (error) {
      return "Unable to summarize issues at this time.";
    }
  }
};
