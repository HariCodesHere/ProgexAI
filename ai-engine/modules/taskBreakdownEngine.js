const _ = require('lodash');

class TaskBreakdownEngine {
  constructor() {
    this.taskTemplates = {
      'Web Development': {
        phases: [
          {
            name: 'Planning & Setup',
            duration: 1,
            tasks: [
              'Project initialization and repository setup',
              'Development environment configuration',
              'Project documentation creation',
              'Technology stack finalization',
              'Team roles and responsibilities definition'
            ]
          },
          {
            name: 'Design & Architecture',
            duration: 1.5,
            tasks: [
              'UI/UX wireframes and mockups',
              'Database schema design',
              'API endpoint planning',
              'System architecture documentation',
              'Design system creation'
            ]
          },
          {
            name: 'Backend Development',
            duration: 3,
            tasks: [
              'Database setup and configuration',
              'Authentication system implementation',
              'Core API endpoints development',
              'Business logic implementation',
              'Data validation and error handling'
            ]
          },
          {
            name: 'Frontend Development',
            duration: 3,
            tasks: [
              'Component library setup',
              'User interface implementation',
              'API integration',
              'State management setup',
              'Responsive design implementation'
            ]
          },
          {
            name: 'Integration & Testing',
            duration: 1.5,
            tasks: [
              'Frontend-backend integration',
              'Unit testing implementation',
              'Integration testing',
              'User acceptance testing',
              'Performance optimization'
            ]
          },
          {
            name: 'Deployment & Launch',
            duration: 1,
            tasks: [
              'Production environment setup',
              'CI/CD pipeline configuration',
              'Application deployment',
              'Monitoring and logging setup',
              'Documentation finalization'
            ]
          }
        ]
      },
      'AI/ML': {
        phases: [
          {
            name: 'Research & Planning',
            duration: 1.5,
            tasks: [
              'Problem definition and scope',
              'Data requirements analysis',
              'Algorithm research and selection',
              'Technology stack evaluation',
              'Project timeline planning'
            ]
          },
          {
            name: 'Data Collection & Preparation',
            duration: 2,
            tasks: [
              'Data source identification',
              'Data collection and aggregation',
              'Data cleaning and preprocessing',
              'Feature engineering',
              'Data validation and quality checks'
            ]
          },
          {
            name: 'Model Development',
            duration: 3,
            tasks: [
              'Baseline model implementation',
              'Model architecture design',
              'Training pipeline setup',
              'Hyperparameter tuning',
              'Model evaluation and validation'
            ]
          },
          {
            name: 'Integration & API',
            duration: 2,
            tasks: [
              'Model serving infrastructure',
              'API endpoint development',
              'Frontend integration',
              'Real-time prediction setup',
              'Performance monitoring'
            ]
          },
          {
            name: 'Testing & Optimization',
            duration: 1.5,
            tasks: [
              'Model accuracy testing',
              'Performance benchmarking',
              'Edge case handling',
              'Model optimization',
              'A/B testing setup'
            ]
          }
        ]
      },
      'Mobile Development': {
        phases: [
          {
            name: 'Planning & Design',
            duration: 1.5,
            tasks: [
              'Platform strategy definition',
              'User journey mapping',
              'UI/UX design for mobile',
              'Technical architecture planning',
              'Development environment setup'
            ]
          },
          {
            name: 'Core Development',
            duration: 4,
            tasks: [
              'Navigation and routing setup',
              'Core screens implementation',
              'State management integration',
              'API integration',
              'Local storage implementation'
            ]
          },
          {
            name: 'Platform Features',
            duration: 2,
            tasks: [
              'Device-specific features integration',
              'Push notifications setup',
              'Camera and media handling',
              'Location services integration',
              'Offline functionality'
            ]
          },
          {
            name: 'Testing & Optimization',
            duration: 1.5,
            tasks: [
              'Device testing across platforms',
              'Performance optimization',
              'Memory management',
              'Battery usage optimization',
              'App store preparation'
            ]
          }
        ]
      }
    };

    this.roleTaskMapping = {
      'Frontend Developer': ['UI/UX', 'Component', 'Interface', 'Design', 'Responsive'],
      'Backend Developer': ['API', 'Database', 'Server', 'Authentication', 'Business logic'],
      'Mobile Developer': ['Mobile', 'Navigation', 'Platform', 'Device', 'App store'],
      'AI/ML Engineer': ['Model', 'Algorithm', 'Training', 'Data', 'Machine learning'],
      'DevOps Engineer': ['Deployment', 'CI/CD', 'Infrastructure', 'Monitoring', 'Environment'],
      'QA Engineer': ['Testing', 'Quality', 'Validation', 'Bug', 'Performance'],
      'UI/UX Designer': ['Design', 'Wireframes', 'Mockups', 'User experience', 'Prototyping'],
      'Project Manager': ['Planning', 'Documentation', 'Timeline', 'Coordination', 'Management']
    };
  }

