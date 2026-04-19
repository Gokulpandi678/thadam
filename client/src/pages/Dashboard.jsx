import React from 'react';
import DonutChart from '../features/dashboard/DonutChart';
import Header from '../ui/molecules/header/Header';
import StatCard from '../features/dashboard/StatCard';
import { useGetDashboardData } from '../service/useDashboardApi';
import MetricsCard from '../features/dashboard/MetricsCard';

const Dashboard = () => {
    const { data, isError, isLoading } = useGetDashboardData();
    // const vm = useDashboardViewModel(data?.data?.result || null);
    const vm = data?.data?.result ?? null;
    console.log("ViewModel:", vm);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading dashboard</div>;
    if (!vm) return <div>No data available</div>;

    return (
        <div className="flex flex-col gap-3">
            <Header title="Dashboard" description="Track the entire relationship journey with your contacts." />
            <StatCard stats={vm.stats} />

            <div className='flex gap-5'>
                <div className="flex-1">
                    <DonutChart data={vm?.distributions?.byCity ?? []} name="Cities" />
                </div>
                <div className="flex-1">
                    <DonutChart data={vm?.distributions?.byRole ?? []} name="Roles" />
                </div>
            </div>

            {/* Optional: Add Recent Contacts and Most Engaged sections */}
            <div className='flex gap-5'>
                <div className="flex-1">
                    <MetricsCard
                        data={vm?.recentContacts ?? []}
                        name="Recent Contacts"
                    />
                </div>
                <div className="flex-1">
                    <MetricsCard
                        data={vm?.mostEngaged ?? []}
                        name="Most Engaged By Meeting"
                    />                
                </div>
            </div>
        </div>
    );
};

export default Dashboard;