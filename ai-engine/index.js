const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Import AI modules
const ProjectIdeaGenerator = require('./modules/projectIdeaGenerator');
const TeamRoleAssigner = require('./modules/teamRoleAssigner');
const TaskBreakdownEngine = require('./modules/taskBreakdownEngine');
const LearningAssistant = require('./modules/learningAssistant');
const CodeAnalyzer = require('./modules/codeAnalyzer');
const ProgressAnalyzer = require('./modules/progressAnalyzer');

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

// Rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 AI requests per windowMs
  message: 'Too many AI requests, please try again later.'
});

app.use('/ai/', aiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize AI modules
const projectGenerator = new ProjectIdeaGenerator();
const roleAssigner = new TeamRoleAssigner();
const taskEngine = new TaskBreakdownEngine();
const learningAssistant = new LearningAssistant();
const codeAnalyzer = new CodeAnalyzer();
const progressAnalyzer = new ProgressAnalyzer();

// AI Routes

// Generate project ideas
app.post('/ai/generate-ideas', async (req, res) => {
  try {
    const { userProfile, preferences } = req.body;
    const ideas = await projectGenerator.generateIdeas(userProfile, preferences);
    res.json({ success: true, ideas });
  } catch (error) {
    console.error('Project idea generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate project ideas',
      message: error.message 
    });
  }
});

// Assign team roles
app.post('/ai/assign-roles', async (req, res) => {
  try {
    const { projectDetails, teamMembers } = req.body;
    const assignments = await roleAssigner.assignRoles(projectDetails, teamMembers);
    res.json({ success: true, assignments });
  } catch (error) {
    console.error('Role assignment error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to assign roles',
      message: error.message 
    });
  }
});

// Break down project into tasks
app.post('/ai/breakdown-tasks', async (req, res) => {
  try {
    const { projectDetails, teamRoles, timeline } = req.body;
    const breakdown = await taskEngine.breakdownProject(projectDetails, teamRoles, timeline);
    res.json({ success: true, breakdown });
  } catch (error) {
    console.error('Task breakdown error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to breakdown tasks',
      message: error.message 
    });
  }
});

// Learning assistance
app.post('/ai/learning-help', async (req, res) => {
  try {
    const { query, context, userLevel } = req.body;
    const assistance = await learningAssistant.provideHelp(query, context, userLevel);
    res.json({ success: true, assistance });
  } catch (error) {
    console.error('Learning assistance error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to provide learning assistance',
      message: error.message 
    });
  }
});

// Code analysis and review
app.post('/ai/analyze-code', async (req, res) => {
  try {
    const { code, language, context } = req.body;
    const analysis = await codeAnalyzer.analyzeCode(code, language, context);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze code',
      message: error.message 
    });
  }
});

// Progress analysis and insights
app.post('/ai/analyze-progress', async (req, res) => {
  try {
    const { projectData, teamData, timelineData } = req.body;
    const insights = await progressAnalyzer.analyzeProgress(projectData, teamData, timelineData);
    res.json({ success: true, insights });
  } catch (error) {
    console.error('Progress analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze progress',
      message: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ProgexAI AI Engine',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('AI Engine Error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'AI Engine internal error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'AI endpoint not found' 
  });
});

const PORT = process.env.AI_ENGINE_PORT || 6000;

app.listen(PORT, () => {
  console.log(`🤖 ProgexAI AI Engine running on port ${PORT}`);
  console.log(`🧠 AI modules loaded and ready`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
