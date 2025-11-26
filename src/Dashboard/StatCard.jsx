import { Calendar, Clock, TrendingUp, DollarSign } from "lucide-react";

const icons = {
  calendar: Calendar,
  clock: Clock,
  "trending-up": TrendingUp,
  "dollar-sign": DollarSign,
};

const StatCard = ({ title, value, subtitle, icon }) => {
  const Icon = icons[icon];
  return (
    <div className="bg-white p-4 rounded-md border shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;
