import React from 'react';
import { Calendar, BookOpen, Target, Clock, TrendingUp, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockProgressData = [
  { date: '2024-01-01', score: 65 },
  { date: '2024-01-08', score: 68 },
  { date: '2024-01-15', score: 72 },
  { date: '2024-01-22', score: 75 },
  { date: '2024-01-29', score: 78 },
];

const StudentDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold text-primary-600">12 days</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Practice Score</p>
              <p className="text-2xl font-bold text-success-600">78%</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <Target className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Hours</p>
              <p className="text-2xl font-bold text-secondary-600">124h</p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full">
              <Clock className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tutor Sessions</p>
              <p className="text-2xl font-bold text-accent-600">8</p>
            </div>
            <div className="p-3 bg-accent-100 rounded-full">
              <Users className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
            <TrendingUp className="w-5 h-5 text-success-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Progress</h2>
          <div className="space-y-4">
            {[
              { subject: 'Biology', progress: 85, color: 'bg-success-500' },
              { subject: 'Chemistry', progress: 72, color: 'bg-primary-500' },
              { subject: 'Physics', progress: 68, color: 'bg-secondary-500' },
              { subject: 'Psychology', progress: 79, color: 'bg-accent-500' },
              { subject: 'CARS', progress: 65, color: 'bg-warning-500' },
            ].map((item) => (
              <div key={item.subject}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.subject}</span>
                  <span className="text-sm text-gray-500">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Study Plan</h2>
        <div className="space-y-3">
          {[
            { task: 'Chemistry Practice Test', time: '9:00 AM - 11:00 AM', status: 'completed' },
            { task: 'Biology Review Session', time: '2:00 PM - 3:30 PM', status: 'current' },
            { task: 'Tutor Session - Physics', time: '4:00 PM - 5:00 PM', status: 'upcoming' },
            { task: 'CARS Practice', time: '7:00 PM - 8:00 PM', status: 'upcoming' },
          ].map((item, index) => (
            <div 
              key={index}
              className={`flex items-center space-x-4 p-3 rounded-lg ${
                item.status === 'completed' 
                  ? 'bg-success-50 border border-success-200' 
                  : item.status === 'current'
                  ? 'bg-primary-50 border border-primary-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                item.status === 'completed' 
                  ? 'bg-success-500' 
                  : item.status === 'current'
                  ? 'bg-primary-500'
                  : 'bg-gray-300'
              }`} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.task}</p>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;