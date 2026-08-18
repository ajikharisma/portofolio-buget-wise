import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// Helper format bulan "2026-08" -> "Agu 2026"
const formatMonthLabel = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
};

// Custom tooltip chart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white text-xs py-2 px-3 rounded-xl shadow-lg border border-slate-800 space-y-1">
                <p className="font-semibold text-slate-300">{formatMonthLabel(label)}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} style={{ color: entry.color }} className="font-mono">
                        {entry.name}: Rp {Number(entry.value).toLocaleString('id-ID')}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

function MonthlyTrendChart({ transactions = [] }) {
    // TODO 1: Grouping transaksi per bulan (YYYY-MM), hitung total income & expense
    const grouped = transactions.reduce((acc, t) => {
        if (!t.date) return acc;
        const monthKey = t.date.slice(0, 7); // Ambil "YYYY-MM"

        if (!acc[monthKey]) {
            acc[monthKey] = { income: 0, expense: 0 };
        }

        const amount = Number(t.amount || 0);
        if (t.type === 'income') {
            acc[monthKey].income += amount;
        } else if (t.type === 'expense') {
            acc[monthKey].expense += amount;
        }

        return acc;
    }, {});

    // TODO 2: Ubah object menjadi array dan urutkan secara kronologis (ascending)
    const chartData = Object.entries(grouped)
        .map(([month, totals]) => ({
            month,
            income: totals.income,
            expense: totals.expense,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

    // Empty state jika belum ada data transaksi
    if (chartData.length === 0) {
        return (
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    Tren Keuangan Bulanan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                    Perbandingan pemasukan vs pengeluaran tiap bulan
                </p>
                <div className="py-8 text-slate-400 dark:text-slate-600 text-xs">
                    📈 Belum ada data transaksi untuk membentuk grafik tren.
                </div>
            </div>
        );
    }

    // TODO 3: Render BarChart
    return (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Tren Keuangan Bulanan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Perbandingan arus kas masuk dan keluar per bulan
                </p>
            </div>

            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                        <XAxis
                            dataKey="month"
                            tickFormatter={formatMonthLabel}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickFormatter={(val) => `Rp ${(val / 1000).toLocaleString('id-ID')}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        />
                        <Bar dataKey="income" fill="#10b981" name="Pemasukan" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="#f43f5e" name="Pengeluaran" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default MonthlyTrendChart;