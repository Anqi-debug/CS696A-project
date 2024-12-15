import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { ArrowRight, Calendar, Users, Target } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const progress = (project.fundsRaised / project.goalAmount) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {project.campaignName}
          </h3>
          <p className="text-sm text-gray-500 flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {project.creatorId?.name || 'Unknown Creator'}
          </p>
        </div>
        <div className="w-16 h-16">
          <CircularProgressbar
            value={progress}
            text={`${Math.round(progress)}%`}
            styles={buildStyles({
              textSize: '24px',
              pathColor: '#3b82f6',
              textColor: '#1e3a8a',
              trailColor: '#dbeafe',
            })}
          />
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Target className="w-4 h-4 mr-1" />
          Goal: ${project.goalAmount.toLocaleString()}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {project.frequency || 'Monthly'}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-sm">
          <span className="text-blue-600 font-medium">
            ${project.fundsRaised?.toLocaleString() || '0'}
          </span>
          <span className="text-gray-500"> raised</span>
        </div>
        <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
          View Details
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}