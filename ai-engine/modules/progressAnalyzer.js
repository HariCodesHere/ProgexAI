const _ = require('lodash');

class ProgressAnalyzer {
  constructor() {
    this.insightTemplates = {
      timeline: {
        ahead: "Project is ahead of schedule by {days} days. Great progress!",
        onTrack: "Project is on track with the planned timeline.",
        behind: "Project is behind schedule by {days} days. Consider adjusting scope or resources.",
        critical: "Project is critically behind schedule. Immediate action required."
      },
      productivity: {
        high: "Team productivity is excellent with {completionRate}% task completion rate.",
        medium: "Team productivity is moderate. Consider optimizing workflows.",
        low: "Team productivity needs improvement. Review blockers and resource allocation."
      },
      quality: {
        excellent: "Code quality metrics are excellent. Keep up the good work!",
        good: "Code quality is good with minor areas for improvement.",
        needsWork: "Code quality needs attention. Focus on code reviews and best practices."
      },
      collaboration: {
        excellent: "Team collaboration is strong with active participation from all members.",
        good: "Good team collaboration with room for improvement in communication.",
        poor: "Team collaboration needs improvement. Consider team building activities."
      }
    };

    this.riskFactors = [
      {
        name: 'timeline_risk',
        threshold: 0.8,
        description: 'High risk of missing deadlines',
        mitigation: 'Consider scope reduction or resource reallocation'
      },
      {
        name: 'quality_risk',
        threshold: 0.6,
        description: 'Code quality below acceptable standards',
        mitigation: 'Implement stricter code review process'
      },
      {
        name: 'team_risk',
        threshold: 0.5,
        description: 'Low team engagement or productivity',
        mitigation: 'Address team blockers and improve communication'
      },
      {
        name: 'scope_risk',
        threshold: 0.7,
        description: 'Scope creep detected',
        mitigation: 'Review and prioritize requirements'
      }
    ];
  }

  async analyzeProgress(projectData, teamData, timelineData) {
    try {
      const analysis = {
        projectId: projectData.id,
        projectName: projectData.name,
        analysisDate: new Date().toISOString(),
        
        // Core metrics
        timeline: this.analyzeTimeline(projectData, timelineData),
        productivity: this.analyzeProductivity(projectData, teamData),
        quality: this.analyzeQuality(projectData),
        collaboration: this.analyzeCollaboration(teamData),
        
        // Advanced insights
        trends: this.analyzeTrends(projectData, timelineData),
        predictions: this.generatePredictions(projectData, teamData, timelineData),
        risks: this.identifyRisks(projectData, teamData, timelineData),
        recommendations: [],
        
        // Summary metrics
        overallHealth: 0,
        confidence: 0
      };

      // Generate recommendations based on analysis
      analysis.recommendations = this.generateRecommendations(analysis);
      
      // Calculate overall health score
      analysis.overallHealth = this.calculateOverallHealth(analysis);
      
      // Calculate confidence in predictions
      analysis.confidence = this.calculateConfidence(projectData, teamData);

      return analysis;
    } catch (error) {
      console.error('Error analyzing progress:', error);
      throw new Error('Failed to analyze project progress');
    }
  }

  analyzeTimeline(projectData, timelineData) {
    const { tasks = [], milestones = [] } = projectData;
    const { startDate, endDate, duration } = timelineData;
    
    const now = new Date();
    const projectStart = new Date(startDate);
    const projectEnd = new Date(endDate);
    
    // Calculate progress
    const totalDuration = projectEnd - projectStart;
    const elapsed = now - projectStart;
    const timeProgress = Math.max(0, Math.min(1, elapsed / totalDuration));
    
    // Calculate task completion
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const taskProgress = tasks.length > 0 ? completedTasks / tasks.length : 0;
    
    // Calculate milestone progress
    const completedMilestones = milestones.filter(m => m.completed).length;
    const milestoneProgress = milestones.length > 0 ? completedMilestones / milestones.length : 0;
    
    // Determine timeline status
    const progressDelta = taskProgress - timeProgress;
    let status = 'onTrack';
    let daysOffset = 0;
    
    if (progressDelta > 0.1) {
      status = 'ahead';
      daysOffset = Math.round((progressDelta * totalDuration) / (1000 * 60 * 60 * 24));
    } else if (progressDelta < -0.1) {
      status = 'behind';
      daysOffset = Math.round(Math.abs(progressDelta * totalDuration) / (1000 * 60 * 60 * 24));
      if (progressDelta < -0.3) status = 'critical';
    }

    return {
      status,
      timeProgress: Math.round(timeProgress * 100),
      taskProgress: Math.round(taskProgress * 100),
      milestoneProgress: Math.round(milestoneProgress * 100),
      daysOffset,
      completedTasks,
      totalTasks: tasks.length,
      completedMilestones,
      totalMilestones: milestones.length,
      insight: this.insightTemplates.timeline[status].replace('{days}', daysOffset)
    };
  }

