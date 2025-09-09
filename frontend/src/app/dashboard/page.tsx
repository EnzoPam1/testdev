// frontend/src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, Eye, Activity, Download, RefreshCw, 
  Calendar, Target, FileText, ChevronRight 
} from 'lucide-react';
import { useMe } from "@/lib/useMe";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Dashboard() {
  const { user } = useMe();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const [statsRes, projectsRes] = await Promise.all([
        fetch(`${API}/public/stats`),
        fetch(`${API}/public/projects?limit=5`)
      ]);
      
      const statsData = await statsRes.json();
      const projectsData = await projectsRes.json();
      
      setStats(statsData);
      setProjects(projectsData.items || projectsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback demo data
      setStats({
        users: 1247,
        projects: 89,
        engagement: 73,
        last7Projects: 12,
        generatedAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Données pour les graphiques
  const monthlyData = [
    { month: 'Jan', startups: 45, projects: 23, investment: 1200 },
    { month: 'Feb', startups: 52, projects: 28, investment: 1500 },
    { month: 'Mar', startups: 61, projects: 35, investment: 1800 },
    { month: 'Apr', startups: 68, projects: 42, investment: 2100 },
    { month: 'May', startups: 74, projects: 48, investment: 2400 },
    { month: 'Jun', startups: 82, projects: 56, investment: 2800 },
    { month: 'Jul', startups: 89, projects: 63, investment: 3200 }
  ];

  const sectorData = [
    { name: 'FinTech', value: 28, color: '#F18585' },
    { name: 'HealthTech', value: 22, color: '#F49C9C' },
    { name: 'AI/ML', value: 18, color: '#F6AEAE' },
    { name: 'GreenTech', value: 15, color: '#F8CACF' },
    { name: 'EdTech', value: 10, color: '#EED5FB' },
    { name: 'Other', value: 7, color: '#E4BEF8' }
  ];

  const maturityData = [
    { stage: 'Ideation', count: 23, percentage: 26 },
    { stage: 'MVP', count: 34, percentage: 38 },
    { stage: 'Growth', count: 25, percentage: 28 },
    { stage: 'Scale', count: 7, percentage: 8 }
  ];

  const handleExportPDF = async () => {
    const dashboard = document.getElementById('dashboard-content');
    if (!dashboard) return;

    try {
      const canvas = await html2canvas(dashboard, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Page de garde
      pdf.setFontSize(24);
      pdf.text('JEB Incubator', pdfWidth / 2, 15, { align: 'center' });
      pdf.setFontSize(16);
      pdf.text('Dashboard Report', pdfWidth / 2, 25, { align: 'center' });
      
      // Ajout du dashboard
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Nouvelle page pour les stats détaillées
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.text('Key Performance Indicators', 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Total Users: ${stats?.users || 0}`, 20, 35);
      pdf.text(`Total Projects: ${stats?.projects || 0}`, 20, 45);
      pdf.text(`Engagement Rate: ${stats?.engagement || 0}%`, 20, 55);
      pdf.text(`New Projects (7 days): ${stats?.last7Projects || 0}`, 20, 65);
      
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 85);
      
      pdf.save('jeb-dashboard-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="container" style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="text-center">
          <div className="loader" style={{ marginBottom: 16 }}></div>
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div id="dashboard-content">
        {/* Header */}
        <div className="dashboard-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 32
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontFamily: 'var(--font-montserrat)',
              marginBottom: 8,
              background: 'linear-gradient(90deg, var(--rose-200), var(--vio-400))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Dashboard
            </h1>
            <p style={{ opacity: 0.8 }}>Real-time analytics and performance metrics</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="button button--ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleExportPDF}
              className="button"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                background: 'linear-gradient(90deg, var(--rose-200), var(--vio-400))'
              }}
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20,
          marginBottom: 32
        }}>
          <div className="stat-card card">
            <div className="stat-header">
              <Users className="stat-icon" style={{ color: 'var(--rose-200)' }} />
              <span className="stat-trend">+15% this month</span>
            </div>
            <div className="stat-value">{stats?.users || 0}</div>
            <div className="stat-label">Active Users</div>
          </div>

          <div className="stat-card card">
            <div className="stat-header">
              <Target className="stat-icon" style={{ color: 'var(--vio-400)' }} />
              <span className="stat-trend">+{stats?.last7Projects || 0} this week</span>
            </div>
            <div className="stat-value">{stats?.projects || 0}</div>
            <div className="stat-label">Total Projects</div>
          </div>

          <div className="stat-card card">
            <div className="stat-header">
              <Activity className="stat-icon" style={{ color: '#4ade80' }} />
              <span className="stat-trend positive">High activity</span>
            </div>
            <div className="stat-value">{stats?.engagement || 0}%</div>
            <div className="stat-label">Engagement Rate</div>
          </div>

          <div className="stat-card card">
            <div className="stat-header">
              <Eye className="stat-icon" style={{ color: '#fbbf24' }} />
              <span className="stat-trend">Real-time</span>
            </div>
            <div className="stat-value">24.5K</div>
            <div className="stat-label">Monthly Views</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: 20,
          marginBottom: 32
        }}>
          {/* Growth Chart */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 20 }}>Growth Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="startups" 
                  stroke="#F18585" 
                  strokeWidth={2} 
                  dot={{ fill: '#F18585' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="projects" 
                  stroke="#D5A8F2" 
                  strokeWidth={2} 
                  dot={{ fill: '#D5A8F2' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Distribution */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 20 }}>Sector Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maturity Stages */}
        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <h3 style={{ marginBottom: 20 }}>Project Maturity Stages</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={maturityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="stage" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px' 
                }}
              />
              <Bar dataKey="count" fill="#CB90F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Projects */}
        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <h3 style={{ marginBottom: 20 }}>Top Projects</h3>
          <div className="projects-list">
            {projects.slice(0, 5).map((project, idx) => (
              <div 
                key={project.id} 
                className="project-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ 
                    fontSize: 18, 
                    fontWeight: 'bold',
                    color: 'var(--vio-400)'
                  }}>
                    #{idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{project.name}</div>
                    <div style={{ fontSize: 14, opacity: 0.7 }}>
                      {project.status || 'Active'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} style={{ opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Recent Activity</h3>
          <div className="activity-feed">
            <div className="activity-item">
              <div className="activity-dot" style={{ background: '#4ade80' }}></div>
              <div className="activity-content">
                <span>New startup registered: TechVision AI</span>
                <span className="activity-time">2 mins ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot" style={{ background: '#60a5fa' }}></div>
              <div className="activity-content">
                <span>Project update: GreenEnergy Solutions reached MVP</span>
                <span className="activity-time">15 mins ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot" style={{ background: '#a78bfa' }}></div>
              <div className="activity-content">
                <span>Investor connected with FinFlow startup</span>
                <span className="activity-time">1 hour ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot" style={{ background: '#f472b6' }}></div>
              <div className="activity-content">
                <span>New funding opportunity posted</span>
                <span className="activity-time">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: 40,
        opacity: 0.6,
        fontSize: 14
      }}>
        Last updated: {stats?.generatedAt ? new Date(stats.generatedAt).toLocaleString() : 'N/A'}
      </div>

      <style jsx>{`
        .loader {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255,255,255,0.1);
          border-top-color: var(--vio-400);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        .stat-card {
          padding: 20px;
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          background: rgba(255,255,255,0.04);
          transform: translateY(-2px);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .stat-icon {
          width: 28px;
          height: 28px;
        }

        .stat-trend {
          font-size: 12px;
          opacity: 0.7;
        }

        .stat-trend.positive {
          color: #4ade80;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.7;
        }

        .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .activity-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .activity-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .activity-time {
          font-size: 12px;
          opacity: 0.5;
          flex-shrink: 0;
        }
      `}</style>
    </main>
  );
}