import { Users, Building2, Calendar, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

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
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        isUp ? "text-green-600 bg-green-100" : "text-red-500 bg-red-100"
      }`}
    >
      {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {isUp ? "+" : "-"}
      {percent}%
    </span>
  );
};

const STAT_DEFINITIONS = [
  {
    key: "totalContacts",
    title: "Contacts",
    icon: <Users size={20} />,
    iconBg: "bg-blue-100 text-blue-600",
    description: "30D Trend"
  },
  {
    key: "differentCompanies",
    title: "Companies",
    icon: <Building2 size={20} />,
    iconBg: "bg-purple-100 text-purple-600",
    description: "30D Trend"
  },
  {
    key: "meetingsThisMonth",
    title: "Meetings this month",
    icon: <Calendar size={20} />,
    iconBg: "bg-green-100 text-green-600",
    description: "30D Trend"
  },
  {
    key: "totalLogs",
    title: "Total meetings",
    icon: <Activity size={20} />,
    iconBg: "bg-orange-100 text-orange-600",
    description: "Life Time Trend"
  },
];

const StatCard = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {STAT_DEFINITIONS.map(({ key, title, icon, iconBg, description }) => {
      const { value = 0, percent = null, trend = "same", } = stats[key] ?? {};
      return (
        <div
          key={key}
          className="flex items-center gap-4 bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
        >
          <div className={`p-3 rounded-lg ${iconBg}`}>{icon}</div>
          <div className="flex flex-col flex-1">
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="text-2xl font-bold">{value.toLocaleString()}</h2>
          </div>
          <div className="flex flex-col items-center gap-1">
            <TrendBadge trend={trend} percent={percent} />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      );
    })}
  </div>
);

export default StatCard;
