import Header from "../ui/molecules/header/Header";
import { DonutChart, StatCard, MetricsCard } from "../features/dashboard/components";
import { useGetDashboardData } from "../service/useDashboardApi";

const Dashboard = () => {
  const { data, isError, isLoading } = useGetDashboardData();
  const vm = data?.data?.result ?? null;

  return (
    <div className="flex flex-col gap-4">

      <Header
        title="Dashboard"
        description="Track the entire relationship journey with your contacts."
      />

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading dashboard</div>}
      {!isLoading && !isError && !vm && <div>No data available</div>}

      {!isLoading && !isError && vm && (
        <>
          {/* Stats */}
          <StatCard stats={vm.stats} />

          {/* Donut Charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            <DonutChart
              data={vm?.distributions?.byCity ?? []}
              name="Cities"
            />

            <DonutChart
              data={vm?.distributions?.byRole ?? []}
              name="Roles"
            />

          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            <MetricsCard
              data={vm?.recentContacts ?? []}
              name="Recent Contacts"
            />

            <MetricsCard
              data={vm?.mostEngaged ?? []}
              name="Most Engaged By Meeting"
            />

          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;