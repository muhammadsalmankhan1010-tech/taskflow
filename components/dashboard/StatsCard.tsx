import Card from "../ui/Card";

type StatsCardProps = {
  title: string;
  value: string;
  change: string;
  icon: string;
  positive?: boolean;
};

export default function StatsCard({
  title,
  value,
  change,
  icon,
  positive = true,
}: StatsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <span
          className={`text-sm font-semibold ${
            positive
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {positive ? "↑" : "↓"} {change}
        </span>

        <span className="ml-2 text-sm text-gray-400">
          vs last week
        </span>
      </div>
    </Card>
  );
}