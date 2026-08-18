import React from 'react';

// Helper format Rupiah
const formatRupiah = (number) => {
    return `Rp ${Number(number || 0).toLocaleString('id-ID')}`;
};

function BudgetProgress({ transactions = [], categories = [], budgetLimits = [] }) {
    // TODO 1: Ambil bulan saat ini dalam format YYYY-MM
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Filter transaksi pengeluaran hanya untuk bulan berjalan
    const thisMonthExpenses = transactions.filter(
        (t) => t.type === 'expense' && t.date && t.date.startsWith(currentMonth)
    );

    // TODO 2: Hitung kalkulasi per item limit budget
    const budgetStatus = budgetLimits.map((budgetItem) => {
        const categoryInfo = categories.find((c) => c.id === budgetItem.categoryId);

        // Total nominal yang terpakai bulan ini
        const spent = thisMonthExpenses
            .filter((t) => t.category === budgetItem.categoryId)
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        const rawPercentage = (spent / budgetItem.limit) * 100;
        // Clamp maksimal 100% agar lebar bar tidak merusak container UI
        const clampedPercentage = Math.min(rawPercentage, 100);

        const isOverBudget = spent > budgetItem.limit;
        const isNearLimit = rawPercentage >= 80 && !isOverBudget;

        return {
            categoryId: budgetItem.categoryId,
            categoryName: categoryInfo?.name || budgetItem.categoryId,
            limit: budgetItem.limit,
            spent,
            rawPercentage,
            clampedPercentage,
            isOverBudget,
            isNearLimit,
        };
    });

    return (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Target Anggaran Bulanan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monitoring limit pengeluaran untuk bulan ini
                </p>
            </div>

            <div className="space-y-4 pt-1">
                {budgetStatus.map((item) => {
                    // TODO 3: Dynamic color conditional styling
                    let barColor = 'bg-emerald-500';
                    let textColor = 'text-emerald-600 dark:text-emerald-400';
                    let badgeText = 'Aman';

                    if (item.isOverBudget) {
                        barColor = 'bg-rose-500';
                        textColor = 'text-rose-600 dark:text-rose-400';
                        badgeText = 'Over Budget!';
                    } else if (item.isNearLimit) {
                        barColor = 'bg-amber-500';
                        textColor = 'text-amber-600 dark:text-amber-400';
                        badgeText = 'Mendekati Limit';
                    }

                    return (
                        <div key={item.categoryId} className="space-y-1.5">
                            {/* Header Info Kategori */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    {item.categoryName}
                                </span>
                                <span className={`font-semibold ${textColor}`}>
                                    {formatRupiah(item.spent)}{' '}
                                    <span className="text-slate-400 font-normal">/ {formatRupiah(item.limit)}</span>
                                </span>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                <div
                                    style={{ width: `${item.clampedPercentage}%` }}
                                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                                />
                            </div>

                            {/* Status Persentase & Alert */}
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                                <span>{item.rawPercentage.toFixed(0)}% terpakai</span>
                                <span className={`font-semibold uppercase tracking-wider ${textColor}`}>
                                    {badgeText}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BudgetProgress;