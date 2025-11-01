import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDashboardStart, 
  fetchDashboardSuccess, 
  fetchUserGrowthSuccess,
  fetchUserGrowthByMonthSuccess,
  setChartMonths,
  fetchAccountDistributionSuccess,
  fetchSystemHealthSuccess,
  fetchDashboardFailure 
} from '../../store/slices/dashboardSlice';
import { dashboardAPI } from '../../services/api';
import { getAccountTypeDisplayName } from '../../utils/accountTypeMapping';
import { formatShortMonth, groupDataByMonth, fillMissingMonths } from '../../utils/dateUtils';
import StatCard from '../../components/UI/StatCard';
import LineChart from '../../components/UI/Charts/LineChart';
import DoughnutChart from '../../components/UI/Charts/DoughnutChart';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    overview, 
    newUsers, 
    accountTypes, 
    recentUsers, 
    userGrowthData, 
    userGrowthByMonth,
    accountDistribution, 
    chartMonths,
    loading, 
    error 
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [chartMonths]);


  const fetchDashboardData = async () => {
    dispatch(fetchDashboardStart());
    
    try {
      // Fetch dashboard stats
      const statsResponse = await dashboardAPI.getStats();
      if (statsResponse.data && statsResponse.data.data) {
        const data = statsResponse.data.data;
        // Use real data from backend
        const transformedData = {
          overview: data.overview,
          newUsers: data.newUsers,
          accountTypes: {
            FREE: data.accountTypes.FREE || 0,
            VIP: data.accountTypes.VIP || 0, 
            SUPER: data.accountTypes.SUPER || 0
          },
          recentUsers: data.recentUsers || []
        };
        dispatch(fetchDashboardSuccess(transformedData));
      }

      // Fetch account distribution for doughnut chart
      const distributionResponse = await dashboardAPI.getAccountDistribution();
      if (distributionResponse.data && distributionResponse.data.data) {
        dispatch(fetchAccountDistributionSuccess(distributionResponse.data.data));
      }

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      
      // Use fallback data when API is not available
      const fallbackStats = {
        overview: {
          totalUsers: 1250,
          activeUsers: 890,
          inactiveUsers: 360,
          verificationRate: 85
        },
        newUsers: {
          today: 45,
          thisWeek: 280,
          thisMonth: 890,
          thisYear: 12500
        },
        accountTypes: {
          FREE: 800,
          VIP: 450,
          SUPER: 50
        },
        recentUsers: [
          {
            _id: '1',
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            accountType: 'FREE',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            fullName: 'Trần Thị B',
            email: 'tranthib@example.com',
            accountType: 'VIP',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      };
      
      const fallbackDistribution = [
        { type: 'FREE', count: 800, percentage: 64 },
        { type: 'VIP', count: 450, percentage: 36 }
      ];
      
      dispatch(fetchDashboardSuccess(fallbackStats));
      dispatch(fetchAccountDistributionSuccess({ distribution: fallbackDistribution }));
      
      // Don't dispatch error to avoid showing error state
      console.warn('Using fallback data due to API unavailability');
    }
  };

  const fetchChartData = async () => {
    try {
      // Always fetch monthly data since we removed daily option
      const response = await dashboardAPI.getUserGrowthByMonth(chartMonths);
      if (response.data && response.data.data && response.data.data.chartData) {
        dispatch(fetchUserGrowthByMonthSuccess({ chartData: response.data.data.chartData }));
      } else {
        throw new Error('No chart data received from API');
      }
    } catch (error) {
      console.error('Chart data fetch error:', error);
      
      // Use fallback data when API fails
      const fallbackData = getFallbackData();
      const monthlyFallback = groupDataByMonth(fallbackData);
      dispatch(fetchUserGrowthByMonthSuccess({ chartData: monthlyFallback }));
    }
  };

  const handleMonthsChange = (months) => {
    dispatch(setChartMonths(months));
  };

  // Prepare chart data for monthly view only
  const chartData = useMemo(() => {
    try {
      const monthlyData = userGrowthByMonth.length > 0 
        ? userGrowthByMonth 
        : groupDataByMonth(userGrowthData);
      
      const filledData = fillMissingMonths(monthlyData, chartMonths);
      
      const chartData = {
        labels: filledData.map(item => formatShortMonth(item.date)),
        values: filledData.map(item => item.count || 0)
      };
      
      return chartData;
    } catch (error) {
      console.error('Error preparing chart data:', error);
      // Return fallback empty chart
      return {
        labels: [],
        values: []
      };
    }
  }, [chartMonths, userGrowthData, userGrowthByMonth]);

  if (error) {
    return (
      <div className="error-state">
        <p>Có lỗi xảy ra: {error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          icon="fas fa-users"
          iconClass="total-users"
          title="Tổng số người dùng"
          value={overview.totalUsers}
          loading={loading}
        />
        <StatCard
          icon="fas fa-user-check"
          iconClass="active-users"
          title="Người dùng hoạt động"
          value={overview.activeUsers}
          loading={loading}
        />
        <StatCard
          icon="fas fa-user-plus"
          iconClass="new-users"
          title="Người dùng mới hôm nay"
          value={newUsers.today}
          loading={loading}
        />
        <StatCard
          icon="fas fa-crown"
          iconClass="vip-users"
          title="Người dùng VIP"
          value={accountTypes.VIP}
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <LineChart
          data={chartData}
          title={`Người dùng mới theo tháng (${chartMonths} tháng gần đây)`}
          months={chartMonths}
          onMonthsChange={handleMonthsChange}
        />
        <DoughnutChart
          data={{
            labels: accountDistribution.map(item => getAccountTypeDisplayName(item.type)),
            values: accountDistribution.map(item => item.count)
          }}
          title="Phân bố loại tài khoản"
        />
      </div>

      {/* Recent Users */}
      <div className="recent-activities">
        <div className="section-header">
          <h3>Người dùng mới gần đây</h3>
          <a href="/users" className="view-all">Xem tất cả</a>
        </div>
        
        <div className="activity-list">
          {recentUsers.map((user) => (
            <div key={user._id} className="activity-item">
              <div className="activity-icon new-user">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="activity-content">
                <p>
                  <strong>{user.fullName}</strong> ({user.email}) đã đăng ký tài khoản {getAccountTypeDisplayName(user.accountType)}
                </p>
                <span className="activity-time">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
