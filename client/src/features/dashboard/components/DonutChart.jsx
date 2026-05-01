import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B",
  "#EF4444", "#06B6D4", "#84CC16", "#EC4899", "#6366F1",
];

const getLegendConfig = (count) => {
  if (count <= 6) return { cols: 1, dotSize: 9, maxShow: count };
  if (count <= 11) return { cols: 2, dotSize: 8, maxShow: count };
  return { cols: 2, dotSize: 7, maxShow: 8 };
};

const DonutChart = ({ data, name }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-white rounded-xl shadow-xl p-6 flex-1">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const filteredData = data.filter((item) => item.type);
  const totalCount = filteredData.reduce((sum, item) => sum + (item.count || 0), 0);

  const { cols, dotSize, maxShow } = getLegendConfig(filteredData.length);
  const visible = filteredData.slice(0, maxShow);
  const othersData = filteredData.slice(maxShow);
  const othersCount = othersData.reduce((s, i) => s + (i.count || 0), 0);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-xl p-4 flex-1 lg:flex-row lg:items-center lg:p-6">

      {/* Chart wrapper — 150px on mobile, 200px on desktop */}
      <div className="relative mx-auto lg:mx-0 lg:w-1/2 w-[150px] h-[150px] lg:w-[200px] lg:h-[200px]">

        {/* Mobile chart */}
        <div className="lg:hidden w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={filteredData} dataKey="count" nameKey="type" innerRadius={35} outerRadius={65} paddingAngle={1}>
                {filteredData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xl font-bold">{totalCount}</p>
            <p className="text-xs text-gray-500">{name}</p>
          </div>
        </div>

        {/* Desktop chart */}
        <div className="hidden lg:block w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={filteredData} dataKey="count" nameKey="type" innerRadius={50} outerRadius={90} paddingAngle={1}>
                {filteredData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-bold">{totalCount}</p>
            <p className="text-sm text-gray-500">{name}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 lg:mt-0 lg:flex-1">
        <div
          className="grid gap-y-1.5 gap-x-3 lg:gap-x-5"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {visible.map((item, i) => (
            <div key={item.type} className="flex items-center justify-between min-w-0">
              <div className="flex items-center gap-1 min-w-0">
                <span
                  className="shrink-0 rounded-full"
                  style={{ width: dotSize, height: dotSize, backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs lg:text-sm truncate">{item.type}</span>
              </div>
              <span className="text-xs lg:text-sm font-medium ml-1">{item.count}</span>
            </div>
          ))}
        </div>

        {othersCount > 0 && (
          <div className="pt-1 mt-1 border-t">
            {othersData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.type}</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
