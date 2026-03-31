import PlayerStats from '../components/dashboard/PlayerStats';
import XPBar from '../components/dashboard/XPBar';
import ActiveQuests from '../components/dashboard/ActiveQuests';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import UpcomingQuests from '../components/dashboard/UpcomingQuests';

export default function Dashboard() {
  return (
    <div>
      <PlayerStats />
      <XPBar />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveQuests />
        <WeeklyChart />
      </div>
      <UpcomingQuests />
    </div>
  );
}
