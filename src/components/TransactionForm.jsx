import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ==========================================
// 1. SKEMA VALIDASI ZOD (DI LUAR KOMPONEN)
// ==========================================
const transactionSchema = z.object({
    type: z.enum(['income', 'expense'], {
        required_error: 'Tipe transaksi wajib dipilih',
    }),
    // z.coerce.number() otomatis konversi input string HTML menjadi tipe number
    amount: z.coerce
        .number({ invalid_type_error: 'Jumlah harus berupa angka' })
        .positive('Jumlah harus lebih dari 0'),
    category: z
        .string({ required_error: 'Kategori wajib dipilih' })
        .min(1, 'Silakan pilih salah satu kategori'),
    description: z.string().optional(),
    date: z.string().min(1, 'Tanggal transaksi wajib diisi'),
});

function TransactionForm({ categories = [], onAddTransaction }) {
    // ==========================================
    // 2. SETUP REACT HOOK FORM + ZOD RESOLVER
    // ==========================================
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: 'expense',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().slice(0, 10),
        },
    });

    // Watch field 'type' untuk memfilter kategori (income vs expense) secara realtime
    const selectedType = watch('type');
    const filteredCategories = categories.filter((cat) => cat.type === selectedType);

    // ==========================================
    // 3. SUBMIT HANDLER (Hanya jalan jika valid)
    // ==========================================
    const onSubmit = (data) => {
        onAddTransaction({
            ...data,
            id: `trx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            createdAt: new Date().toISOString(),
        });

        // Reset form ke state awal tapi tetap pertahankan tipe & tanggal hari ini
        reset({
            type: selectedType,
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().slice(0, 10),
        });
    };

    // ==========================================
    // 4. RENDER FORM DENGAN STYLING MODERN
    // ==========================================
    return (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Tambah Transaksi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Catat pemasukan atau pengeluaran harianmu
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* TAB TOGGLE: Tipe Transaksi (Pemasukan vs Pengeluaran) */}
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Tipe Transaksi
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                        <label
                            className={`flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-medium cursor-pointer transition-all ${selectedType === 'expense'
                                    ? 'bg-rose-500 text-white shadow-sm font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                        >
                            <input
                                type="radio"
                                value="expense"
                                className="sr-only"
                                {...register('type')}
                            />
                            <span>💸 Pengeluaran</span>
                        </label>

                        <label
                            className={`flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-medium cursor-pointer transition-all ${selectedType === 'income'
                                    ? 'bg-emerald-500 text-white shadow-sm font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                        >
                            <input
                                type="radio"
                                value="income"
                                className="sr-only"
                                {...register('type')}
                            />
                            <span>💰 Pemasukan</span>
                        </label>
                    </div>
                    {errors.type && (
                        <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.type.message}</p>
                    )}
                </div>

                {/* INPUT: Nominal / Jumlah */}
                <div>
                    <label
                        htmlFor="amount"
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                    >
                        Nominal (Rp)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm font-semibold">
                            Rp
                        </div>
                        <input
                            id="amount"
                            type="number"
                            step="any"
                            placeholder="0"
                            {...register('amount')}
                            className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.amount
                                    ? 'border-rose-400 focus:ring-rose-400/30'
                                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                                }`}
                        />
                    </div>
                    {errors.amount && (
                        <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.amount.message}</p>
                    )}
                </div>

                {/* INPUT: Kategori & Tanggal (2 Kolom di Desktop/Tablet) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SELECT: Kategori */}
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                        >
                            Kategori
                        </label>
                        <select
                            id="category"
                            {...register('category')}
                            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${errors.category
                                    ? 'border-rose-400 focus:ring-rose-400/30'
                                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                                }`}
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    Belum ada kategori untuk tipe ini
                                </option>
                            )}
                        </select>
                        {errors.category && (
                            <p className="text-rose-500 text-xs mt-1.5 font-medium">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    {/* INPUT: Tanggal */}
                    <div>
                        <label
                            htmlFor="date"
                            className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                        >
                            Tanggal
                        </label>
                        <input
                            id="date"
                            type="date"
                            {...register('date')}
                            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${errors.date
                                    ? 'border-rose-400 focus:ring-rose-400/30'
                                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                                }`}
                        />
                        {errors.date && (
                            <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.date.message}</p>
                        )}
                    </div>
                </div>

                {/* INPUT: Catatan / Deskripsi (Opsional) */}
                <div>
                    <label
                        htmlFor="description"
                        className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                    >
                        Catatan <span className="text-slate-400 font-normal lowercase">(opsional)</span>
                    </label>
                    <input
                        id="description"
                        type="text"
                        placeholder="Contoh: Makan siang bareng tim, Beli bensin, dll"
                        {...register('description')}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Menyimpan...' : '+ Simpan Transaksi'}
                </button>
            </form>
        </div>
    );
}

export default TransactionForm;