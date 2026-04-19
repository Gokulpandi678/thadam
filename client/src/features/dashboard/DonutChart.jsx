import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
  "#EC4899",
  "#6366F1"
];

const DonutChart = ({ data, name }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-white rounded-xl shadow-xl p-6 flex-1">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  data = data.filter(item => item.type)

  const totalCount = data.reduce((sum, item) => sum + (item.count || 0), 0);

  const getLegendConfig = (count) => {
    if (count <= 6) 
      return { 
        cols: 1, 
        dotSize: 9,
        maxShow: count 
      };
    if (count <= 11) 
      return { 
        cols: 2,  
        dotSize: 8,
        maxShow: count 
      };
    return { cols: 2, dotSize: 7, maxShow: 8 };
  };

  const { cols, dotSize, maxShow } = getLegendConfig(data.length);
  const visible = data.slice(0, maxShow);
  const othersCount = data.slice(maxShow).reduce((s, i) => s + (i.count || 0), 0);
  const othersData = data.slice(maxShow);

  return (
    <div className="flex items-center bg-white rounded-xl shadow-xl p-6 flex-1">
      <div className="w-1/2 relative" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={1}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ height: 200 }}>
          <p className="text-3xl font-bold">{totalCount}</p>
          <p className="text-sm text-gray-500">{name}</p>
        </div>
      </div>

      <div className="flex-1">
        <div
          className="grid gap-y-1.5 gap-x-5"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {visible.map((item, i) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span
                  className="rounded-full"
                  style={{
                    width: dotSize,
                    height: dotSize,
                    backgroundColor: COLORS[i % COLORS.length],
                  }}
                />
                <span className="text-sm">{item.type}</span>
              </div>
              <span className="text-sm font-medium">{item.count}</span>
            </div>
          ))}
        </div>

        {othersCount > 0 && (
          <div className="flex justify-between pt-1 mt-1 border-t">
            <div className="flex flex-col">
              {othersData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-gray-500">
                  <span>{item.type}</span>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;