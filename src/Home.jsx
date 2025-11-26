import StatCard from './Dashboard/StatCard';
import ActivityCard from './Dashboard/ActivityCard';
import QuickActions from './Dashboard/QuickActions';
import GoalProgress from './Dashboard/GoalProgress';
import UpcomingEvents from './Dashboard/UpcomingEvents';
import CompanyNews from './Dashboard/CompanyNews';

const Home = () => {
  return (
      <div className="flex-1 overflow-auto">
        <main className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Available PTO" value="18.5" subtitle="days remaining" icon="calendar" />
            <StatCard title="Hours This Week" value="32.5" subtitle="of 40 hours" icon="clock" />
            <StatCard title="Performance Score" value="4.2" subtitle="out of 5.0" icon="trending-up" />
            <StatCard title="Next Paycheck" value="$3,250" subtitle="in 5 days" icon="dollar-sign" />
          </div>

          {/* Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left side (2/3 width) */}
           <div className="lg:col-span-2 space-y-4">
            <ActivityCard />
            <GoalProgress />
           </div>

          {/* Right side (1/3 width) - STACKED CARDS */}
           <div className="flex flex-col gap-4">
            <QuickActions />
            <UpcomingEvents />
            <CompanyNews />
           </div>
         </div>
        </main>
      </div>


  );
};

export default Home;
