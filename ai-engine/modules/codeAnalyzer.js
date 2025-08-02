const natural = require('natural');
const _ = require('lodash');

class CodeAnalyzer {
  constructor() {
    this.codePatterns = {
      javascript: {
        goodPatterns: [
          { pattern: /const\s+\w+\s*=/, description: 'Using const for immutable variables', weight: 0.1 },
          { pattern: /async\s+function|=>\s*{/, description: 'Using modern async/await syntax', weight: 0.1 },
          { pattern: /try\s*{[\s\S]*catch\s*\(/, description: 'Proper error handling', weight: 0.2 },
          { pattern: /\/\*\*[\s\S]*?\*\/|\/\/.*$/m, description: 'Code documentation', weight: 0.1 },
          { pattern: /\w+\.map\(|\w+\.filter\(|\w+\.reduce\(/, description: 'Using functional programming methods', weight: 0.1 }
        ],
        badPatterns: [
          { pattern: /var\s+\w+/, description: 'Using var instead of const/let', weight: -0.1, suggestion: 'Use const or let instead of var' },
          { pattern: /==\s*[^=]/, description: 'Using loose equality', weight: -0.1, suggestion: 'Use strict equality (===) instead' },
          { pattern: /console\.log\(/, description: 'Console.log statements in production code', weight: -0.05, suggestion: 'Remove console.log or use proper logging' },
          { pattern: /function\s*\(\s*\)\s*{[\s\S]*}/, description: 'Empty functions', weight: -0.1, suggestion: 'Implement function body or add TODO comment' }
        ],
        complexity: [
          { pattern: /if\s*\(/, description: 'Conditional statements', weight: 1 },
          { pattern: /for\s*\(|while\s*\(/, description: 'Loops', weight: 2 },
          { pattern: /function\s+\w+|const\s+\w+\s*=\s*\(/, description: 'Functions', weight: 1 },
          { pattern: /class\s+\w+/, description: 'Classes', weight: 3 }
        ]
      },
      python: {
        goodPatterns: [
          { pattern: /def\s+\w+\(.*\):\s*"""/, description: 'Function with docstring', weight: 0.2 },
          { pattern: /with\s+open\(/, description: 'Using context managers', weight: 0.1 },
          { pattern: /try:\s*[\s\S]*except\s+\w+:/, description: 'Specific exception handling', weight: 0.2 },
          { pattern: /if\s+__name__\s*==\s*['"']__main__['"]/, description: 'Main guard', weight: 0.1 },
          { pattern: /\w+\s*=\s*\[.*for.*in.*\]/, description: 'List comprehensions', weight: 0.1 }
        ],
        badPatterns: [
          { pattern: /except:\s*$/, description: 'Bare except clause', weight: -0.2, suggestion: 'Catch specific exceptions' },
          { pattern: /print\(/, description: 'Print statements in production code', weight: -0.05, suggestion: 'Use logging instead of print' },
          { pattern: /global\s+\w+/, description: 'Global variables', weight: -0.1, suggestion: 'Avoid global variables when possible' },
          { pattern: /import\s+\*/, description: 'Wildcard imports', weight: -0.1, suggestion: 'Import specific items instead of using *' }
        ],
        complexity: [
          { pattern: /if\s+.*:/, description: 'Conditional statements', weight: 1 },
          { pattern: /for\s+.*:|while\s+.*:/, description: 'Loops', weight: 2 },
          { pattern: /def\s+\w+/, description: 'Functions', weight: 1 },
          { pattern: /class\s+\w+/, description: 'Classes', weight: 3 }
        ]
      }
    };

    this.securityPatterns = {
      javascript: [
        { pattern: /eval\(/, severity: 'high', description: 'Use of eval() can lead to code injection', suggestion: 'Avoid eval(), use safer alternatives' },
        { pattern: /innerHTML\s*=/, severity: 'medium', description: 'Direct innerHTML assignment can lead to XSS', suggestion: 'Use textContent or sanitize input' },
        { pattern: /document\.write\(/, severity: 'medium', description: 'document.write can be dangerous', suggestion: 'Use DOM manipulation methods instead' },
        { pattern: /Math\.random\(\)/, severity: 'low', description: 'Math.random() is not cryptographically secure', suggestion: 'Use crypto.getRandomValues() for security purposes' }
      ],
      python: [
        { pattern: /exec\(/, severity: 'high', description: 'Use of exec() can lead to code injection', suggestion: 'Avoid exec(), validate and sanitize input' },
        { pattern: /input\(/, severity: 'medium', description: 'Direct input() usage without validation', suggestion: 'Validate and sanitize user input' },
        { pattern: /pickle\.loads?\(/, severity: 'high', description: 'Pickle can execute arbitrary code', suggestion: 'Use safer serialization like JSON' },
        { pattern: /subprocess\.call\(/, severity: 'medium', description: 'Subprocess calls can be dangerous', suggestion: 'Validate input and use shell=False' }
      ]
    };

    this.performancePatterns = {
      javascript: [
        { pattern: /for\s*\(\s*var\s+\w+\s*=\s*0;\s*\w+\s*<\s*\w+\.length/, description: 'Inefficient loop with length check', suggestion: 'Cache array length or use for...of' },
        { pattern: /\+\s*['"`]/, description: 'String concatenation with +', suggestion: 'Use template literals for better performance' },
        { pattern: /document\.getElementById\(.*\)/, description: 'Repeated DOM queries', suggestion: 'Cache DOM references' }
      ],
      python: [
        { pattern: /\w+\s*\+=\s*\w+/, description: 'String concatenation in loop', suggestion: 'Use join() for multiple string concatenations' },
        { pattern: /range\(len\(\w+\)\)/, description: 'Using range(len()) instead of enumerate', suggestion: 'Use enumerate() for cleaner code' }
      ]
    };
  }

  async analyzeCode(code, language, context = '') {
    try {
      const normalizedLang = language.toLowerCase();
      const analysis = {
        language: normalizedLang,
        codeLength: code.length,
        lineCount: code.split('\n').length,
        overallScore: 0,
        qualityMetrics: this.calculateQualityMetrics(code, normalizedLang),
        securityIssues: this.findSecurityIssues(code, normalizedLang),
        performanceIssues: this.findPerformanceIssues(code, normalizedLang),
        suggestions: [],
        strengths: [],
        complexity: this.calculateComplexity(code, normalizedLang),
        maintainability: this.assessMaintainability(code, normalizedLang),
        readability: this.assessReadability(code, normalizedLang),
        bestPractices: this.checkBestPractices(code, normalizedLang),
        analyzedAt: new Date().toISOString()
      };

      // Calculate overall score
      analysis.overallScore = this.calculateOverallScore(analysis);
      
      // Generate comprehensive suggestions
      analysis.suggestions = this.generateSuggestions(analysis);
      
      // Identify strengths
      analysis.strengths = this.identifyStrengths(analysis);

      return analysis;
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw new Error('Failed to analyze code');
    }
  }

  calculateQualityMetrics(code, language) {
    const patterns = this.codePatterns[language];
    if (!patterns) {
      return { score: 0.5, details: 'Language not supported for detailed analysis' };
    }

    let score = 0.5; // Base score
    const details = [];

    // Check good patterns
    patterns.goodPatterns.forEach(pattern => {
      const matches = code.match(new RegExp(pattern.pattern, 'g'));
      if (matches) {
        score += pattern.weight * matches.length;
        details.push(`✓ ${pattern.description} (${matches.length} occurrences)`);
      }
    });

    // Check bad patterns
    patterns.badPatterns.forEach(pattern => {
      const matches = code.match(new RegExp(pattern.pattern, 'g'));
      if (matches) {
        score += pattern.weight * matches.length;
        details.push(`⚠ ${pattern.description} (${matches.length} occurrences)`);
      }
    });

    return {
      score: Math.max(0, Math.min(1, score)),
      details
    };
  }

  findSecurityIssues(code, language) {
    const patterns = this.securityPatterns[language] || [];
    const issues = [];

    patterns.forEach(pattern => {
      const matches = code.match(new RegExp(pattern.pattern, 'g'));
      if (matches) {
        const lines = this.findPatternLines(code, pattern.pattern);
        issues.push({
          severity: pattern.severity,
          description: pattern.description,
          suggestion: pattern.suggestion,
          occurrences: matches.length,
          lines: lines
        });
      }
    });

    return issues;
  }

  findPerformanceIssues(code, language) {
    const patterns = this.performancePatterns[language] || [];
    const issues = [];

    patterns.forEach(pattern => {
      const matches = code.match(new RegExp(pattern.pattern, 'g'));
      if (matches) {
        const lines = this.findPatternLines(code, pattern.pattern);
        issues.push({
          description: pattern.description,
          suggestion: pattern.suggestion,
          occurrences: matches.length,
          lines: lines,
          impact: this.assessPerformanceImpact(pattern.description)
        });
      }
    });

    return issues;
  }

  calculateComplexity(code, language) {
    const patterns = this.codePatterns[language];
    if (!patterns) {
      return { score: 'unknown', details: 'Language not supported' };
    }

    let complexityScore = 1; // Base complexity

    patterns.complexity.forEach(pattern => {
      const matches = code.match(new RegExp(pattern.pattern, 'g'));
      if (matches) {
        complexityScore += pattern.weight * matches.length;
      }
    });

    const linesOfCode = code.split('\n').filter(line => line.trim().length > 0).length;
    const normalizedScore = complexityScore / Math.max(linesOfCode / 10, 1);

    let level = 'low';
    if (normalizedScore > 3) level = 'high';
    else if (normalizedScore > 1.5) level = 'medium';

    return {
      score: normalizedScore,
      level: level,
      details: `Complexity score: ${normalizedScore.toFixed(2)}`
    };
  }

  assessMaintainability(code, language) {
    const factors = {
      functionLength: this.checkFunctionLength(code),
      naming: this.checkNamingConventions(code, language),
      comments: this.checkCommentRatio(code),
      duplication: this.checkCodeDuplication(code)
    };

    const score = Object.values(factors).reduce((sum, factor) => sum + factor.score, 0) / 4;

    return {
      score: score,
      level: score > 0.7 ? 'high' : score > 0.4 ? 'medium' : 'low',
      factors: factors
    };
  }

  assessReadability(code, language) {
    const factors = {
      indentation: this.checkIndentation(code),
      lineLength: this.checkLineLength(code),
      spacing: this.checkSpacing(code),
      structure: this.checkStructure(code, language)
    };

    const score = Object.values(factors).reduce((sum, factor) => sum + factor.score, 0) / 4;

    return {
      score: score,
      level: score > 0.7 ? 'high' : score > 0.4 ? 'medium' : 'low',
      factors: factors
    };
  }

  checkBestPractices(code, language) {
    const practices = [];

    if (language === 'javascript') {
      if (code.includes('use strict')) {
        practices.push({ practice: 'Strict mode', status: 'good', description: 'Using strict mode' });
      }
      if (code.includes('const ') || code.includes('let ')) {
        practices.push({ practice: 'Modern variable declarations', status: 'good', description: 'Using const/let instead of var' });
      }
      if (code.includes('async') && code.includes('await')) {
        practices.push({ practice: 'Modern async handling', status: 'good', description: 'Using async/await' });
      }
    }

    if (language === 'python') {
      if (code.includes('if __name__ == "__main__"')) {
        practices.push({ practice: 'Main guard', status: 'good', description: 'Using main guard pattern' });
      }
      if (code.includes('"""') || code.includes("'''")) {
        practices.push({ practice: 'Documentation', status: 'good', description: 'Using docstrings' });
      }
    }

    return practices;
  }

  calculateOverallScore(analysis) {
    const weights = {
      quality: 0.3,
      security: 0.25,
      performance: 0.2,
      maintainability: 0.15,
      readability: 0.1
    };

    let score = analysis.qualityMetrics.score * weights.quality;
    score += analysis.maintainability.score * weights.maintainability;
    score += analysis.readability.score * weights.readability;

    // Penalize for security issues
    const securityPenalty = analysis.securityIssues.reduce((penalty, issue) => {
      const severityWeights = { high: 0.3, medium: 0.15, low: 0.05 };
      return penalty + (severityWeights[issue.severity] || 0.05) * issue.occurrences;
    }, 0);
    score -= securityPenalty;

    // Penalize for performance issues
    const performancePenalty = analysis.performanceIssues.length * 0.02;
    score -= performancePenalty;

    return Math.max(0, Math.min(1, score));
  }

  generateSuggestions(analysis) {
    const suggestions = [];

    // Quality suggestions
    if (analysis.qualityMetrics.score < 0.6) {
      suggestions.push({
        category: 'code_quality',
        priority: 'high',
        message: 'Focus on improving code quality by following language best practices',
        details: analysis.qualityMetrics.details.filter(d => d.includes('⚠'))
      });
    }

    // Security suggestions
    analysis.securityIssues.forEach(issue => {
      if (issue.severity === 'high') {
        suggestions.push({
          category: 'security',
          priority: 'critical',
          message: issue.description,
          suggestion: issue.suggestion,
          lines: issue.lines
        });
      }
    });

    // Performance suggestions
    if (analysis.performanceIssues.length > 0) {
      suggestions.push({
        category: 'performance',
        priority: 'medium',
        message: `Found ${analysis.performanceIssues.length} potential performance improvements`,
        details: analysis.performanceIssues.map(issue => issue.suggestion)
      });
    }

    // Complexity suggestions
    if (analysis.complexity.level === 'high') {
      suggestions.push({
        category: 'complexity',
        priority: 'medium',
        message: 'Consider breaking down complex functions into smaller, more manageable pieces',
        suggestion: 'Refactor large functions and reduce nesting levels'
      });
    }

    return suggestions;
  }

  identifyStrengths(analysis) {
    const strengths = [];

    if (analysis.qualityMetrics.score > 0.7) {
      strengths.push('Good adherence to coding standards');
    }

    if (analysis.securityIssues.length === 0) {
      strengths.push('No obvious security vulnerabilities detected');
    }

    if (analysis.maintainability.score > 0.7) {
      strengths.push('Well-structured and maintainable code');
    }

    if (analysis.readability.score > 0.7) {
      strengths.push('Clean and readable code style');
    }

    if (analysis.complexity.level === 'low') {
      strengths.push('Low complexity, easy to understand');
    }

    return strengths;
  }

  // Helper methods
  findPatternLines(code, pattern) {
    const lines = code.split('\n');
    const matchingLines = [];
    
    lines.forEach((line, index) => {
      if (new RegExp(pattern).test(line)) {
        matchingLines.push(index + 1);
      }
    });
    
    return matchingLines;
  }

  assessPerformanceImpact(description) {
    if (description.includes('loop') || description.includes('inefficient')) {
      return 'high';
    }
    if (description.includes('DOM') || description.includes('query')) {
      return 'medium';
    }
    return 'low';
  }

  checkFunctionLength(code) {
    const functions = code.match(/function\s+\w+[^{]*{[^}]*}/g) || [];
    const avgLength = functions.reduce((sum, func) => {
      return sum + func.split('\n').length;
    }, 0) / Math.max(functions.length, 1);

    return {
      score: avgLength < 20 ? 1 : avgLength < 50 ? 0.7 : 0.3,
      details: `Average function length: ${avgLength.toFixed(1)} lines`
    };
  }

  checkNamingConventions(code, language) {
    // Simple naming convention check
    const camelCasePattern = /[a-z][a-zA-Z0-9]*/g;
    const matches = code.match(camelCasePattern) || [];
    
    return {
      score: matches.length > 0 ? 0.8 : 0.5,
      details: 'Basic naming convention check'
    };
  }

  checkCommentRatio(code) {
    const totalLines = code.split('\n').length;
    const commentLines = (code.match(/\/\/|\/\*|\*\/|#/g) || []).length;
    const ratio = commentLines / totalLines;

    return {
      score: ratio > 0.1 ? 1 : ratio > 0.05 ? 0.7 : 0.3,
      details: `Comment ratio: ${(ratio * 100).toFixed(1)}%`
    };
  }

  checkCodeDuplication(code) {
    // Simple duplication check based on line similarity
    const lines = code.split('\n').filter(line => line.trim().length > 5);
    const uniqueLines = new Set(lines);
    const duplicationRatio = 1 - (uniqueLines.size / lines.length);

    return {
      score: duplicationRatio < 0.1 ? 1 : duplicationRatio < 0.2 ? 0.7 : 0.3,
      details: `Duplication ratio: ${(duplicationRatio * 100).toFixed(1)}%`
    };
  }

  checkIndentation(code) {
    const lines = code.split('\n');
    const inconsistentIndentation = lines.some(line => {
      const leadingSpaces = line.match(/^[ \t]*/)[0];
      return leadingSpaces.includes(' ') && leadingSpaces.includes('\t');
    });

    return {
      score: inconsistentIndentation ? 0.3 : 0.9,
      details: inconsistentIndentation ? 'Mixed tabs and spaces' : 'Consistent indentation'
    };
  }

  checkLineLength(code) {
    const lines = code.split('\n');
    const longLines = lines.filter(line => line.length > 100);
    const ratio = longLines.length / lines.length;

    return {
      score: ratio < 0.1 ? 1 : ratio < 0.2 ? 0.7 : 0.3,
      details: `${longLines.length} lines exceed 100 characters`
    };
  }

  checkSpacing(code) {
    // Check for proper spacing around operators
    const goodSpacing = code.match(/\s[+\-*/=]\s/g) || [];
    const badSpacing = code.match(/[+\-*/=](?!\s)|(?<!\s)[+\-*/=]/g) || [];
    
    const ratio = goodSpacing.length / Math.max(goodSpacing.length + badSpacing.length, 1);

    return {
      score: ratio > 0.8 ? 1 : ratio > 0.6 ? 0.7 : 0.3,
      details: 'Operator spacing check'
    };
  }

  checkStructure(code, language) {
    // Basic structure check
    const hasProperStructure = language === 'javascript' ? 
      code.includes('function') || code.includes('=>') :
      code.includes('def ');

    return {
      score: hasProperStructure ? 0.8 : 0.5,
      details: 'Basic code structure check'
    };
  }
}

module.exports = CodeAnalyzer;
