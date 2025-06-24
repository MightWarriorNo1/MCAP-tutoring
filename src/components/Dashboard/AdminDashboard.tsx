import React from 'react';
import { Users, BookOpen, TrendingUp, AlertCircle, UserCheck, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const userDistributionData = [
  { name: 'Students', value: 245, color: '#2563eb' },
  { name: 'Tutors', value: 18, color: '#0891b2' },
  { name: 'Admins', value: 3, color: '#ea580c' },
];

const platformGrowthData = [
  { month: 'Jan', users: 180, sessions: 320 },
  { month: 'Feb', users: 195, sessions: 385 },
  { month: 'Mar', users: 210, sessions: 420 },
  { month: 'Apr', users: 235, sessions: 480 },
  { month: 'May', users: 250, sessions: 520 },
  { month: 'Jun', users: 266, sessions: 575 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          System Overview - {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-primary-600">266</p>
              <p className="text-xs text-success-600 mt-1">+12 this week</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-success-600">158</p>
              <p className="text-xs text-success-600 mt-1">+8% from last month</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <UserCheck className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Content Items</p>
              <p className="text-2xl font-bold text-secondary-600">1,247</p>
              <p className="text-xs text-secondary-600 mt-1">+23 this week</p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full">
              <FileText className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-success-600">99.8%</p>
              <p className="text-xs text-success-600 mt-1">All systems operational</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {userDistributionData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Growth */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stackId="1"
                  stroke="#2563eb" 
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="sessions" 
                  stackId="2"
                  stroke="#0891b2" 
                  fill="#0891b2"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New user registration', user: 'Emma Wilson', time: '5 minutes ago', type: 'user' },
              { action: 'Content upload', user: 'Dr. Smith', time: '15 minutes ago', type: 'content' },
              { action: 'Tutor session completed', user: 'Alex Johnson', time: '32 minutes ago', type: 'session' },
              { action: 'System backup completed', user: 'System', time: '1 hour ago', type: 'system' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user' ? 'bg-primary-500' :
                  activity.type === 'content' ? 'bg-secondary-500' :
                  activity.type === 'session' ? 'bg-success-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-success-50 border border-success-200 rounded-lg">
              <div className="p-1 bg-success-100 rounded-full">
                <UserCheck className="w-4 h-4 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-900">All systems operational</p>
                <p className="text-xs text-success-700">Server uptime: 99.8%</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="p-1 bg-warning-100 rounded-full">
                <AlertCircle className="w-4 h-4 text-warning-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-warning-900">Scheduled maintenance</p>
                <p className="text-xs text-warning-700">Database optimization - Tonight 2:00 AM</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="p-1 bg-primary-100 rounded-full">
                <BookOpen className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-900">Content review pending</p>
                <p className="text-xs text-primary-700">5 new resources awaiting approval</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;