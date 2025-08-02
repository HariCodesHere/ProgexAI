const natural = require('natural');
const _ = require('lodash');

class LearningAssistant {
  constructor() {
    this.knowledgeBase = {
      'React': {
        concepts: ['Components', 'JSX', 'Props', 'State', 'Hooks', 'Context', 'Lifecycle'],
        difficulty: 'intermediate',
        prerequisites: ['JavaScript', 'HTML', 'CSS'],
        resources: [
          { title: 'React Official Documentation', url: 'https://react.dev', type: 'documentation' },
          { title: 'React Tutorial for Beginners', url: '#', type: 'tutorial' },
          { title: 'React Best Practices', url: '#', type: 'guide' }
        ]
      },
      'Node.js': {
        concepts: ['Event Loop', 'Modules', 'NPM', 'Express', 'Async/Await', 'File System'],
        difficulty: 'intermediate',
        prerequisites: ['JavaScript'],
        resources: [
          { title: 'Node.js Documentation', url: 'https://nodejs.org/docs', type: 'documentation' },
          { title: 'Node.js Complete Guide', url: '#', type: 'course' },
          { title: 'Express.js Tutorial', url: '#', type: 'tutorial' }
        ]
      },
      'Python': {
        concepts: ['Syntax', 'Data Types', 'Functions', 'Classes', 'Modules', 'Exception Handling'],
        difficulty: 'beginner',
        prerequisites: [],
        resources: [
          { title: 'Python Official Tutorial', url: 'https://docs.python.org/tutorial/', type: 'documentation' },
          { title: 'Python for Beginners', url: '#', type: 'course' },
          { title: 'Python Best Practices', url: '#', type: 'guide' }
        ]
      },
      'Machine Learning': {
        concepts: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Feature Engineering', 'Model Evaluation'],
        difficulty: 'advanced',
        prerequisites: ['Python', 'Statistics', 'Linear Algebra'],
        resources: [
          { title: 'Machine Learning Course', url: '#', type: 'course' },
          { title: 'Scikit-learn Documentation', url: 'https://scikit-learn.org', type: 'documentation' },
          { title: 'ML Best Practices', url: '#', type: 'guide' }
        ]
      },
      'Database': {
        concepts: ['SQL', 'Normalization', 'Indexing', 'Transactions', 'NoSQL', 'ACID Properties'],
        difficulty: 'intermediate',
        prerequisites: [],
        resources: [
          { title: 'SQL Tutorial', url: '#', type: 'tutorial' },
          { title: 'Database Design Principles', url: '#', type: 'guide' },
          { title: 'MongoDB Documentation', url: 'https://docs.mongodb.com', type: 'documentation' }
        ]
      }
    };

    this.codeTemplates = {
      'React Component': {
        language: 'javascript',
        code: `import React, { useState, useEffect } from 'react';

function MyComponent({ title, data }) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data or perform side effects
    const fetchData = async () => {
      try {
        setLoading(true);
        // Your async operation here
        const result = await someAsyncOperation();
        setState(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-component">
      <h2>{title}</h2>
      {state && (
        <div>
          {/* Render your component content */}
          <p>Data: {JSON.stringify(state)}</p>
        </div>
      )}
    </div>
  );
}

export default MyComponent;`
      },
      'Express API Route': {
        language: 'javascript',
        code: `const express = require('express');
const router = express.Router();

// GET route
router.get('/items', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Your business logic here
    const items = await getItems(page, limit);
    
    res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST route
router.post('/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Name and description are required'
      });
    }
    
    // Create item
    const newItem = await createItem({ name, description });
    
    res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;`
      },
      'Python Function': {
        language: 'python',
        code: `def process_data(data, options=None):
    """
    Process data with optional configuration.
    
    Args:
        data (list): Input data to process
        options (dict, optional): Processing options
    
    Returns:
        dict: Processed result with metadata
    
    Raises:
        ValueError: If data is invalid
        TypeError: If data type is incorrect
    """
    if not isinstance(data, list):
        raise TypeError("Data must be a list")
    
    if not data:
        raise ValueError("Data cannot be empty")
    
    # Default options
    default_options = {
        'sort': True,
        'filter_nulls': True,
        'transform': 'lowercase'
    }
    
    # Merge options
    config = {**default_options, **(options or {})}
    
    try:
        # Process the data
        result = data.copy()
        
        # Filter nulls if requested
        if config['filter_nulls']:
            result = [item for item in result if item is not None]
        
        # Transform data
        if config['transform'] == 'lowercase':
            result = [str(item).lower() if isinstance(item, str) else item for item in result]
        
        # Sort if requested
        if config['sort']:
            result.sort()
        
        return {
            'data': result,
            'original_count': len(data),
            'processed_count': len(result),
            'config': config
        }
        
    except Exception as e:
        raise RuntimeError(f"Processing failed: {str(e)}")

# Example usage
if __name__ == "__main__":
    sample_data = ["Hello", "World", None, "Python"]
    result = process_data(sample_data)
    print(result)`
      }
    };

    this.commonQuestions = {
      'how to': 'implementation',
      'what is': 'concept',
      'why': 'explanation',
      'when to use': 'usage',
      'best practices': 'practices',
      'error': 'troubleshooting',
      'debug': 'troubleshooting'
    };
  }

