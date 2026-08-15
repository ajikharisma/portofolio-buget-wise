import React from 'react';

// Formatter mata uang Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(number);
};

// Formatter tanggal yang mudah dibaca (contoh: 15 Agu 2026)
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

function TransactionList({ transactions = [], categories = [], onDelete }) {
    // TODO 3: Urutkan transaksi dari yang paling baru berdasarkan tanggal
    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    // TODO 1: Empty state jika data kosong
    if (sortedTransactions.length === 0) {
        return (
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl">
                    🧾
                </div>
                <h4 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                    Belum Ada Transaksi
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
                    Mulai catat pengeluaran dan pemasukan harianmu melalui form di atas.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            {/* Header List */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Riwayat Transaksi
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total {sortedTransactions.length} catatan transaksi
                    </p>
                </div>
            </div>

            {/* TODO 2: Render List Transaksi */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedTransactions.map((item) => {
                    // Lookup info kategori berdasarkan ID
                    const categoryInfo = categories.find((c) => c.id === item.category);
                    const isIncome = item.type === 'income';

                    return (
                        <div
                            key={item.id}
                            className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 px-2.5 -mx-2.5 rounded-xl transition-colors duration-150"
                        >
                            {/* Kolom Kiri: Ikon, Info Kategori & Deskripsi */}
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Badge Warna Kategori */}
                                <div
                                    className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-base font-bold shadow-sm"
                                    style={{
                                        backgroundColor: categoryInfo?.color ? `${categoryInfo.color}15` : '#f1f5f9',
                                        color: categoryInfo?.color || '#64748b',
                                    }}
                                >
                                    {isIncome ? '↓' : '↑'}
                                </div>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                            {categoryInfo?.name || 'Tanpa Kategori'}
                                        </span>
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                            • {formatDate(item.date)}
                                        </span>
                                    </div>

                                    {item.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Kolom Kanan: Nominal & Tombol Hapus */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right">
                                    <p
                                        className={`text-sm font-bold tracking-tight ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                            }`}
                                    >
                                        {isIncome ? '+' : '-'} {formatRupiah(item.amount)}
                                    </p>
                                    <span className="text-[10px] uppercase font-medium tracking-wider text-slate-400">
                                        {isIncome ? 'Masuk' : 'Keluar'}
                                    </span>
                                </div>

                                {/* Tombol Hapus */}
                                <button
                                    type="button"
                                    onClick={() => onDelete(item.id)}
                                    title="Hapus transaksi"
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg opacity-80 group-hover:opacity-100 transition-all"
                                    aria-label="Hapus transaksi"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TransactionList;