const natural = require('natural');
const _ = require('lodash');

class ProjectIdeaGenerator {
  constructor() {
    this.projectTemplates = [
      {
        category: 'Web Development',
        templates: [
          {
            title: 'E-Commerce Platform',
            description: 'Build a full-stack e-commerce platform with payment integration',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
            difficulty: 'intermediate',
            duration: '8-10 weeks'
          },
          {
            title: 'Social Media Dashboard',
            description: 'Create a comprehensive social media management tool',
            technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Social Media APIs'],
            difficulty: 'intermediate',
            duration: '6-8 weeks'
          },
          {
            title: 'Real-time Chat Application',
            description: 'Develop a real-time messaging platform with video calls',
            technologies: ['React', 'Socket.io', 'WebRTC', 'Node.js'],
            difficulty: 'advanced',
            duration: '10-12 weeks'
          }
        ]
      },
      {
        category: 'AI/ML',
        templates: [
          {
            title: 'Smart Study Assistant',
            description: 'AI-powered personalized learning and study recommendation system',
            technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
            difficulty: 'advanced',
            duration: '10-14 weeks'
          },
          {
            title: 'Image Recognition App',
            description: 'Mobile app for object detection and classification',
            technologies: ['React Native', 'TensorFlow Lite', 'Python', 'Firebase'],
            difficulty: 'intermediate',
            duration: '8-10 weeks'
          },
          {
            title: 'Chatbot for Customer Service',
            description: 'Intelligent chatbot with natural language processing',
            technologies: ['Python', 'NLTK', 'React', 'Node.js', 'OpenAI API'],
            difficulty: 'intermediate',
            duration: '6-8 weeks'
          }
        ]
      },
      {
        category: 'Mobile Development',
        templates: [
          {
            title: 'Fitness Tracking App',
            description: 'Comprehensive fitness and health monitoring application',
            technologies: ['React Native', 'Firebase', 'HealthKit', 'Node.js'],
            difficulty: 'intermediate',
            duration: '8-10 weeks'
          },
          {
            title: 'Campus Navigation System',
            description: 'AR-powered campus navigation with indoor mapping',
            technologies: ['React Native', 'ARCore/ARKit', 'Google Maps API', 'Node.js'],
            difficulty: 'advanced',
            duration: '12-14 weeks'
          }
        ]
      },
      {
        category: 'Blockchain',
        templates: [
          {
            title: 'Decentralized Voting System',
            description: 'Secure blockchain-based voting platform',
            technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum'],
            difficulty: 'advanced',
            duration: '10-12 weeks'
          },
          {
            title: 'NFT Marketplace',
            description: 'Platform for creating, buying, and selling NFTs',
            technologies: ['Solidity', 'React', 'IPFS', 'Web3.js'],
            difficulty: 'advanced',
            duration: '12-16 weeks'
          }
        ]
      },
      {
        category: 'IoT',
        templates: [
          {
            title: 'Smart Home Automation',
            description: 'IoT-based home automation system with mobile control',
            technologies: ['Arduino', 'Raspberry Pi', 'React Native', 'MQTT'],
            difficulty: 'intermediate',
            duration: '10-12 weeks'
          },
          {
            title: 'Environmental Monitoring System',
            description: 'IoT sensors for monitoring air quality and weather',
            technologies: ['Arduino', 'Python', 'React', 'InfluxDB'],
            difficulty: 'intermediate',
            duration: '8-10 weeks'
          }
        ]
      }
    ];

    this.skillWeights = {
      'JavaScript': ['React', 'Vue.js', 'Node.js', 'Express'],
      'Python': ['TensorFlow', 'FastAPI', 'Django', 'Flask'],
      'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      'AI/ML': ['TensorFlow', 'PyTorch', 'OpenAI API', 'NLTK'],
      'Blockchain': ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts'],
      'IoT': ['Arduino', 'Raspberry Pi', 'MQTT', 'Sensors']
    };
  }

  async generateIdeas(userProfile, preferences = {}) {
    try {
      const { skills = [], interests = [], experience = 'beginner' } = userProfile;
      const { category, difficulty, duration } = preferences;

      let allProjects = [];
      
      // Flatten all project templates
      this.projectTemplates.forEach(cat => {
        cat.templates.forEach(template => {
          allProjects.push({
            ...template,
            category: cat.category,
            id: this.generateId(),
            feasibilityScore: 0,
            matchScore: 0,
            learningValue: 0
          });
        });
      });

      // Filter by preferences
      if (category) {
        allProjects = allProjects.filter(p => p.category === category);
      }
      if (difficulty) {
        allProjects = allProjects.filter(p => p.difficulty === difficulty);
      }

      // Calculate scores for each project
      allProjects = allProjects.map(project => {
        const matchScore = this.calculateMatchScore(project, skills, interests);
        const feasibilityScore = this.calculateFeasibilityScore(project, experience);
        const learningValue = this.calculateLearningValue(project, skills);

        return {
          ...project,
          matchScore,
          feasibilityScore,
          learningValue,
          overallScore: (matchScore * 0.4) + (feasibilityScore * 0.3) + (learningValue * 0.3)
        };
      });

      // Sort by overall score and return top projects
      const rankedProjects = allProjects
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, 8)
        .map(project => ({
          ...project,
          estimatedTeamSize: this.estimateTeamSize(project),
          suggestedRoles: this.suggestRoles(project),
          industryRelevance: this.getIndustryRelevance(project.category),
          learningOutcomes: this.generateLearningOutcomes(project)
        }));

      return {
        projects: rankedProjects,
        totalGenerated: rankedProjects.length,
        basedOn: { skills, interests, experience, preferences },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating project ideas:', error);
      throw new Error('Failed to generate project ideas');
    }
  }