  analyzeProductivity(projectData, teamData) {
    const { tasks = [] } = projectData;
    const { members = [] } = teamData;
    
    // Calculate completion rates
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const overdueTasks = tasks.filter(task => {
      return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    });
    
    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    const overdueRate = tasks.length > 0 ? (overdueTasks.length / tasks.length) * 100 : 0;
    
    // Team productivity metrics
    const teamProductivity = this.calculateTeamProductivity(tasks, members);
    
    // Determine productivity level
    let level = 'medium';
    if (completionRate > 80 && overdueRate < 10) level = 'high';
    else if (completionRate < 50 || overdueRate > 25) level = 'low';
    
    return {
      level,
      completionRate: Math.round(completionRate),
      overdueRate: Math.round(overdueRate),
      averageTasksPerMember: Math.round(tasks.length / Math.max(members.length, 1)),
      teamProductivity,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      overdueTasks: overdueTasks.length,
      insight: this.insightTemplates.productivity[level].replace('{completionRate}', Math.round(completionRate))
    };
  }

  analyzeQuality(projectData) {
    const { codeMetrics = {}, codeReviews = [], testCoverage = 0 } = projectData;
    
    // Quality metrics
    const qualityScore = this.calculateQualityScore(codeMetrics, codeReviews, testCoverage);
    
    // Determine quality level
    let level = 'good';
    if (qualityScore > 0.8) level = 'excellent';
    else if (qualityScore < 0.6) level = 'needsWork';
    
    return {
      level,
      score: Math.round(qualityScore * 100),
      testCoverage: Math.round(testCoverage),
      codeReviewsCount: codeReviews.length,
      averageReviewScore: this.calculateAverageReviewScore(codeReviews),
      technicalDebt: this.assessTechnicalDebt(codeMetrics),
      insight: this.insightTemplates.quality[level]
    };
  }

  analyzeCollaboration(teamData) {
    const { members = [], communications = [], activities = [] } = teamData;
    
    // Collaboration metrics
    const collaborationScore = this.calculateCollaborationScore(members, communications, activities);
    
    // Activity distribution
    const activityDistribution = this.calculateActivityDistribution(activities, members);
    
    // Communication frequency
    const communicationFrequency = this.calculateCommunicationFrequency(communications);
    
    // Determine collaboration level
    let level = 'good';
    if (collaborationScore > 0.8) level = 'excellent';
    else if (collaborationScore < 0.5) level = 'poor';
    
    return {
      level,
      score: Math.round(collaborationScore * 100),
      activeMembers: members.filter(m => m.lastActive && this.isRecentlyActive(m.lastActive)).length,
      totalMembers: members.length,
      communicationFrequency,
      activityDistribution,
      insight: this.insightTemplates.collaboration[level]
    };
  }

  analyzeTrends(projectData, timelineData) {
    const { tasks = [], history = [] } = projectData;
    
    // Task completion trend (last 4 weeks)
    const completionTrend = this.calculateCompletionTrend(history);
    
    // Velocity trend
    const velocityTrend = this.calculateVelocityTrend(history);
    
    // Quality trend
    const qualityTrend = this.calculateQualityTrend(history);
    
    return {
      completion: completionTrend,
      velocity: velocityTrend,
      quality: qualityTrend,
      summary: this.generateTrendSummary(completionTrend, velocityTrend, qualityTrend)
    };
  }

