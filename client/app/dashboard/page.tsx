'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Users, 
  CheckSquare, 
  BookOpen, 
  Github, 
  BarChart3, 
  Trophy,
  MessageCircle,
  Plus,
  Clock,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const projects = [
    {
      id: 1,
      name: 'E-Commerce AI Chatbot',
      progress: 75,
      team: ['Alice', 'Bob', 'Charlie'],
      deadline: '2024-02-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Smart Campus Navigation',
      progress: 45,
      team: ['David', 'Eve'],
      deadline: '2024-03-01',
      status: 'active'
    },
    {
      id: 3,
      name: 'Blockchain Voting System',
      progress: 90,
      team: ['Frank', 'Grace', 'Henry', 'Ivy'],
      deadline: '2024-01-30',
      status: 'review'
    }
  ]

  const recentActivity = [
    { type: 'commit', message: 'Added user authentication', time: '2 hours ago', user: 'Alice' },
    { type: 'task', message: 'Completed API integration', time: '4 hours ago', user: 'Bob' },
    { type: 'review', message: 'Code review requested', time: '6 hours ago', user: 'Charlie' },
    { type: 'idea', message: 'New feature suggestion', time: '1 day ago', user: 'AI Assistant' }
  ]

  const achievements = [
    { name: 'First Commit', icon: Github, earned: true },
    { name: 'Team Player', icon: Users, earned: true },
    { name: 'Code Reviewer', icon: CheckSquare, earned: false },
    { name: 'AI Collaborator', icon: Brain, earned: true }
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="glass-morphism border-b border-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-neon rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-dark-bg" />
              </div>
              <h1 className="text-2xl font-cyber font-bold neon-text text-neon-cyan">
                ProgexAI Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                className="bg-gradient-neon text-dark-bg px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-morphism p-6 rounded-xl neon-border">
              <nav className="space-y-4">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'projects', label: 'Projects', icon: CheckSquare },
                  { id: 'teams', label: 'Teams', icon: Users },
                  { id: 'learning', label: 'Learning', icon: BookOpen },
                  { id: 'achievements', label: 'Achievements', icon: Trophy }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === item.id 
                        ? 'bg-neon-cyan/20 text-neon-cyan neon-border' 
                        : 'text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-cyber">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    className="glass-morphism p-6 rounded-xl neon-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-cyber">Active Projects</p>
                        <p className="text-3xl font-bold text-neon-cyan">3</p>
                      </div>
                      <CheckSquare className="w-8 h-8 text-neon-cyan" />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="glass-morphism p-6 rounded-xl neon-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-cyber">Team Members</p>
                        <p className="text-3xl font-bold text-neon-pink">12</p>
                      </div>
                      <Users className="w-8 h-8 text-neon-pink" />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="glass-morphism p-6 rounded-xl neon-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-cyber">Achievements</p>
                        <p className="text-3xl font-bold text-neon-green">8</p>
                      </div>
                      <Trophy className="w-8 h-8 text-neon-green" />
                    </div>
                  </motion.div>
                </div>

                {/* Active Projects */}
                <motion.div 
                  className="glass-morphism p-6 rounded-xl neon-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-xl font-cyber font-bold text-neon-cyan mb-6">Active Projects</h3>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="glass-morphism p-4 rounded-lg border border-neon-cyan/20">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-cyber font-bold text-white">{project.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            project.status === 'active' ? 'bg-neon-green/20 text-neon-green' :
                            project.status === 'review' ? 'bg-neon-purple/20 text-neon-purple' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {project.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex -space-x-2">
                            {project.team.map((member, idx) => (
                              <div key={idx} className="w-8 h-8 bg-gradient-neon rounded-full flex items-center justify-center text-dark-bg text-xs font-bold">
                                {member[0]}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{project.deadline}</span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-dark-accent rounded-full h-2">
                          <div 
                            className="bg-gradient-neon h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{project.progress}% Complete</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div 
                  className="glass-morphism p-6 rounded-xl neon-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-cyber font-bold text-neon-cyan mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'commit' ? 'bg-neon-cyan/20' :
                          activity.type === 'task' ? 'bg-neon-green/20' :
                          activity.type === 'review' ? 'bg-neon-purple/20' :
                          'bg-neon-pink/20'
                        }`}>
                          {activity.type === 'commit' && <Github className="w-5 h-5 text-neon-cyan" />}
                          {activity.type === 'task' && <CheckSquare className="w-5 h-5 text-neon-green" />}
                          {activity.type === 'review' && <Star className="w-5 h-5 text-neon-purple" />}
                          {activity.type === 'idea' && <Brain className="w-5 h-5 text-neon-pink" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-cyber">{activity.message}</p>
                          <p className="text-gray-400 text-sm">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <motion.div 
                className="glass-morphism p-6 rounded-xl neon-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-cyber font-bold text-neon-cyan mb-6">Your Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-neon-green/10 border-neon-green/50 neon-border' 
                        : 'bg-gray-500/10 border-gray-500/20'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <achievement.icon className={`w-8 h-8 ${
                          achievement.earned ? 'text-neon-green' : 'text-gray-500'
                        }`} />
                        <div>
                          <h4 className={`font-cyber font-bold ${
                            achievement.earned ? 'text-neon-green' : 'text-gray-500'
                          }`}>
                            {achievement.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {achievement.earned ? 'Earned!' : 'Not yet earned'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