  calculateMatchScore(project, userSkills, userInterests) {
    let score = 0;
    const projectTechs = project.technologies.map(t => t.toLowerCase());
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const userInterestsLower = userInterests.map(i => i.toLowerCase());

    // Skill matching (40% weight)
    const skillMatches = projectTechs.filter(tech => 
      userSkillsLower.some(skill => tech.includes(skill) || skill.includes(tech))
    );
    score += (skillMatches.length / projectTechs.length) * 0.4;

    // Interest matching (30% weight)
    const interestMatches = userInterestsLower.filter(interest => 
      project.category.toLowerCase().includes(interest) ||
      project.description.toLowerCase().includes(interest) ||
      projectTechs.some(tech => tech.includes(interest))
    );
    score += (interestMatches.length / Math.max(userInterestsLower.length, 1)) * 0.3;

    // Category preference (30% weight)
    const categoryMatch = userInterestsLower.some(interest => 
      project.category.toLowerCase().includes(interest)
    );
    score += categoryMatch ? 0.3 : 0;

    return Math.min(score, 1.0);
  }

  calculateFeasibilityScore(project, experience) {
    const difficultyScores = {
      'beginner': { 'beginner': 1.0, 'intermediate': 0.6, 'advanced': 0.3 },
      'intermediate': { 'beginner': 0.8, 'intermediate': 1.0, 'advanced': 0.7 },
      'advanced': { 'beginner': 0.6, 'intermediate': 0.9, 'advanced': 1.0 }
    };

    return difficultyScores[experience]?.[project.difficulty] || 0.5;
  }

  calculateLearningValue(project, userSkills) {
    const projectTechs = project.technologies.map(t => t.toLowerCase());
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    
    // Higher learning value for technologies user doesn't know
    const newTechs = projectTechs.filter(tech => 
      !userSkillsLower.some(skill => tech.includes(skill) || skill.includes(tech))
    );
    
    return Math.min(newTechs.length / projectTechs.length, 1.0);
  }

  estimateTeamSize(project) {
    const complexityFactors = {
      'beginner': 2,
      'intermediate': 3,
      'advanced': 4
    };
    
    const techCount = project.technologies.length;
    const baseSize = complexityFactors[project.difficulty] || 3;
    
    return Math.min(Math.max(baseSize + Math.floor(techCount / 3), 2), 6);
  }

  suggestRoles(project) {
    const roles = [];
    const techs = project.technologies;
    
    if (techs.some(t => ['React', 'Vue.js', 'Angular', 'HTML', 'CSS'].includes(t))) {
      roles.push('Frontend Developer');
    }
    if (techs.some(t => ['Node.js', 'Express', 'Django', 'Flask', 'FastAPI'].includes(t))) {
      roles.push('Backend Developer');
    }
    if (techs.some(t => ['React Native', 'Flutter', 'Swift', 'Kotlin'].includes(t))) {
      roles.push('Mobile Developer');
    }
    if (techs.some(t => ['TensorFlow', 'PyTorch', 'OpenAI API', 'NLTK'].includes(t))) {
      roles.push('AI/ML Engineer');
    }
    if (techs.some(t => ['Solidity', 'Web3.js', 'Ethereum'].includes(t))) {
      roles.push('Blockchain Developer');
    }
    if (techs.some(t => ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase'].includes(t))) {
      roles.push('Database Engineer');
    }
    
    roles.push('Project Manager');
    if (roles.length > 2) roles.push('QA Engineer');
    
    return roles;
  }

  getIndustryRelevance(category) {
    const relevanceMap = {
      'Web Development': 'Very High - Core industry skill',
      'AI/ML': 'Extremely High - Fastest growing field',
      'Mobile Development': 'High - Essential for modern apps',
      'Blockchain': 'High - Emerging technology',
      'IoT': 'High - Growing market',
      'Data Science': 'Very High - Data-driven decisions'
    };
    
    return relevanceMap[category] || 'Medium - Good learning opportunity';
  }

  generateLearningOutcomes(project) {
    const outcomes = [];
    const techs = project.technologies;
    
    if (techs.some(t => ['React', 'Vue.js', 'Angular'].includes(t))) {
      outcomes.push('Modern frontend development');
    }
    if (techs.some(t => ['Node.js', 'Express'].includes(t))) {
      outcomes.push('Backend API development');
    }
    if (techs.some(t => ['MongoDB', 'PostgreSQL'].includes(t))) {
      outcomes.push('Database design and management');
    }
    if (techs.some(t => ['TensorFlow', 'PyTorch'].includes(t))) {
      outcomes.push('Machine learning implementation');
    }
    if (techs.some(t => ['Socket.io', 'WebRTC'].includes(t))) {
      outcomes.push('Real-time communication');
    }
    
    outcomes.push('Project management and teamwork');
    outcomes.push('Version control with Git');
    
    return outcomes;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = ProjectIdeaGenerator;