  async provideHelp(query, context = '', userLevel = 'intermediate') {
    try {
      const processedQuery = this.preprocessQuery(query);
      const questionType = this.identifyQuestionType(query);
      const relevantTopics = this.findRelevantTopics(processedQuery);
      
      const response = {
        query: query,
        questionType: questionType,
        relevantTopics: relevantTopics,
        explanation: this.generateExplanation(processedQuery, relevantTopics, userLevel),
        codeExample: this.generateCodeExample(processedQuery, relevantTopics),
        resources: this.getRelevantResources(relevantTopics),
        relatedConcepts: this.getRelatedConcepts(relevantTopics),
        nextSteps: this.suggestNextSteps(processedQuery, userLevel),
        difficulty: this.assessDifficulty(relevantTopics),
        estimatedTime: this.estimateTimeToLearn(relevantTopics, userLevel),
        context: context,
        generatedAt: new Date().toISOString()
      };

      return response;
    } catch (error) {
      console.error('Error providing learning help:', error);
      throw new Error('Failed to provide learning assistance');
    }
  }

  preprocessQuery(query) {
    return query.toLowerCase().trim();
  }

  identifyQuestionType(query) {
    const queryLower = query.toLowerCase();
    
    for (const [pattern, type] of Object.entries(this.commonQuestions)) {
      if (queryLower.includes(pattern)) {
        return type;
      }
    }
    
    return 'general';
  }

  findRelevantTopics(query) {
    const topics = [];
    const queryWords = query.split(/\s+/);
    
    for (const [topic, info] of Object.entries(this.knowledgeBase)) {
      const topicLower = topic.toLowerCase();
      const conceptsLower = info.concepts.map(c => c.toLowerCase());
      
      // Direct topic match
      if (queryWords.some(word => topicLower.includes(word) || word.includes(topicLower))) {
        topics.push({ topic, relevance: 1.0, ...info });
        continue;
      }
      
      // Concept match
      const conceptMatches = conceptsLower.filter(concept => 
        queryWords.some(word => concept.includes(word) || word.includes(concept))
      );
      
      if (conceptMatches.length > 0) {
        topics.push({ 
          topic, 
          relevance: conceptMatches.length / conceptsLower.length,
          matchedConcepts: conceptMatches,
          ...info 
        });
      }
    }
    
    return topics.sort((a, b) => b.relevance - a.relevance).slice(0, 3);
  }

  generateExplanation(query, relevantTopics, userLevel) {
    if (relevantTopics.length === 0) {
      return this.generateGenericExplanation(query, userLevel);
    }
    
    const primaryTopic = relevantTopics[0];
    const explanation = this.buildExplanation(query, primaryTopic, userLevel);
    
    return explanation;
  }

