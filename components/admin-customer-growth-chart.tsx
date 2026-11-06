"use client";

import type { Customer } from "@/lib/ajfan-admin-api";

type CustomerGrowthChartProps = {
  customers: Customer[];
};

const chart = {
  width: 720,
  height: 270,
  padding: { top: 18, right: 20, bottom: 44, left: 44 },
};

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function AdminCustomerGrowthChart({ customers }: CustomerGrowthChartProps) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return {
      key: monthKey(date),
      label: new Intl.DateTimeFormat("en-AE", { month: "short" }).format(date),
      end,
    };
  });
  const values = months.map(({ end }) => customers.filter((customer) => new Date(customer.created_at) <= end).length);
  const maxValue = Math.max(1, ...values);
  const plotWidth = chart.width - chart.padding.left - chart.padding.right;
  const plotHeight = chart.height - chart.padding.top - chart.padding.bottom;
  const points = values.map((value, index) => ({
    x: chart.padding.left + (plotWidth / (values.length - 1)) * index,
    y: chart.padding.top + plotHeight - (value / maxValue) * plotHeight,
    value,
  }));
  const linePoints = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPoints = `${chart.padding.left},${chart.padding.top + plotHeight} ${linePoints} ${chart.padding.left + plotWidth},${chart.padding.top + plotHeight}`;

  return (
    <section className="admin-panel admin-growth-panel" aria-labelledby="customer-growth-heading">
      <div className="admin-panel-heading">
        <div><p className="admin-kicker">Customer activity</p><h2 id="customer-growth-heading">Customer growth</h2><p className="admin-chart-description">Total customer records over the last six months.</p></div>
        <span className="admin-chart-total">{customers.length} total</span>
      </div>
      <div className="admin-chart-wrap">
        <svg className="admin-growth-chart" viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-labelledby="customer-growth-heading customer-growth-description">
          <desc id="customer-growth-description">A six-month line chart showing cumulative customer records.</desc>
          {[0, 1, 2, 3].map((step) => {
            const value = Math.round((maxValue / 3) * (3 - step));
            const y = chart.padding.top + (plotHeight / 3) * step;
            return <g key={step}><line x1={chart.padding.left} x2={chart.width - chart.padding.right} y1={y} y2={y} className="admin-chart-gridline" /><text x={chart.padding.left - 10} y={y + 4} textAnchor="end" className="admin-chart-axis-label">{value}</text></g>;
          })}
          <polygon points={areaPoints} className="admin-chart-area" />
          <polyline points={linePoints} className="admin-chart-line" />
          {points.map(({ x, y, value }, index) => <g key={months[index].key}><circle cx={x} cy={y} r="5" className="admin-chart-point"><title>{`${months[index].label}: ${value} customers`}</title></circle><text x={x} y={chart.height - 16} textAnchor="middle" className="admin-chart-axis-label">{months[index].label}</text></g>)}
        </svg>
      </div>
      {customers.length === 0 && <p className="admin-chart-empty">Add a customer to start tracking growth.</p>}
    </section>
  );
}
