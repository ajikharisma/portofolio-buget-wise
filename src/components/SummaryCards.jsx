import react from 'react';

// Helper format rupiah lokal Indonesia
const formatRupiah = (number) => {
    return `Rp ${Number(number || 0).toLocaleString('id-ID')}`;
};

function SummaryCards({ transactions = [] }) {
    // TODO 1: Hitung total pemasukan
    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // TODO 2: Hitung total pengeluaran
    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // TODO 3: Hitung saldo akhir
    const balance = totalIncome - totalExpense;
    const isBalanceNegative = balance < 0;

    // TODO 4: Render 3 kartu ringkasan
    return (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3.5'>
            {/* Kartu 1: toak saldo */}
            <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-sm ${isBalanceNegative
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                    : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40'
                    }`}
            >
                <div className='flex items-center justify-between'>
                    <span className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                        Todal Saldo
                    </span>
                    <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${isBalanceNegative
                            ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
                            : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                            }`}
                    >
                        💳
                    </div>
                </div>
                <p
                    className={`text-lg sm:text-xl font-extrabold tracking-tight mt-2 truncate ${isBalanceNegative
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                >
                    {formatRupiah(balance)}
                </p>
                <p className='text-[11px] text-slate-400 dark:text-slate-500 mt-0.5'>
                    {isBalanceNegative ? '⚠️ Pengeluaran melebihi saldo' : 'Saldo aktif saat ini'}
                </p>
            </div>

            {/* KARTU 2: Total Pemasukan */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 shadow-sm transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Pemasukan
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                        ↓
                    </div>
                </div>
                <p className="text-lg sm:text-xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 mt-2 truncate">
                    {formatRupiah(totalIncome)}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Semua arus kas masuk
                </p>
            </div>

            {/* KARTU 3: Total Pengeluaran */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 shadow-sm transition-all">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Pengeluaran
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold">
                        ↑
                    </div>
                </div>
                <p className="text-lg sm:text-xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400 mt-2 truncate">
                    {formatRupiah(totalExpense)}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Semua pos pengeluaran
                </p>
            </div>
        </div>
    );
}

export default SummaryCards;