  buildExplanation(query, topic, userLevel) {
    const levelAdjustments = {
      'beginner': {
        depth: 'basic',
        examples: 'simple',
        terminology: 'explained'
      },
      'intermediate': {
        depth: 'comprehensive',
        examples: 'practical',
        terminology: 'standard'
      },
      'advanced': {
        depth: 'detailed',
        examples: 'complex',
        terminology: 'technical'
      }
    };
    
    const adjustment = levelAdjustments[userLevel] || levelAdjustments['intermediate'];
    
    let explanation = `## Understanding ${topic.topic}\n\n`;
    
    // Introduction
    explanation += `${topic.topic} is a ${topic.difficulty}-level topic that's essential for modern development. `;
    
    if (topic.prerequisites && topic.prerequisites.length > 0) {
      explanation += `Before diving in, make sure you're comfortable with: ${topic.prerequisites.join(', ')}.\n\n`;
    }
    
    // Core concepts
    explanation += `### Key Concepts:\n\n`;
    const conceptsToShow = adjustment.depth === 'basic' ? 3 : 
                          adjustment.depth === 'comprehensive' ? 5 : topic.concepts.length;
    
    topic.concepts.slice(0, conceptsToShow).forEach((concept, index) => {
      explanation += `${index + 1}. **${concept}**: ${this.explainConcept(concept, topic.topic, adjustment)}\n`;
    });
    
    // Practical application
    explanation += `\n### Practical Application:\n\n`;
    explanation += this.generatePracticalApplication(topic.topic, adjustment);
    
    // Common pitfalls (for intermediate/advanced)
    if (userLevel !== 'beginner') {
      explanation += `\n### Common Pitfalls to Avoid:\n\n`;
      explanation += this.generateCommonPitfalls(topic.topic);
    }
    
    return explanation;
  }

  explainConcept(concept, topic, adjustment) {
    const explanations = {
      'Components': 'Reusable pieces of UI that encapsulate their own logic and styling',
      'JSX': 'A syntax extension that allows you to write HTML-like code in JavaScript',
      'Props': 'Data passed from parent to child components to customize behavior',
      'State': 'Internal data that components manage and can change over time',
      'Hooks': 'Functions that let you use state and lifecycle features in functional components',
      'Event Loop': 'The mechanism that handles asynchronous operations in JavaScript',
      'Modules': 'Reusable pieces of code that can be imported and exported',
      'Supervised Learning': 'ML technique where models learn from labeled training data',
      'SQL': 'Structured Query Language for managing and querying relational databases'
    };
    
    return explanations[concept] || `A key concept in ${topic} development`;
  }

  generatePracticalApplication(topic, adjustment) {
    const applications = {
      'React': 'Build interactive user interfaces for web applications, create reusable components, and manage application state effectively.',
      'Node.js': 'Create server-side applications, build REST APIs, handle file operations, and manage real-time communications.',
      'Python': 'Develop web applications, automate tasks, analyze data, and build machine learning models.',
      'Machine Learning': 'Build predictive models, classify data, detect patterns, and make data-driven decisions.',
      'Database': 'Store and retrieve data efficiently, ensure data integrity, and optimize query performance.'
    };
    
    return applications[topic] || 'Apply these concepts to solve real-world problems in your projects.';
  }

  generateCommonPitfalls(topic) {
    const pitfalls = {
      'React': '• Mutating state directly instead of using setState\n• Not using keys properly in lists\n• Creating functions inside render methods',
      'Node.js': '• Not handling errors in async operations\n• Blocking the event loop with synchronous operations\n• Memory leaks from unclosed connections',
      'Python': '• Not following PEP 8 style guidelines\n• Using mutable default arguments\n• Not handling exceptions properly',
      'Machine Learning': '• Overfitting models to training data\n• Not preprocessing data properly\n• Ignoring feature scaling and normalization',
      'Database': '• Not using indexes effectively\n• Poor database schema design\n• Not handling concurrent access properly'
    };
    
    return pitfalls[topic] || '• Not following best practices\n• Ignoring error handling\n• Poor code organization';
  }

  generateCodeExample(query, relevantTopics) {
    if (relevantTopics.length === 0) {
      return null;
    }
    
    const primaryTopic = relevantTopics[0].topic;
    const queryLower = query.toLowerCase();
    
    // Try to find the most relevant code template
    if (queryLower.includes('component') && primaryTopic === 'React') {
      return this.codeTemplates['React Component'];
    }
    
    if (queryLower.includes('api') || queryLower.includes('route')) {
      return this.codeTemplates['Express API Route'];
    }
    
    if (queryLower.includes('function') && primaryTopic === 'Python') {
      return this.codeTemplates['Python Function'];
    }
    
    // Generate a simple example based on the topic
    return this.generateSimpleExample(primaryTopic, query);
  }