  generatePredictions(projectData, teamData, timelineData) {
    const timeline = this.analyzeTimeline(projectData, timelineData);
    const productivity = this.analyzeProductivity(projectData, teamData);
    
    // Predict completion date
    const predictedCompletion = this.predictCompletionDate(projectData, timeline, productivity);
    
    // Predict resource needs
    const resourceNeeds = this.predictResourceNeeds(projectData, teamData, productivity);
    
    // Predict potential issues
    const potentialIssues = this.predictPotentialIssues(projectData, teamData, timeline);
    
    return {
      completionDate: predictedCompletion,
      resourceNeeds,
      potentialIssues,
      confidence: this.calculatePredictionConfidence(projectData, teamData)
    };
  }

  identifyRisks(projectData, teamData, timelineData) {
    const risks = [];
    
    const timeline = this.analyzeTimeline(projectData, timelineData);
    const productivity = this.analyzeProductivity(projectData, teamData);
    const quality = this.analyzeQuality(projectData);
    const collaboration = this.analyzeCollaboration(teamData);
    
    // Timeline risk
    if (timeline.status === 'behind' || timeline.status === 'critical') {
      risks.push({
        type: 'timeline',
        severity: timeline.status === 'critical' ? 'high' : 'medium',
        description: `Project is ${timeline.daysOffset} days behind schedule`,
        impact: 'Project may miss final deadline',
        mitigation: 'Consider scope reduction or additional resources'
      });
    }
    
    // Quality risk
    if (quality.level === 'needsWork') {
      risks.push({
        type: 'quality',
        severity: 'medium',
        description: 'Code quality metrics below acceptable standards',
        impact: 'Technical debt and maintenance issues',
        mitigation: 'Implement stricter code review process and refactoring'
      });
    }
    
    // Team risk
    if (collaboration.level === 'poor' || productivity.level === 'low') {
      risks.push({
        type: 'team',
        severity: 'high',
        description: 'Low team productivity or collaboration',
        impact: 'Reduced delivery capacity and quality',
        mitigation: 'Address team blockers and improve communication'
      });
    }
    
    return risks;
  }

  generateRecommendations(analysis) {
    const recommendations = [];
    
    // Timeline recommendations
    if (analysis.timeline.status === 'behind') {
      recommendations.push({
        category: 'timeline',
        priority: 'high',
        title: 'Address Schedule Delays',
        description: 'Project is behind schedule. Consider prioritizing critical tasks and reassigning resources.',
        actions: [
          'Review and reprioritize remaining tasks',
          'Consider scope reduction for non-critical features',
          'Allocate additional resources to critical path tasks'
        ]
      });
    }
    
    // Productivity recommendations
    if (analysis.productivity.level === 'low') {
      recommendations.push({
        category: 'productivity',
        priority: 'high',
        title: 'Improve Team Productivity',
        description: 'Team productivity is below optimal levels.',
        actions: [
          'Identify and remove blockers',
          'Improve task clarity and requirements',
          'Consider additional training or resources'
        ]
      });
    }
    
    // Quality recommendations
    if (analysis.quality.level === 'needsWork') {
      recommendations.push({
        category: 'quality',
        priority: 'medium',
        title: 'Enhance Code Quality',
        description: 'Code quality metrics indicate need for improvement.',
        actions: [
          'Implement mandatory code reviews',
          'Increase test coverage',
          'Schedule technical debt reduction sprints'
        ]
      });
    }
    
    // Collaboration recommendations
    if (analysis.collaboration.level === 'poor') {
      recommendations.push({
        category: 'collaboration',
        priority: 'medium',
        title: 'Improve Team Collaboration',
        description: 'Team collaboration needs enhancement.',
        actions: [
          'Schedule regular team sync meetings',
          'Implement better communication tools',
          'Encourage knowledge sharing sessions'
        ]
      });
    }
    
    return recommendations;
  }

