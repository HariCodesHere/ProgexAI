const _ = require('lodash');

class TeamRoleAssigner {
  constructor() {
    this.roleDefinitions = {
      'Frontend Developer': {
        skills: ['React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'UI/UX'],
        responsibilities: ['User interface development', 'User experience design', 'Frontend architecture', 'Component development'],
        weight: 1.0
      },
      'Backend Developer': {
        skills: ['Node.js', 'Python', 'Java', 'Express', 'Django', 'Flask', 'API Development', 'Database'],
        responsibilities: ['Server-side logic', 'API development', 'Database design', 'Backend architecture'],
        weight: 1.0
      },
      'Full Stack Developer': {
        skills: ['React', 'Node.js', 'JavaScript', 'Python', 'Database', 'API Development'],
        responsibilities: ['End-to-end development', 'Frontend and backend integration', 'System architecture'],
        weight: 1.2
      },
      'Mobile Developer': {
        skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
        responsibilities: ['Mobile app development', 'Cross-platform development', 'Mobile UI/UX'],
        weight: 1.1
      },
      'AI/ML Engineer': {
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Science', 'OpenAI API', 'NLTK'],
        responsibilities: ['ML model development', 'AI integration', 'Data processing', 'Algorithm optimization'],
        weight: 1.3
      },
      'DevOps Engineer': {
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Cloud Computing'],
        responsibilities: ['Deployment automation', 'Infrastructure management', 'Monitoring and scaling'],
        weight: 1.1
      },
      'Data Engineer': {
        skills: ['Python', 'SQL', 'ETL', 'Data Warehousing', 'Apache Spark', 'Database'],
        responsibilities: ['Data pipeline development', 'Data architecture', 'Data processing'],
        weight: 1.1
      },
      'QA Engineer': {
        skills: ['Testing', 'Automation', 'Selenium', 'Jest', 'Quality Assurance'],
        responsibilities: ['Test planning', 'Automated testing', 'Quality assurance', 'Bug tracking'],
        weight: 0.8
      },
      'UI/UX Designer': {
        skills: ['Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        responsibilities: ['User interface design', 'User experience research', 'Prototyping', 'Design systems'],
        weight: 0.9
      },
      'Project Manager': {
        skills: ['Project Management', 'Agile', 'Scrum', 'Communication', 'Leadership'],
        responsibilities: ['Project planning', 'Team coordination', 'Timeline management', 'Stakeholder communication'],
        weight: 0.7
      },
      'Blockchain Developer': {
        skills: ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts', 'Blockchain'],
        responsibilities: ['Smart contract development', 'DApp development', 'Blockchain integration'],
        weight: 1.4
      },
      'Security Engineer': {
        skills: ['Cybersecurity', 'Penetration Testing', 'Security Auditing', 'Encryption'],
        responsibilities: ['Security assessment', 'Vulnerability testing', 'Security implementation'],
        weight: 1.2
      }
    };

    this.projectRoleRequirements = {
      'Web Development': ['Frontend Developer', 'Backend Developer', 'Project Manager'],
      'Mobile Development': ['Mobile Developer', 'Backend Developer', 'UI/UX Designer'],
      'AI/ML': ['AI/ML Engineer', 'Backend Developer', 'Data Engineer'],
      'Blockchain': ['Blockchain Developer', 'Frontend Developer', 'Security Engineer'],
      'Full Stack': ['Full Stack Developer', 'UI/UX Designer', 'DevOps Engineer'],
      'IoT': ['Backend Developer', 'Frontend Developer', 'DevOps Engineer'],
      'Data Science': ['Data Engineer', 'AI/ML Engineer', 'Backend Developer']
    };
  }

  async assignRoles(projectDetails, teamMembers) {
    try {
      const { category, technologies = [], complexity = 'intermediate' } = projectDetails;
      
      // Determine required roles based on project
      const requiredRoles = this.determineRequiredRoles(category, technologies, complexity);
      
      // Calculate role assignments for each team member
      const assignments = teamMembers.map(member => {
        const roleScores = this.calculateRoleScores(member, requiredRoles);
        const topRoles = this.getTopRoles(roleScores, 3);
        
        return {
          userId: member.userId,
          name: member.name,
          primaryRole: topRoles[0],
          alternativeRoles: topRoles.slice(1),
          skillMatch: topRoles[0].score,
          skillGaps: this.identifySkillGaps(member, topRoles[0].role),
          recommendations: this.generateRecommendations(member, topRoles[0].role)
        };
      });

      // Optimize team composition
      const optimizedAssignments = this.optimizeTeamComposition(assignments, requiredRoles);
      
      // Generate team insights
      const teamInsights = this.generateTeamInsights(optimizedAssignments, requiredRoles);

      return {
        assignments: optimizedAssignments,
        requiredRoles,
        teamInsights,
        recommendations: this.generateTeamRecommendations(optimizedAssignments, requiredRoles),
        assignedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error assigning roles:', error);
      throw new Error('Failed to assign team roles');
    }
  }

  determineRequiredRoles(category, technologies, complexity) {
    let baseRoles = this.projectRoleRequirements[category] || ['Frontend Developer', 'Backend Developer'];
    
    // Add technology-specific roles
    const techRoles = [];
    
    if (technologies.some(t => ['React Native', 'Flutter', 'Swift', 'Kotlin'].includes(t))) {
      techRoles.push('Mobile Developer');
    }
    if (technologies.some(t => ['TensorFlow', 'PyTorch', 'OpenAI API', 'Machine Learning'].includes(t))) {
      techRoles.push('AI/ML Engineer');
    }
    if (technologies.some(t => ['Solidity', 'Web3.js', 'Ethereum'].includes(t))) {
      techRoles.push('Blockchain Developer');
    }
    if (technologies.some(t => ['Docker', 'Kubernetes', 'AWS', 'CI/CD'].includes(t))) {
      techRoles.push('DevOps Engineer');
    }
    if (technologies.some(t => ['SQL', 'MongoDB', 'PostgreSQL', 'Data Warehousing'].includes(t))) {
      techRoles.push('Data Engineer');
    }

    // Merge and deduplicate roles
    const allRoles = [...new Set([...baseRoles, ...techRoles])];
    
    // Add complexity-based roles
    if (complexity === 'advanced' && allRoles.length > 2) {
      if (!allRoles.includes('QA Engineer')) allRoles.push('QA Engineer');
      if (!allRoles.includes('UI/UX Designer')) allRoles.push('UI/UX Designer');
    }
    
    // Always include Project Manager for teams > 3
    if (allRoles.length > 3 && !allRoles.includes('Project Manager')) {
      allRoles.push('Project Manager');
    }

    return allRoles.map(role => ({
      role,
      priority: this.getRolePriority(role, category),
      ...this.roleDefinitions[role]
    }));
  }

  calculateRoleScores(member, requiredRoles) {
    const { skills = [], experience = [], interests = [] } = member;
    const memberSkills = skills.map(s => s.toLowerCase());
    const memberInterests = interests.map(i => i.toLowerCase());
    
    return requiredRoles.map(roleInfo => {
      const roleSkills = roleInfo.skills.map(s => s.toLowerCase());
      
      // Calculate skill match score
      const skillMatches = roleSkills.filter(skill => 
        memberSkills.some(memberSkill => 
          skill.includes(memberSkill) || memberSkill.includes(skill)
        )
      );
      const skillScore = skillMatches.length / roleSkills.length;
      
      // Calculate interest match score
      const interestMatches = memberInterests.filter(interest => 
        roleSkills.some(skill => skill.includes(interest)) ||
        roleInfo.role.toLowerCase().includes(interest)
      );
      const interestScore = interestMatches.length / Math.max(memberInterests.length, 1);
      
      // Calculate experience score
      const experienceScore = experience.some(exp => 
        roleSkills.some(skill => exp.toLowerCase().includes(skill.toLowerCase()))
      ) ? 0.3 : 0;
      
      // Combined score with weights
      const totalScore = (skillScore * 0.5) + (interestScore * 0.3) + (experienceScore * 0.2);
      
      return {
        role: roleInfo.role,
        score: Math.min(totalScore, 1.0),
        skillMatch: skillScore,
        interestMatch: interestScore,
        experienceMatch: experienceScore > 0
      };
    });
  }

  getTopRoles(roleScores, count = 3) {
    return roleScores
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  identifySkillGaps(member, topRole) {
    const { skills = [] } = member;
    const memberSkills = skills.map(s => s.toLowerCase());
    const roleSkills = this.roleDefinitions[topRole.role].skills.map(s => s.toLowerCase());
    
    const gaps = roleSkills.filter(skill => 
      !memberSkills.some(memberSkill => 
        skill.includes(memberSkill) || memberSkill.includes(skill)
      )
    );
    
    return gaps.slice(0, 5); // Return top 5 skill gaps
  }

  generateRecommendations(member, topRole) {
    const skillGaps = this.identifySkillGaps(member, topRole);
    const recommendations = [];
    
    if (skillGaps.length > 0) {
      recommendations.push({
        type: 'skill_development',
        message: `Focus on learning: ${skillGaps.slice(0, 3).join(', ')}`,
        priority: 'high'
      });
    }
    
    if (topRole.score < 0.7) {
      recommendations.push({
        type: 'role_consideration',
        message: 'Consider pairing with a more experienced team member in this role',
        priority: 'medium'
      });
    }
    
    recommendations.push({
      type: 'growth_opportunity',
      message: `This role offers great learning opportunities in ${this.roleDefinitions[topRole.role].responsibilities[0]}`,
      priority: 'low'
    });
    
    return recommendations;
  }

  optimizeTeamComposition(assignments, requiredRoles) {
    // Simple optimization: ensure all critical roles are covered
    const criticalRoles = requiredRoles.filter(r => r.priority === 'high').map(r => r.role);
    const assignedRoles = assignments.map(a => a.primaryRole.role);
    
    // Check for missing critical roles
    const missingRoles = criticalRoles.filter(role => !assignedRoles.includes(role));
    
    if (missingRoles.length > 0) {
      // Try to reassign some members to cover missing roles
      for (const missingRole of missingRoles) {
        const candidate = assignments.find(a => 
          a.alternativeRoles.some(alt => alt.role === missingRole) &&
          !criticalRoles.includes(a.primaryRole.role)
        );
        
        if (candidate) {
          const newPrimaryRole = candidate.alternativeRoles.find(alt => alt.role === missingRole);
          candidate.alternativeRoles = [candidate.primaryRole, ...candidate.alternativeRoles.filter(alt => alt.role !== missingRole)];
          candidate.primaryRole = newPrimaryRole;
          candidate.reassigned = true;
          candidate.reassignmentReason = `Assigned to cover critical role: ${missingRole}`;
        }
      }
    }
    
    return assignments;
  }

  generateTeamInsights(assignments, requiredRoles) {
    const insights = [];
    
    // Team size analysis
    const teamSize = assignments.length;
    const optimalSize = requiredRoles.length;
    
    if (teamSize < optimalSize) {
      insights.push({
        type: 'team_size',
        message: `Team might benefit from ${optimalSize - teamSize} additional member(s)`,
        severity: 'medium'
      });
    }
    
    // Skill coverage analysis
    const coveredRoles = assignments.map(a => a.primaryRole.role);
    const uncoveredRoles = requiredRoles.filter(r => !coveredRoles.includes(r.role));
    
    if (uncoveredRoles.length > 0) {
      insights.push({
        type: 'role_coverage',
        message: `Consider adding: ${uncoveredRoles.map(r => r.role).join(', ')}`,
        severity: 'high'
      });
    }
    
    // Skill level distribution
    const avgSkillMatch = assignments.reduce((sum, a) => sum + a.skillMatch, 0) / assignments.length;
    
    if (avgSkillMatch < 0.6) {
      insights.push({
        type: 'skill_level',
        message: 'Team may need additional training or mentorship',
        severity: 'medium'
      });
    }
    
    return insights;
  }

  generateTeamRecommendations(assignments, requiredRoles) {
    const recommendations = [];
    
    // Learning paths
    const commonSkillGaps = this.findCommonSkillGaps(assignments);
    if (commonSkillGaps.length > 0) {
      recommendations.push({
        type: 'team_learning',
        message: `Team should focus on: ${commonSkillGaps.join(', ')}`,
        action: 'Organize team learning sessions or workshops'
      });
    }
    
    // Mentorship opportunities
    const experiencedMembers = assignments.filter(a => a.skillMatch > 0.8);
    const noviceMembers = assignments.filter(a => a.skillMatch < 0.5);
    
    if (experiencedMembers.length > 0 && noviceMembers.length > 0) {
      recommendations.push({
        type: 'mentorship',
        message: 'Set up mentorship pairs for knowledge transfer',
        action: 'Pair experienced members with those needing support'
      });
    }
    
    return recommendations;
  }

  findCommonSkillGaps(assignments) {
    const allGaps = assignments.flatMap(a => a.skillGaps);
    const gapCounts = _.countBy(allGaps);
    
    return Object.entries(gapCounts)
      .filter(([gap, count]) => count >= Math.ceil(assignments.length / 2))
      .map(([gap]) => gap)
      .slice(0, 3);
  }

  getRolePriority(role, category) {
    const highPriorityRoles = {
      'Web Development': ['Frontend Developer', 'Backend Developer'],
      'Mobile Development': ['Mobile Developer'],
      'AI/ML': ['AI/ML Engineer'],
      'Blockchain': ['Blockchain Developer']
    };
    
    return highPriorityRoles[category]?.includes(role) ? 'high' : 'medium';
  }
}

module.exports = TeamRoleAssigner;
