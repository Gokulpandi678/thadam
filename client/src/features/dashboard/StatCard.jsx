import React from "react";
import { Users, Building2, Calendar, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ── Trend badge ───────────────────────────────────────────────────────────────
const TrendBadge = ({ trend, percent }) => {
  if (trend === "same" || percent == null) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
        <Minus size={11} /> same
      </span>
    );
  }

  const isUp = trend === "up";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
        ${isUp ? "text-green-600 bg-green-100" : "text-red-500 bg-red-100"}`}
    >
      {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {isUp ? "+" : "-"}{percent}%
    </span>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const StatCard = ({ stats }) => {
  const statsData = [
    {
      title: "Contacts",
      stat: stats.totalContacts,
      icon: <Users size={20} />,
      iconBg: "bg-blue-100 text-blue-600",
      description: "vs last month"
    },
    {
      title: "Companies",
      stat: stats.differentCompanies,
      icon: <Building2 size={20} />,
      iconBg: "bg-purple-100 text-purple-600",
      description: "different companies"
    },
    {
      title: "Meetings this month",
      stat: stats.meetingsThisMonth,
      icon: <Calendar size={20} />,
      iconBg: "bg-green-100 text-green-600",
      description: "vs last month"
    },
    {
      title: "Total meetings",
      stat: stats.totalLogs,
      icon: <Activity size={20} />,
      iconBg: "bg-orange-100 text-orange-600",
      description: "all time"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {statsData.map((item, i) => {
    const { stat, title, icon } = item;
    const { value = 0, percent = null, trend = "same" } = stat ?? {};

    return (
      <div
        key={i}
        className="flex items-center gap-4 bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
      >
        <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
          {icon}
        </div>

        <div className="flex flex-col flex-1">
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold">{value.toLocaleString()}</h2>
        </div>

        <TrendBadge trend={trend} percent={percent} />
      </div>
    );
  })}
</div>
  );
};

export default StatCard;