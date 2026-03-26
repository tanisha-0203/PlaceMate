import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Code2, Building2, StickyNote, Flame, ArrowRight, Clock, Trophy } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { Link } from 'react-router-dom';

const mockChartData = [
  { name: 'Mon', solved: 2 },
  { name: 'Tue', solved: 5 },
  { name: 'Wed', solved: 3 },
  { name: 'Thu', solved: 7 },
  { name: 'Fri', solved: 4 },
  { name: 'Sat', solved: 8 },
  { name: 'Sun', solved: 6 },
];

const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your preparation progress and stay consistent.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full border border-orange-200/50 dark:border-orange-500/20">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">3 Day Streak!</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Problems Solved" 
          value="45" 
          trend="up" 
          trendValue="12"
          icon={Code2}
          colorClass={{ bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" }}
        />
        <StatCard 
          title="Active Applications" 
          value="12" 
          trend="up" 
          trendValue="4"
          icon={Building2}
          colorClass={{ bg: "bg-purple-100 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400" }}
        />
        <StatCard 
          title="Revision Notes" 
          value="28" 
          trend="up"
          trendValue="8"
          icon={StickyNote}
          colorClass={{ bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" }}
        />
        <StatCard 
          title="Mock Score (Avg)" 
          value="8.5/10" 
          icon={Trophy}
          colorClass={{ bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400" }}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-gray-900/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Weekly Problem Activity</h2>
            <select className="text-sm border-none bg-transparent text-gray-500 dark:text-gray-400 focus:ring-0 cursor-pointer outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="solved" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          
          <div className="flex-1 relative">
            <div className="absolute top-0 bottom-0 left-[11px] w-px bg-gray-200 dark:bg-gray-800" />
            
            <div className="space-y-6 relative">
              <div className="flex gap-4">
                <div className="relative z-10 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center ring-4 ring-white dark:ring-[#09090b]">
                  <Code2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Solved "Two Sum"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">2 hours ago</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="relative z-10 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center ring-4 ring-white dark:ring-[#09090b]">
                  <Building2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Applied to Google (SWE)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Yesterday</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="relative z-10 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center ring-4 ring-white dark:ring-[#09090b]">
                  <StickyNote className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Revised Operating Systems</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Oct 24, 2026</p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center justify-center gap-1">
            View All Activity
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Quick Access or Recommended */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/dsa" className="group p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10 text-white">
            <h3 className="text-lg font-bold">Continue Blind 75</h3>
            <p className="text-indigo-100 text-sm mt-1">You are 12% through the Must-Do list.</p>
          </div>
          <div className="relative z-10 bg-white/20 p-3 rounded-xl backdrop-blur-md group-hover:scale-110 transition-transform">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </Link>
        <Link to="/mock" className="group p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-black rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10 text-white">
            <h3 className="text-lg font-bold">Schedule Mock Interview</h3>
            <p className="text-gray-400 text-sm mt-1">Practice with peer or AI to build confidence.</p>
          </div>
          <div className="relative z-10 bg-gray-700/50 p-3 rounded-xl backdrop-blur-md group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        </Link>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;
