import React from 'react';
import { Users, Calendar, Clock, Star, BookOpen, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockSessionData = [
  { day: 'Mon', sessions: 4 },
  { day: 'Tue', sessions: 3 },
  { day: 'Wed', sessions: 5 },
  { day: 'Thu', sessions: 2 },
  { day: 'Fri', sessions: 6 },
  { day: 'Sat', sessions: 3 },
  { day: 'Sun', sessions: 1 },
];

const TutorDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, Dr. Sarah Chen
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-primary-600">15</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week's Sessions</p>
              <p className="text-2xl font-bold text-success-600">24</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <Calendar className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-warning-600">4.9</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <Star className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-secondary-600">186h</p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full">
              <Clock className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sessions Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Session Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSessionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Student Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Performance Highlights</h2>
          <div className="space-y-4">
            {[
              { name: 'Alex Johnson', subject: 'Chemistry', improvement: '+12%', status: 'excellent' },
              { name: 'Emma Davis', subject: 'Biology', improvement: '+8%', status: 'good' },
              { name: 'Michael Brown', subject: 'Physics', improvement: '+5%', status: 'good' },
              { name: 'Sarah Wilson', subject: 'CARS', improvement: '+15%', status: 'excellent' },
            ].map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    student.status === 'excellent' ? 'text-success-600' : 'text-primary-600'
                  }`}>
                    {student.improvement}
                  </p>
                  <p className="text-xs text-gray-500">this week</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {[
            { student: 'Alex Johnson', subject: 'Chemistry', time: '10:00 AM - 11:00 AM', status: 'upcoming' },
            { student: 'Emma Davis', subject: 'Biology', time: '1:00 PM - 2:00 PM', status: 'current' },
            { student: 'Michael Brown', subject: 'Physics', time: '3:00 PM - 4:00 PM', status: 'upcoming' },
            { student: 'Sarah Wilson', subject: 'CARS', time: '5:00 PM - 6:00 PM', status: 'upcoming' },
          ].map((session, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                session.status === 'current'
                  ? 'bg-primary-50 border-primary-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {session.student.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.student}</p>
                  <p className="text-sm text-gray-500">{session.subject} • {session.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <BookOpen className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;