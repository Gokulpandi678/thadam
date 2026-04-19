import React from "react";
import { Users, Building2, Calendar, Activity } from "lucide-react";

const StatCard = ({ stats }) => {

  const statsData = [
    {
      title: "Contacts",
      value: stats.totalContacts,
      icon: <Users size={20} />,
      iconBg: "bg-blue-100 text-blue-600",
      description: "total contacts"
    },
    {
      title: "Companies",
      value: stats.differentCompanies,
      icon: <Building2 size={20} />,
      iconBg: "bg-purple-100 text-purple-600",
      description: "different companies"
    },
    {
      title: "Meetings this month",
      value: stats.meetingsThisMonth,
      icon: <Calendar size={20} />,
      iconBg: "bg-green-100 text-green-600",
      description: "this month"
    },
    {
      title: "Total meetings",
      value: stats.totalLogs,
      icon: <Activity size={20} />,
      iconBg: "bg-orange-100 text-orange-600",
      description: "all time"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {statsData.map((stat, i) => {
        return (
          <div
            key={i}
            className="flex justify-between items-center p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition bg-white"
          >
            <div>
              <div className={`w-11 h-11 flex items-center justify-center rounded-lg ${stat.iconBg}`}>
                {stat.icon}
              </div>
              <p className="text-gray-500 font-semibold mt-4">{stat.title}</p>
            </div>

            <h2 className="text-4xl font-semibold mt-1">
              {stat.value?.toLocaleString() || 0}
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default StatCard;