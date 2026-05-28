type AdminStatsProps = {
  totalBookings: number;
  totalResources: number;
  totalUsers: number;
  todayBookings: number;
};

export default function AdminStats({
  totalBookings,
  totalResources,
  totalUsers,
  todayBookings,
}: AdminStatsProps) {
  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      sub: "All booking records",
      dark: false,
    },
    {
      label: "Total Resources",
      value: totalResources,
      sub: "Available facilities",
      dark: false,
    },
    {
      label: "Total Users",
      value: totalUsers,
      sub: "Registered accounts",
      dark: false,
    },
    {
      label: "Today's Bookings",
      value: todayBookings,
      sub: "Scheduled for today",
      dark: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border border-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl ${
            stat.dark ? "bg-slate-950 text-white" : "bg-white/80"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              stat.dark ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {stat.label}
          </p>

          <p
            className={`mt-3 text-3xl font-bold ${
              stat.dark ? "text-white" : "text-slate-950"
            }`}
          >
            {stat.value}
          </p>

          <p
            className={`mt-1 text-sm ${
              stat.dark ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {stat.sub}
          </p>
        </div>
      ))}
    </div>
  );
}