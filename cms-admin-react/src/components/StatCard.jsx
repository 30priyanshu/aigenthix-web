import React from 'react';
import { Layers, CheckCircle, Clock, Star } from 'lucide-react';

export const StatCard = ({ label, value, type }) => {
  const configs = {
    total: { color: 'blue', icon: Layers },
    published: { color: 'green', icon: CheckCircle },
    draft: { color: 'yellow', icon: Clock },
    featured: { color: 'purple', icon: Star },
  };

  const config = configs[type] || configs.total;
  const Icon = config.icon;

  return (
    <div className={`stat-card ${config.color}`}>
      <Icon className="icon" size={24} />
      <div>
        <p className="value">{value}</p>
        <p className="label">{label}</p>
      </div>
    </div>
  );
};

export const StatsContainer = ({ stats }) => {
  return (
    <div className="grid grid-4 gap-md" style={{ marginBottom: '2rem' }}>
      <StatCard type="total" label="Total" value={stats.total || 0} />
      <StatCard type="published" label="Published" value={stats.published || 0} />
      <StatCard type="draft" label="Drafts" value={stats.draft || 0} />
      <StatCard type="featured" label="Featured" value={stats.featured || 0} />
    </div>
  );
};
