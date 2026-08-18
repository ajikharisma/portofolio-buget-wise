import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// Custom Tooltip modern untuk Recharts
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-slate-900 text-white text-xs py-2 px-3 rounded-xl shadow-lg border border-slate-800">
                <p className="font-semibold">{data.name}</p>
                <p className="text-slate-300 font-mono mt-0.5">
                    Rp {Number(data.value).toLocaleString('id-ID')}
                </p>
            </div>
        );
    }
    return null;
};

function CategoryBreakdownChart({ transactions = [], categories = [] }) {
    // TODO 1: Filter hanya transaksi bertipe 'expense'
    const expenseTransactions = transactions.filter((t) => t.type === 'expense');

    // TODO 2: Kelompokkan & jumlahkan total nominal per kategori (Grouping via reduce)
    const grouped = expenseTransactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount || 0);
        return acc;
    }, {});

    // Ubah object hasil group menjadi array format Recharts [{ name, value, color }]
    const chartData = Object.entries(grouped).map(([categoryId, total]) => {
        const categoryInfo = categories.find((c) => c.id === categoryId);
        return {
            name: categoryInfo?.name || categoryId,
            value: total,
            color: categoryInfo?.color || '#6366f1',
        };
    });

    // Empty state jika belum ada data pengeluaran
    if (chartData.length === 0) {
        return (
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    Distribusi Pengeluaran
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                    Breakdown pengeluaran berdasarkan kategori
                </p>
                <div className="py-8 text-slate-400 dark:text-slate-600 text-xs">
                    📊 Belum ada data pengeluaran untuk ditampilkan di chart.
                </div>
            </div>
        );
    }

    // TODO 3: Render Pie Chart
    return (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Distribusi Pengeluaran
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Breakdown pengeluaran berdasarkan kategori
                </p>
            </div>

            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={3}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CategoryBreakdownChart;