  async breakdownProject(projectDetails, teamRoles, timeline) {
    try {
      const { category, complexity = 'intermediate', technologies = [] } = projectDetails;
      const { duration = 10, unit = 'weeks' } = timeline;

      // Get base template
      const template = this.getProjectTemplate(category, technologies);
      
      // Generate detailed tasks
      const phases = this.generatePhases(template, complexity, duration);
      
      // Assign tasks to team members
      const assignedTasks = this.assignTasksToRoles(phases, teamRoles);
      
      // Create milestones
      const milestones = this.generateMilestones(phases);
      
      // Calculate timeline
      const detailedTimeline = this.calculateTimeline(assignedTasks, duration, unit);
      
      // Generate dependencies
      const tasksWithDependencies = this.addTaskDependencies(assignedTasks);
      
      return {
        phases,
        tasks: tasksWithDependencies,
        milestones,
        timeline: detailedTimeline,
        summary: this.generateSummary(tasksWithDependencies, milestones),
        recommendations: this.generateRecommendations(projectDetails, teamRoles, tasksWithDependencies),
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error breaking down project:', error);
      throw new Error('Failed to breakdown project tasks');
    }
  }

  getProjectTemplate(category, technologies) {
    let baseTemplate = this.taskTemplates[category] || this.taskTemplates['Web Development'];
    
    // Customize template based on technologies
    const customizedTemplate = _.cloneDeep(baseTemplate);
    
    if (technologies.includes('React Native') || technologies.includes('Flutter')) {
      // Add mobile-specific phases
      const mobilePhases = this.taskTemplates['Mobile Development'].phases;
      customizedTemplate.phases = this.mergePhases(customizedTemplate.phases, mobilePhases);
    }
    
    if (technologies.some(t => ['TensorFlow', 'PyTorch', 'OpenAI API'].includes(t))) {
      // Add AI/ML specific phases
      const aiPhases = this.taskTemplates['AI/ML'].phases;
      customizedTemplate.phases = this.mergePhases(customizedTemplate.phases, aiPhases);
    }
    
    return customizedTemplate;
  }

  generatePhases(template, complexity, totalDuration) {
    const complexityMultipliers = {
      'beginner': 0.8,
      'intermediate': 1.0,
      'advanced': 1.3
    };
    
    const multiplier = complexityMultipliers[complexity] || 1.0;
    
    return template.phases.map((phase, index) => ({
      id: `phase-${index + 1}`,
      name: phase.name,
      description: `${phase.name} phase of the project`,
      duration: Math.ceil(phase.duration * multiplier),
      tasks: phase.tasks.map((task, taskIndex) => ({
        id: `task-${index + 1}-${taskIndex + 1}`,
        title: task,
        description: this.generateTaskDescription(task, complexity),
        estimatedHours: this.estimateTaskHours(task, complexity),
        priority: this.getTaskPriority(task, index),
        skills: this.getRequiredSkills(task),
        phase: phase.name,
        status: 'pending'
      })),
      order: index + 1
    }));
  }

  assignTasksToRoles(phases, teamRoles) {
    const allTasks = phases.flatMap(phase => phase.tasks);
    const roleNames = teamRoles.map(role => role.role || role);
    
    return allTasks.map(task => {
      const bestRole = this.findBestRoleForTask(task, roleNames);
      const assignedRole = bestRole || roleNames[0] || 'Project Manager';
      
      return {
        ...task,
        assignedTo: assignedRole,
        assignmentConfidence: this.calculateAssignmentConfidence(task, assignedRole),
        alternativeAssignees: this.getAlternativeAssignees(task, roleNames, assignedRole)
      };
    });
  }

  findBestRoleForTask(task, roleNames) {
    let bestRole = null;
    let highestScore = 0;
    
    for (const role of roleNames) {
      const score = this.calculateRoleTaskMatch(task, role);
      if (score > highestScore) {
        highestScore = score;
        bestRole = role;
      }
    }
    
    return bestRole;
  }

  calculateRoleTaskMatch(task, role) {
    const roleKeywords = this.roleTaskMapping[role] || [];
    const taskText = `${task.title} ${task.description}`.toLowerCase();
    
    const matches = roleKeywords.filter(keyword => 
      taskText.includes(keyword.toLowerCase())
    );
    
    return matches.length / roleKeywords.length;
  }

  generateMilestones(phases) {
    return phases.map((phase, index) => ({
      id: `milestone-${index + 1}`,
      name: `${phase.name} Complete`,
      description: `Completion of ${phase.name} phase`,
      dueDate: this.calculateMilestoneDate(phase, index),
      tasks: phase.tasks.map(task => task.id),
      criteria: this.generateMilestoneCriteria(phase),
      phase: phase.name
    }));
  }

  calculateTimeline(tasks, totalDuration, unit) {
    const totalHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const workingHoursPerWeek = 40; // Assuming 40 hours per week
    const teamSize = new Set(tasks.map(task => task.assignedTo)).size;
    
    const adjustedDuration = Math.max(
      totalDuration,
      Math.ceil(totalHours / (workingHoursPerWeek * teamSize))
    );
    
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (unit === 'weeks') {
      endDate.setDate(endDate.getDate() + (adjustedDuration * 7));
    } else if (unit === 'months') {
      endDate.setMonth(endDate.getMonth() + adjustedDuration);
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      duration: adjustedDuration,
      unit,
      totalEstimatedHours: totalHours,
      teamSize
    };
  }

  addTaskDependencies(tasks) {
    return tasks.map((task, index) => {
      const dependencies = this.calculateTaskDependencies(task, tasks, index);
      return {
        ...task,
        dependencies,
        startDate: this.calculateTaskStartDate(task, dependencies, tasks),
        endDate: this.calculateTaskEndDate(task)
      };
    });
  }

  calculateTaskDependencies(currentTask, allTasks, currentIndex) {
    const dependencies = [];
    
    // Phase-based dependencies
    const currentPhaseIndex = parseInt(currentTask.id.split('-')[1]) - 1;
    if (currentPhaseIndex > 0) {
      const previousPhaseTasks = allTasks.filter(task => 
        parseInt(task.id.split('-')[1]) === currentPhaseIndex
      );
      dependencies.push(...previousPhaseTasks.map(task => task.id));
    }
    
    // Logical dependencies based on task content
    const logicalDeps = this.findLogicalDependencies(currentTask, allTasks);
    dependencies.push(...logicalDeps);
    
    return [...new Set(dependencies)]; // Remove duplicates
  }

  findLogicalDependencies(currentTask, allTasks) {
    const dependencies = [];
    const taskTitle = currentTask.title.toLowerCase();
    
    // Common dependency patterns
    if (taskTitle.includes('integration')) {
      const setupTasks = allTasks.filter(task => 
        task.title.toLowerCase().includes('setup') ||
        task.title.toLowerCase().includes('implementation')
      );
      dependencies.push(...setupTasks.map(task => task.id));
    }
    
    if (taskTitle.includes('testing')) {
      const developmentTasks = allTasks.filter(task => 
        task.title.toLowerCase().includes('development') ||
        task.title.toLowerCase().includes('implementation')
      );
      dependencies.push(...developmentTasks.map(task => task.id));
    }
    
    return dependencies;
  }

  generateTaskDescription(task, complexity) {
    const descriptions = {
      'beginner': `Basic implementation of ${task.toLowerCase()}. Focus on core functionality with simple, well-documented code.`,
      'intermediate': `Comprehensive implementation of ${task.toLowerCase()}. Include error handling, optimization, and best practices.`,
      'advanced': `Advanced implementation of ${task.toLowerCase()}. Include scalability considerations, performance optimization, and industry standards.`
    };
    
    return descriptions[complexity] || descriptions['intermediate'];
  }

  estimateTaskHours(task, complexity) {
    const baseHours = {
      'setup': 8,
      'design': 16,
      'implementation': 24,
      'development': 32,
      'testing': 16,
      'integration': 20,
      'deployment': 12,
      'documentation': 8
    };
    
    const complexityMultipliers = {
      'beginner': 0.7,
      'intermediate': 1.0,
      'advanced': 1.5
    };
    
    const taskLower = task.toLowerCase();
    let hours = 16; // default
    
    for (const [keyword, baseHour] of Object.entries(baseHours)) {
      if (taskLower.includes(keyword)) {
        hours = baseHour;
        break;
      }
    }
    
    return Math.ceil(hours * (complexityMultipliers[complexity] || 1.0));
  }

  getTaskPriority(task, phaseIndex) {
    const taskLower = task.toLowerCase();
    
    if (phaseIndex === 0 || taskLower.includes('setup') || taskLower.includes('planning')) {
      return 'high';
    }
    if (taskLower.includes('testing') || taskLower.includes('deployment')) {
      return 'high';
    }
    if (taskLower.includes('core') || taskLower.includes('main')) {
      return 'high';
    }
    
    return 'medium';
  }

  getRequiredSkills(task) {
    const taskLower = task.toLowerCase();
    const skills = [];
    
    if (taskLower.includes('ui') || taskLower.includes('frontend')) {
      skills.push('Frontend Development', 'UI/UX Design');
    }
    if (taskLower.includes('api') || taskLower.includes('backend')) {
      skills.push('Backend Development', 'API Design');
    }
    if (taskLower.includes('database')) {
      skills.push('Database Design', 'SQL');
    }
    if (taskLower.includes('testing')) {
      skills.push('Testing', 'Quality Assurance');
    }
    if (taskLower.includes('deployment')) {
      skills.push('DevOps', 'Cloud Computing');
    }
    
    return skills.length > 0 ? skills : ['General Development'];
  }

  generateSummary(tasks, milestones) {
    const totalTasks = tasks.length;
    const totalHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const roleDistribution = _.countBy(tasks, 'assignedTo');
    const priorityDistribution = _.countBy(tasks, 'priority');
    
    return {
      totalTasks,
      totalEstimatedHours: totalHours,
      totalMilestones: milestones.length,
      roleDistribution,
      priorityDistribution,
      averageTaskHours: Math.round(totalHours / totalTasks),
      estimatedTeamWeeks: Math.ceil(totalHours / (40 * Object.keys(roleDistribution).length))
    };
  }

  generateRecommendations(projectDetails, teamRoles, tasks) {
    const recommendations = [];
    
    // Check for overloaded roles
    const tasksByRole = _.groupBy(tasks, 'assignedTo');
    const overloadedRoles = Object.entries(tasksByRole)
      .filter(([role, roleTasks]) => roleTasks.length > tasks.length / teamRoles.length * 1.5)
      .map(([role]) => role);
    
    if (overloadedRoles.length > 0) {
      recommendations.push({
        type: 'workload_balance',
        message: `Consider redistributing tasks for: ${overloadedRoles.join(', ')}`,
        priority: 'medium'
      });
    }
    
    // Check for critical path issues
    const highPriorityTasks = tasks.filter(task => task.priority === 'high');
    if (highPriorityTasks.length > tasks.length * 0.4) {
      recommendations.push({
        type: 'priority_balance',
        message: 'Too many high-priority tasks. Consider reprioritizing some tasks.',
        priority: 'medium'
      });
    }
    
    // Timeline recommendations
    const totalHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    if (totalHours > teamRoles.length * 400) { // More than 10 weeks per person
      recommendations.push({
        type: 'timeline',
        message: 'Project timeline may be ambitious. Consider extending deadline or reducing scope.',
        priority: 'high'
      });
    }
    
    return recommendations;
  }

  mergePhases(basePhases, additionalPhases) {
    // Simple merge - in production, this would be more sophisticated
    return [...basePhases, ...additionalPhases];
  }

  calculateAssignmentConfidence(task, role) {
    return this.calculateRoleTaskMatch(task, role);
  }

  getAlternativeAssignees(task, roleNames, assignedRole) {
    return roleNames
      .filter(role => role !== assignedRole)
      .map(role => ({
        role,
        confidence: this.calculateRoleTaskMatch(task, role)
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2);
  }

  calculateMilestoneDate(phase, index) {
    const baseDate = new Date();
    const weeksToAdd = (index + 1) * phase.duration;
    baseDate.setDate(baseDate.getDate() + (weeksToAdd * 7));
    return baseDate.toISOString();
  }

  generateMilestoneCriteria(phase) {
    return [
      `All ${phase.name.toLowerCase()} tasks completed`,
      `Code reviewed and approved`,
      `Documentation updated`,
      `Quality standards met`
    ];
  }

  calculateTaskStartDate(task, dependencies, allTasks) {
    if (dependencies.length === 0) {
      return new Date().toISOString();
    }
    
    // Find the latest end date of dependencies
    const dependencyTasks = allTasks.filter(t => dependencies.includes(t.id));
    const latestEndDate = dependencyTasks.reduce((latest, depTask) => {
      const endDate = new Date(depTask.endDate || new Date());
      return endDate > latest ? endDate : latest;
    }, new Date());
    
    return latestEndDate.toISOString();
  }

  calculateTaskEndDate(task) {
    const startDate = new Date(task.startDate || new Date());
    const workingDaysNeeded = Math.ceil(task.estimatedHours / 8);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + workingDaysNeeded);
    return endDate.toISOString();
  }
}

module.exports = TaskBreakdownEngine;