  calculateOverallHealth(analysis) {
    const weights = {
      timeline: 0.3,
      productivity: 0.25,
      quality: 0.25,
      collaboration: 0.2
    };
    
    const scores = {
      timeline: this.getTimelineScore(analysis.timeline.status),
      productivity: this.getProductivityScore(analysis.productivity.level),
      quality: this.getQualityScore(analysis.quality.level),
      collaboration: this.getCollaborationScore(analysis.collaboration.level)
    };
    
    const weightedScore = Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + (scores[key] * weight);
    }, 0);
    
    return Math.round(weightedScore * 100);
  }

  // Helper methods
  calculateTeamProductivity(tasks, members) {
    const memberProductivity = members.map(member => {
      const memberTasks = tasks.filter(task => task.assignedTo === member.id);
      const completedTasks = memberTasks.filter(task => task.status === 'completed');
      
      return {
        memberId: member.id,
        name: member.name,
        totalTasks: memberTasks.length,
        completedTasks: completedTasks.length,
        completionRate: memberTasks.length > 0 ? completedTasks.length / memberTasks.length : 0
      };
    });
    
    return memberProductivity;
  }

  calculateQualityScore(codeMetrics, codeReviews, testCoverage) {
    let score = 0.5; // Base score
    
    // Test coverage contribution (30%)
    score += (testCoverage / 100) * 0.3;
    
    // Code review contribution (40%)
    if (codeReviews.length > 0) {
      const avgReviewScore = this.calculateAverageReviewScore(codeReviews);
      score += (avgReviewScore / 100) * 0.4;
    }
    
    // Code metrics contribution (30%)
    if (codeMetrics.complexity) {
      const complexityScore = Math.max(0, 1 - (codeMetrics.complexity / 10));
      score += complexityScore * 0.3;
    }
    
    return Math.min(1, score);
  }

  calculateAverageReviewScore(codeReviews) {
    if (codeReviews.length === 0) return 0;
    
    const totalScore = codeReviews.reduce((sum, review) => sum + (review.score || 70), 0);
    return totalScore / codeReviews.length;
  }

  assessTechnicalDebt(codeMetrics) {
    const { complexity = 0, duplication = 0, maintainability = 100 } = codeMetrics;
    
    let debtLevel = 'low';
    if (complexity > 15 || duplication > 20 || maintainability < 60) {
      debtLevel = 'high';
    } else if (complexity > 10 || duplication > 10 || maintainability < 80) {
      debtLevel = 'medium';
    }
    
    return debtLevel;
  }

  calculateCollaborationScore(members, communications, activities) {
    let score = 0.5;
    
    // Active participation (40%)
    const activeMembers = members.filter(m => this.isRecentlyActive(m.lastActive));
    const participationRate = activeMembers.length / Math.max(members.length, 1);
    score += participationRate * 0.4;
    
    // Communication frequency (30%)
    const recentCommunications = communications.filter(c => this.isRecentActivity(c.timestamp));
    const commRate = Math.min(1, recentCommunications.length / 10); // Normalize to 10 communications
    score += commRate * 0.3;
    
    // Activity distribution (30%)
    const activityScore = this.calculateActivityDistributionScore(activities, members);
    score += activityScore * 0.3;
    
    return Math.min(1, score);
  }

  calculateActivityDistribution(activities, members) {
    const memberActivities = {};
    
    members.forEach(member => {
      memberActivities[member.id] = activities.filter(a => a.userId === member.id).length;
    });
    
    return memberActivities;
  }

  calculateCommunicationFrequency(communications) {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentComms = communications.filter(c => new Date(c.timestamp) > oneWeekAgo);
    
    return {
      thisWeek: recentComms.length,
      averagePerDay: Math.round(recentComms.length / 7)
    };
  }

  calculateCompletionTrend(history) {
    // Simplified trend calculation
    const recentHistory = history.slice(-4); // Last 4 data points
    if (recentHistory.length < 2) return 'stable';
    
    const first = recentHistory[0].completionRate || 0;
    const last = recentHistory[recentHistory.length - 1].completionRate || 0;
    
    if (last > first + 5) return 'improving';
    if (last < first - 5) return 'declining';
    return 'stable';
  }

  calculateVelocityTrend(history) {
    // Simplified velocity trend
    const recentHistory = history.slice(-4);
    if (recentHistory.length < 2) return 'stable';
    
    const velocities = recentHistory.map(h => h.velocity || 0);
    const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
    const lastVelocity = velocities[velocities.length - 1];
    
    if (lastVelocity > avgVelocity * 1.1) return 'increasing';
    if (lastVelocity < avgVelocity * 0.9) return 'decreasing';
    return 'stable';
  }

  calculateQualityTrend(history) {
    // Simplified quality trend
    return 'stable'; // Placeholder
  }

  generateTrendSummary(completion, velocity, quality) {
    const trends = [completion, velocity, quality];
    const improving = trends.filter(t => t === 'improving').length;
    const declining = trends.filter(t => t === 'declining').length;
    
    if (improving > declining) return 'Overall trends are positive';
    if (declining > improving) return 'Some trends need attention';
    return 'Trends are stable';
  }

  predictCompletionDate(projectData, timeline, productivity) {
    const remainingTasks = projectData.tasks.filter(t => t.status !== 'completed').length;
    const completionRate = productivity.completionRate / 100;
    
    if (completionRate === 0) return 'Unable to predict';
    
    const estimatedDays = Math.ceil(remainingTasks / (completionRate * projectData.tasks.length / 30)); // Assuming 30-day baseline
    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + estimatedDays);
    
    return predictedDate.toISOString().split('T')[0];
  }

  predictResourceNeeds(projectData, teamData, productivity) {
    const needs = [];
    
    if (productivity.level === 'low') {
      needs.push('Additional development resources');
    }
    
    if (projectData.tasks.filter(t => t.priority === 'high').length > 5) {
      needs.push('Project management support');
    }
    
    return needs;
  }

  predictPotentialIssues(projectData, teamData, timeline) {
    const issues = [];
    
    if (timeline.status === 'behind') {
      issues.push('Risk of missing project deadline');
    }
    
    if (teamData.members.length < 3) {
      issues.push('Team size may be insufficient for project scope');
    }
    
    return issues;
  }

  calculatePredictionConfidence(projectData, teamData) {
    let confidence = 0.5;
    
    // More data = higher confidence
    if (projectData.history && projectData.history.length > 5) confidence += 0.2;
    if (projectData.tasks.length > 10) confidence += 0.1;
    if (teamData.members.length > 2) confidence += 0.1;
    
    return Math.min(1, confidence);
  }

  calculateConfidence(projectData, teamData) {
    return this.calculatePredictionConfidence(projectData, teamData);
  }

  // Utility methods
  isRecentlyActive(lastActive) {
    if (!lastActive) return false;
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(lastActive) > oneWeekAgo;
  }

  isRecentActivity(timestamp) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(timestamp) > oneWeekAgo;
  }

  calculateActivityDistributionScore(activities, members) {
    if (members.length === 0) return 0;
    
    const distribution = this.calculateActivityDistribution(activities, members);
    const activityCounts = Object.values(distribution);
    const avgActivity = activityCounts.reduce((sum, count) => sum + count, 0) / activityCounts.length;
    
    // Calculate variance - lower variance means better distribution
    const variance = activityCounts.reduce((sum, count) => sum + Math.pow(count - avgActivity, 2), 0) / activityCounts.length;
    const normalizedVariance = Math.min(1, variance / (avgActivity + 1));
    
    return 1 - normalizedVariance;
  }

  getTimelineScore(status) {
    const scores = { ahead: 1, onTrack: 0.8, behind: 0.4, critical: 0.1 };
    return scores[status] || 0.5;
  }

  getProductivityScore(level) {
    const scores = { high: 1, medium: 0.6, low: 0.2 };
    return scores[level] || 0.5;
  }

  getQualityScore(level) {
    const scores = { excellent: 1, good: 0.7, needsWork: 0.3 };
    return scores[level] || 0.5;
  }

  getCollaborationScore(level) {
    const scores = { excellent: 1, good: 0.7, poor: 0.3 };
    return scores[level] || 0.5;
  }
}

module.exports = ProgressAnalyzer;
