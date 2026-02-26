import React, { useState, useEffect } from "react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Eye, Heart, MessageCircle, Users, ArrowUp, ArrowDown } from "lucide-react";
import Heading from "../Component/Common/Heading";
import Paragraph from "../Component/Common/Paragraph";
import { getApiUrl } from "../utils/apiConfig";

const DashboardAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      if (!token || !user) {
        console.error("Authentication required");
        setLoading(false);
        return;
      }

      // Using mock data for analytics (user analytics endpoint can be added later)
      // For now, display sample analytics data
      setStats({
        views: 12500,
        likes: 3200,
        comments: 892,
        followers: 1200
      });
    } finally {
      setLoading(false);
    }
  };

  // Sample data for charts
  const chartData = [
    { name: "Mon", views: 400, likes: 240, comments: 120 },
    { name: "Tue", views: 600, likes: 321, comments: 150 },
    { name: "Wed", views: 550, likes: 290, comments: 130 },
    { name: "Thu", views: 750, likes: 420, comments: 200 },
    { name: "Fri", views: 900, likes: 580, comments: 250 },
    { name: "Sat", views: 1200, likes: 750, comments: 380 },
    { name: "Sun", views: 1100, likes: 690, comments: 350 }
  ];

  const engagementData = [
    { name: "Views", value: 3800, color: "var(--color-primary)" },
    { name: "Likes", value: 2400, color: "var(--color-secondary)" },
    { name: "Comments", value: 1200, color: "var(--color-accent)" }
  ];

  // Stat Card Component
  const StatCard = ({ icon: Icon, label, value, change, isPositive }) => (
    <div className="bg-surface-primary dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <Icon className="text-primary" size={24} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isPositive ? 'bg-success/10' : 'bg-error/10'}`}>
          {isPositive ? (
            <ArrowUp className="text-success" size={16} />
          ) : (
            <ArrowDown className="text-error" size={16} />
          )}
          <span className={`text-xs font-bold ${isPositive ? 'text-success' : 'text-error'}`}>
            {change}%
          </span>
        </div>
      </div>
      <p className="text-3xl font-bold text-text-primary dark:text-text-inverse mb-2">{value}</p>
      <p className="text-sm text-text-secondary dark:text-text-secondary">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-primary dark:bg-surface-dark px-6 py-14">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-primary rounded-2xl shadow-lg text-on-primary">
              <TrendingUp className="w-8 h-8 text-on-primary" />
            </div>
            <div>
              <Heading type="h1" className="text-4xl font-bold text-text-primary dark:text-text-inverse">
                Analytics Dashboard
              </Heading>
              <Paragraph variant="muted" className="text-text-secondary dark:text-text-secondary">
                Track your blog performance and engagement metrics
              </Paragraph>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {[
              { label: "7D", value: "7d" },
              { label: "30D", value: "30d" },
              { label: "90D", value: "90d" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === option.value
                    ? "bg-primary hover:bg-primary-dark text-on-primary shadow-lg"
                    : "border-2 border-border-default dark:border-border-dark text-text-primary dark:text-text-inverse hover:border-primary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Info Banner - Using Mock Data */}
            <div className="mb-6 p-4 bg-info-bg dark:bg-info-bg rounded-lg border border-info/30 dark:border-info/30 flex items-start gap-3">
              <span className="text-info dark:text-info-light font-bold text-lg">ℹ️</span>
              <div>
                <p className="font-semibold text-info dark:text-info-light mb-1">Demo Analytics Dashboard</p>
                <p className="text-sm text-info/80 dark:text-info-light/80">Currently displaying sample data. Once you implement the backend analytics endpoint at <code className="bg-info/10 px-2 py-1 rounded text-xs">/api/analytics</code>, live metrics will appear here.</p>
              </div>
            </div>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Eye} label="Total Views" value={stats?.views || "12.5K"} change="18" isPositive={true} />
              <StatCard icon={Heart} label="Total Likes" value={stats?.likes || "3.2K"} change="12" isPositive={true} />
              <StatCard icon={MessageCircle} label="Comments" value={stats?.comments || "892"} change="5" isPositive={true} />
              <StatCard icon={Users} label="Followers" value={stats?.followers || "1.2K"} change="8" isPositive={true} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Views & Engagement Chart */}
              <div className="lg:col-span-2 bg-surface-primary dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-md">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-text-primary dark:text-text-inverse mb-2">
                    Weekly Performance
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-text-secondary">
                    Views, likes, and comments over the past 7 days
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
                    <XAxis stroke="var(--color-text-secondary)" />
                    <YAxis stroke="var(--color-text-secondary)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "var(--color-surface-primary)",
                        border: "1px solid var(--color-border-default)",
                        borderRadius: "8px"
                      }}
                      labelStyle={{ color: "var(--color-text-primary)" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: "var(--color-primary)", r: 5 }} />
                    <Line type="monotone" dataKey="likes" stroke="var(--color-secondary)" strokeWidth={2} dot={{ fill: "var(--color-secondary)", r: 5 }} />
                    <Line type="monotone" dataKey="comments" stroke="var(--color-accent)" strokeWidth={2} dot={{ fill: "var(--color-accent)", r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Pie Chart */}
              <div className="bg-surface-primary dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-md">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-text-primary dark:text-text-inverse mb-2">
                    Engagement Mix
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-text-secondary">
                    Distribution of interactions
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-3">
                  {engagementData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-semibold text-text-secondary dark:text-text-secondary">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-text-primary dark:text-text-inverse">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Articles Section */}
            <div className="bg-surface-primary dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-md">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-text-primary dark:text-text-inverse mb-2">
                  Top Performing Articles
                </h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary">
                  Your best articles based on views and engagement
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-light dark:border-border-dark">
                      <th className="px-4 py-3 text-left font-bold text-text-primary dark:text-text-inverse">Article Title</th>
                      <th className="px-4 py-3 text-center font-bold text-text-primary dark:text-text-inverse">Views</th>
                      <th className="px-4 py-3 text-center font-bold text-text-primary dark:text-text-inverse">Likes</th>
                      <th className="px-4 py-3 text-center font-bold text-text-primary dark:text-text-inverse">Comments</th>
                      <th className="px-4 py-3 text-center font-bold text-text-primary dark:text-text-inverse">Engagement %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { title: "Getting Started with React", views: 1250, likes: 342, comments: 89, engagement: 34.4 },
                      { title: "Web Design Best Practices", views: 980, likes: 278, comments: 72, engagement: 35.6 },
                      { title: "JavaScript Tips and Tricks", views: 850, likes: 215, comments: 54, engagement: 31.6 },
                      { title: "CSS Grid Layout Guide", views: 720, likes: 198, comments: 48, engagement: 34.2 },
                      { title: "Firebase Authentication", views: 620, likes: 156, comments: 41, engagement: 31.5 }
                    ].map((article, idx) => (
                      <tr key={idx} className="border-b border-border-light dark:border-border-dark hover:bg-surface-secondary dark:hover:bg-neutral-800 transition-colors">
                        <td className="px-4 py-4 font-semibold text-text-primary dark:text-text-inverse">{article.title}</td>
                        <td className="px-4 py-4 text-center text-text-secondary dark:text-text-secondary">{article.views}</td>
                        <td className="px-4 py-4 text-center text-text-secondary dark:text-text-secondary">{article.likes}</td>
                        <td className="px-4 py-4 text-center text-text-secondary dark:text-text-secondary">{article.comments}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-success/10 text-success font-bold rounded-full text-sm">
                            <ArrowUp size={14} />
                            {article.engagement}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalytics;