  generateSimpleExample(topic, query) {
    const examples = {
      'React': {
        language: 'javascript',
        code: `// Simple React component example
import React, { useState } from 'react';

function ExampleComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default ExampleComponent;`
      },
      'Node.js': {
        language: 'javascript',
        code: `// Simple Node.js server example
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`
      },
      'Python': {
        language: 'python',
        code: `# Simple Python example
def greet(name, greeting="Hello"):
    """
    Greet a person with a custom message.
    """
    return f"{greeting}, {name}!"

# Usage
message = greet("World")
print(message)  # Output: Hello, World!`
      }
    };
    
    return examples[topic] || {
      language: 'text',
      code: `// Example code for ${topic} would go here
// This is a placeholder - specific examples depend on your use case`
    };
  }

  getRelevantResources(relevantTopics) {
    if (relevantTopics.length === 0) {
      return [];
    }
    
    const allResources = relevantTopics.flatMap(topic => topic.resources || []);
    return _.uniqBy(allResources, 'title').slice(0, 5);
  }

  getRelatedConcepts(relevantTopics) {
    if (relevantTopics.length === 0) {
      return [];
    }
    
    const primaryTopic = relevantTopics[0];
    const relatedMap = {
      'React': ['JavaScript', 'HTML', 'CSS', 'State Management', 'Component Lifecycle'],
      'Node.js': ['JavaScript', 'Express', 'NPM', 'Async Programming', 'REST APIs'],
      'Python': ['Data Types', 'Object-Oriented Programming', 'Libraries', 'Package Management'],
      'Machine Learning': ['Statistics', 'Data Science', 'Neural Networks', 'Feature Engineering'],
      'Database': ['SQL', 'Data Modeling', 'Indexing', 'Transactions', 'Performance Tuning']
    };
    
    return relatedMap[primaryTopic.topic] || [];
  }

  suggestNextSteps(query, userLevel) {
    const steps = [];
    
    if (userLevel === 'beginner') {
      steps.push('Start with the basics and build a simple project');
      steps.push('Practice with hands-on exercises');
      steps.push('Join online communities for support');
    } else if (userLevel === 'intermediate') {
      steps.push('Build a more complex project incorporating these concepts');
      steps.push('Explore advanced features and best practices');
      steps.push('Consider contributing to open source projects');
    } else {
      steps.push('Implement advanced patterns and optimizations');
      steps.push('Share knowledge through teaching or mentoring');
      steps.push('Stay updated with latest developments in the field');
    }
    
    return steps;
  }

  assessDifficulty(relevantTopics) {
    if (relevantTopics.length === 0) {
      return 'intermediate';
    }
    
    const difficulties = relevantTopics.map(topic => topic.difficulty);
    const difficultyScores = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
    
    const avgScore = difficulties.reduce((sum, diff) => sum + difficultyScores[diff], 0) / difficulties.length;
    
    if (avgScore <= 1.3) return 'beginner';
    if (avgScore <= 2.3) return 'intermediate';
    return 'advanced';
  }

  estimateTimeToLearn(relevantTopics, userLevel) {
    if (relevantTopics.length === 0) {
      return '2-4 hours';
    }
    
    const baseHours = {
      'beginner': 4,
      'intermediate': 2,
      'advanced': 1
    };
    
    const topicComplexity = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
    
    const primaryTopic = relevantTopics[0];
    const complexity = topicComplexity[primaryTopic.difficulty] || 2;
    const userMultiplier = baseHours[userLevel] || 2;
    
    const estimatedHours = complexity * userMultiplier;
    
    if (estimatedHours <= 2) return '1-2 hours';
    if (estimatedHours <= 4) return '2-4 hours';
    if (estimatedHours <= 8) return '4-8 hours';
    return '8+ hours';
  }

  generateGenericExplanation(query, userLevel) {
    return `I understand you're asking about "${query}". While I don't have specific information about this exact topic in my knowledge base, I can provide some general guidance:

### Approach for Learning New Topics:

1. **Start with the basics**: Look for fundamental concepts and definitions
2. **Find reliable resources**: Check official documentation, tutorials, and courses
3. **Practice hands-on**: Build small projects to reinforce learning
4. **Join communities**: Connect with others learning the same topic
5. **Ask specific questions**: Break down complex topics into smaller, manageable parts

### Recommended Learning Strategy:

- Begin with understanding the "what" and "why" before diving into "how"
- Look for practical examples and use cases
- Practice regularly and build projects
- Don't hesitate to ask for help when stuck

Would you like me to help you break down your question into more specific areas I can assist with?`;
  }
}

module.exports = LearningAssistant;
