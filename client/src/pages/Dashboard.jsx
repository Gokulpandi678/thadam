import Header from "../ui/molecules/header/Header";
import { DonutChart, StatCard, MetricsCard } from "../features/dashboard/components";
import { useGetDashboardData } from "../service/useDashboardApi";

const Dashboard = () => {
  const { data, isError, isLoading } = useGetDashboardData();
  const vm = data?.data?.result ?? null;

  return (
    <div className="flex flex-col gap-3">
      <Header
        title="Dashboard"
        description="Track the entire relationship journey with your contacts."
      />

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading dashboard</div>}
      {!isLoading && !isError && !vm && <div>No data available</div>}

      {!isLoading && !isError && vm && (
        <>
          <StatCard stats={vm.stats} />

          <div className="flex gap-5">
            <div className="flex-1">
              <DonutChart data={vm?.distributions?.byCity ?? []} name="Cities" />
            </div>
            <div className="flex-1">
              <DonutChart data={vm?.distributions?.byRole ?? []} name="Roles" />
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-1">
              <MetricsCard data={vm?.recentContacts ?? []} name="Recent Contacts" />
            </div>
            <div className="flex-1">
              <MetricsCard data={vm?.mostEngaged ?? []} name="Most Engaged By Meeting" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
