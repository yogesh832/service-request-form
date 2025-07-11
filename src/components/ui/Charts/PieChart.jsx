import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#3B82F6", "#F59E0B", "#10B981"];

const renderCustomizedLabel = ({ name, percent }) =>
  `${name}: ${(percent * 100).toFixed(0)}%`;

const CustomLegend = ({ payload }) => (
  <ul className="text-sm ml-4">
    {payload.map((entry, index) => (
      <li key={`item-${index}`} style={{ color: entry.color }}>
        {`${entry.value}`}
      </li>
    ))}
  </ul>
);

const CustomPieChart = ({ data }) => {
  return (
    <div className="flex items-center justify-between flex-wrap md:flex-nowrap">
      {/* Chart Container */}
      <div className="w-[150%] md:w-2/3 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="w-full md:w-1/3 mt-4 md:mt-0">
        <CustomLegend
          payload={data.map((d, i) => ({
            value: `${d.name}: ${d.value}`,
            color: COLORS[i % COLORS.length],
          }))}
        />
      </div>
    </div>
  );
};

export default CustomPieChart;
