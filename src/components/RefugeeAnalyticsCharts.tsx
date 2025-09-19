import React from 'react';
import { RefugeeTicket } from '../types/hospital';
import './RefugeeAnalyticsCharts.css';

interface RefugeeAnalyticsChartsProps {
  tickets: RefugeeTicket[];
}

interface ChartData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export const RefugeeAnalyticsCharts: React.FC<RefugeeAnalyticsChartsProps> = ({ tickets }) => {
  const generateEmergencyTypeData = (): ChartData[] => {
    const types = tickets.reduce((acc, ticket) => {
      const type = ticket.emergency.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = tickets.length;
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#17a2b8', '#6f42c1'];
    
    return Object.entries(types).map(([label, value], index) => ({
      label: label.replace('_', ' ').toUpperCase(),
      value,
      percentage: Math.round((value / total) * 100),
      color: colors[index % colors.length]
    }));
  };

  const generateSeverityData = (): ChartData[] => {
    const severities = tickets.reduce((acc, ticket) => {
      const severity = ticket.emergency.severity;
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = tickets.length;
    const colors = {
      critical: '#dc3545',
      high: '#fd7e14',
      medium: '#ffc107',
      low: '#28a745'
    };
    
    return Object.entries(severities).map(([label, value]) => ({
      label: label.toUpperCase(),
      value,
      percentage: Math.round((value / total) * 100),
      color: colors[label as keyof typeof colors] || '#6c757d'
    }));
  };

  const generateEthnicData = (): ChartData[] => {
    const ethnicGroups = tickets.reduce((acc, ticket) => {
      const ethnic = ticket.refugeeInfo.ethnicGroup;
      acc[ethnic] = (acc[ethnic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = tickets.length;
    const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'];
    
    return Object.entries(ethnicGroups)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([label, value], index) => ({
        label,
        value,
        percentage: Math.round((value / total) * 100),
        color: colors[index]
      }));
  };

  const generateStatusData = (): ChartData[] => {
    const statuses = tickets.reduce((acc, ticket) => {
      const status = ticket.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = tickets.length;
    const colors = {
      open: '#dc3545',
      assigned: '#fd7e14',
      in_progress: '#ffc107',
      resolved: '#28a745',
      closed: '#6c757d'
    };
    
    return Object.entries(statuses).map(([label, value]) => ({
      label: label.replace('_', ' ').toUpperCase(),
      value,
      percentage: Math.round((value / total) * 100),
      color: colors[label as keyof typeof colors] || '#6c757d'
    }));
  };

  const renderBarChart = (data: ChartData[], title: string) => (
    <div className="chart-container">
      <h4 className="chart-title">{title}</h4>
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={index} className="bar-item">
            <div className="bar-label">
              <span className="label-text">{item.label}</span>
              <span className="label-value">{item.value} ({item.percentage}%)</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar-fill"
                style={{ 
                  width: `${item.percentage}%`, 
                  backgroundColor: item.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDonutChart = (data: ChartData[], title: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let accumulatedPercentage = 0;

    return (
      <div className="chart-container">
        <h4 className="chart-title">{title}</h4>
        <div className="donut-chart-wrapper">
          <div className="donut-chart">
            <svg viewBox="0 0 100 100" className="donut-svg">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -accumulatedPercentage;
                accumulatedPercentage += percentage;
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 50 50)"
                    className="donut-segment"
                  />
                );
              })}
            </svg>
            <div className="donut-center">
              <div className="donut-total">{total}</div>
              <div className="donut-label">Total Cases</div>
            </div>
          </div>
          <div className="donut-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="legend-text">
                  {item.label} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMetricsGrid = () => {
    const metrics = [
      {
        label: 'Total Cases',
        value: tickets.length,
        trend: '+12%',
        color: '#007bff'
      },
      {
        label: 'Critical Cases',
        value: tickets.filter(t => t.emergency.severity === 'critical').length,
        trend: '-8%',
        color: '#dc3545'
      },
      {
        label: 'Resolved Today',
        value: tickets.filter(t => t.status === 'resolved').length,
        trend: '+15%',
        color: '#28a745'
      },
      {
        label: 'Avg Response Time',
        value: '23 min',
        trend: '-5%',
        color: '#ffc107'
      }
    ];

    return (
      <div className="metrics-overview">
        <h4 className="chart-title">Key Performance Metrics</h4>
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <div className="metric-value" style={{ color: metric.color }}>
                  {metric.value}
                </div>
                <div className={`metric-trend ${metric.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  {metric.trend}
                </div>
              </div>
              <div className="metric-label">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTimelineChart = () => {
    // Group tickets by creation date (simplified for demo)
    const today = new Date();
    const timelineData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayTickets = tickets.filter(t => {
        const ticketDate = new Date(t.createdAt);
        return ticketDate.toDateString() === date.toDateString();
      });
      
      timelineData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayTickets.length
      });
    }

    const maxCount = Math.max(...timelineData.map(d => d.count));

    return (
      <div className="chart-container">
        <h4 className="chart-title">Daily Case Volume (Last 7 Days)</h4>
        <div className="timeline-chart">
          {timelineData.map((day, index) => (
            <div key={index} className="timeline-bar">
              <div 
                className="timeline-fill"
                style={{ 
                  height: `${(day.count / (maxCount || 1)) * 100}%`,
                  backgroundColor: day.count > maxCount * 0.7 ? '#dc3545' : '#007bff'
                }}
              />
              <div className="timeline-value">{day.count}</div>
              <div className="timeline-label">{day.date}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (tickets.length === 0) {
    return (
      <div className="analytics-charts">
        <div className="no-data">
          <h3>No Data Available</h3>
          <p>Charts will appear once emergency tickets are submitted</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-charts">
      {renderMetricsGrid()}
      
      <div className="charts-grid">
        {renderDonutChart(generateSeverityData(), 'Emergency Severity Distribution')}
        {renderBarChart(generateEmergencyTypeData(), 'Emergency Types')}
        {renderBarChart(generateEthnicData(), 'Refugee Population by Ethnicity')}
        {renderBarChart(generateStatusData(), 'Case Status Distribution')}
      </div>
      
      <div className="charts-row">
        {renderTimelineChart()}
      </div>
    </div>
  );
};