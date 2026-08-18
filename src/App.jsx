import React from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import defaultCategories from './data/defaultCategories';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import SummaryCards from './components/SummaryCards';
import CategoryBreakdownChart from './components/CategoryBreakdownChart';

function App() {
  // 1. Custom hook useLocalStorage untuk simpan transaksi & kategori
  const [transactions, setTransactions] = useLocalStorage('budgetwise_transactions', []);
  const [categories] = useLocalStorage('budgetwise_categories', defaultCategories);

  // 2. Handler Tambah Transaksi (transaksi baru di awal array)
  const handleAddTransaction = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  // 3. Handler Hapus Transaksi by ID
  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((trx) => trx.id !== id));
  };

  // Quick stats kalkulasi saldo total untuk header
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  const formatRupiah = (val) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* APP HEADER */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/20">
              BW
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                BudgetWise
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencatat Keuangan Pribadi
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Saldo
            </span>
            <p className={`text-base font-extrabold ${balance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600'}`}>
              {formatRupiah(balance)}
            </p>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="space-y-6">
          {/* 1. Ringkasan Kartu: Saldo, Pemasukan, Pengeluaran */}
          <section>
            <SummaryCards transactions={transactions} />
          </section>

          {/* 2. Visualisasi Grafik Distribusi Pengeluaran (Pie Chart) */}
          <section>
            <CategoryBreakdownChart
              transactions={transactions}
              categories={categories}
            />
          </section>

          {/* 3. Form Input Transaksi (React Hook Form + Zod) */}
          <section>
            <TransactionForm
              categories={categories}
              onAddTransaction={handleAddTransaction}
            />
          </section>

          {/* 4. List Riwayat Transaksi */}
          <section>
            <TransactionList
              transactions={transactions}
              categories={categories}
              onDelete={handleDeleteTransaction}
            />
          </section>
        </main>

        {/* FOOTER */}
        <footer className="text-center text-xs text-slate-400 dark:text-slate-600 pt-4">
          BudgetWise &bull; Disimpan lokal di peramban browser kamu
        </footer>
      </div>
    </div>
  );
}

export default App;