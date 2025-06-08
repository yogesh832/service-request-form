import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomBar = (props) => {
  const { fill, x, y, width, height } = props;
  
  return (
    <g>
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        rx="6" 
        ry="6" 
        fill={fill}
      />
    </g>
  );
};

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">{payload[0].value} tickets</p>
      </div>
    );
  }
  return null;
};

const BarChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <Tooltip content={<ChartTooltip />} />
        <Bar 
          dataKey="value" 
          fill="#4f46e5" 
          shape={<CustomBar />} 
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;