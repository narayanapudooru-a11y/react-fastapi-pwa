import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  return (
    <section className="dashboard-page">
      <p className="dashboard-eyebrow">YOUR WORKSPACE</p>
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back. Ready to make progress?</p>
        </div>
        <Link className="dashboard-cta" to="/tasks">
          View tasks
          <span aria-hidden="true">&#8594;</span>
        </Link>
      </div>
      <div className="dashboard-rule" />
    </section>
  );
}

export default Dashboard;