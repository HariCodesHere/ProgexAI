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
  Zap,
  Rocket
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const features = [
    {
      id: 'ideagen',
      icon: Brain,
      title: 'AI Project Generator',
      description: 'Get personalized project ideas powered by GenAI',
      color: 'neon-cyan'
    },
    {
      id: 'teams',
      icon: Users,
      title: 'Smart Team Builder',
      description: 'AI-powered role assignment and team formation',
      color: 'neon-pink'
    },
    {
      id: 'tasks',
      icon: CheckSquare,
      title: 'Task Breakdown',
      description: 'Automated project roadmaps and task management',
      color: 'neon-green'
    },
    {
      id: 'learning',
      icon: BookOpen,
      title: 'Learning Assistant',
      description: 'Context-aware tutorials and code guidance',
      color: 'neon-purple'
    },
    {
      id: 'github',
      icon: Github,
      title: 'GitHub Integration',
      description: 'Visual Git interface for seamless collaboration',
      color: 'neon-cyan'
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'AI-powered insights and progress tracking',
      color: 'neon-pink'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-morphism border-b border-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-neon rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-dark-bg" />
              </div>
              <h1 className="text-2xl font-cyber font-bold neon-text text-neon-cyan">
                ProgexAI
              </h1>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-white hover:text-neon-cyan transition-colors">
                Dashboard
              </Link>
              <Link href="/projects" className="text-white hover:text-neon-cyan transition-colors">
                Projects
              </Link>
              <Link href="/teams" className="text-white hover:text-neon-cyan transition-colors">
                Teams
              </Link>
              <button className="neon-border px-6 py-2 rounded-lg hover:bg-neon-cyan hover:text-dark-bg transition-all duration-300">
                Sign In
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-cyber font-bold mb-6 neon-text text-transparent bg-clip-text bg-gradient-neon">
              Build Tomorrow's Projects Today
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              ProgexAI is the GenAI-powered platform that transforms student project collaboration 
              through intelligent ideation, smart team building, and AI-driven development assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                className="bg-gradient-neon text-dark-bg px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <Rocket className="w-5 h-5" />
                  <span>Start Building</span>
                </div>
              </motion.button>
              
              <motion.button
                className="neon-border text-neon-cyan px-8 py-4 rounded-lg font-bold text-lg hover:bg-neon-cyan hover:text-dark-bg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.h3 
            className="text-4xl font-cyber font-bold text-center mb-16 neon-text text-neon-cyan"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Powered by Advanced AI
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="glass-morphism p-8 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setIsHovered(feature.id)}
                onHoverEnd={() => setIsHovered(null)}
                whileHover={{ 
                  boxShadow: `0 0 30px rgba(0, 255, 255, 0.3)`,
                  borderColor: '#00ffff'
                }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}/20 flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <h4 className="text-xl font-cyber font-bold text-white">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="glass-morphism p-12 rounded-2xl text-center neon-border"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Trophy className="w-16 h-16 text-neon-green mx-auto mb-6" />
            <h3 className="text-3xl font-cyber font-bold mb-4 neon-text text-neon-green">
              Ready to Level Up Your Projects?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students already using ProgexAI to build amazing projects, 
              learn new skills, and collaborate like never before.
            </p>
            <motion.button
              className="bg-gradient-neon text-dark-bg px-12 py-4 rounded-lg font-bold text-xl hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-morphism border-t border-neon-cyan/20 py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-dark-bg" />
            </div>
            <span className="text-xl font-cyber font-bold neon-text text-neon-cyan">
              ProgexAI
            </span>
          </div>
          <p className="text-gray-400">
            © 2024 ProgexAI. Empowering students through AI-driven collaboration.
          </p>
        </div>
      </footer>
    </div>
  )
}
