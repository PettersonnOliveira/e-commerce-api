export default function StatCard({ title, value, icon, description, highlight }) {
  return (
    <div className={`admin-stat-card ${highlight ? 'highlight' : ''}`}>
      <div className="admin-stat-header">
        <span className="admin-stat-title">{title}</span>
        <span className="admin-stat-icon">{icon}</span>
      </div>
      <div className="admin-stat-value">{value}</div>
      {description && <div className="admin-stat-desc">{description}</div>}
    </div>
  )
}
