import React from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import defaultCategories from './data/defaultCategories';
import SummaryCards from './components/SummaryCards';
import BudgetProgress from './components/BudgetProgress';
import TransactionForm from './components/TransactionForm';
import CategoryBreakdownChart from './components/CategoryBreakdownChart';
import MonthlyTrendChart from './components/MonthlyTrendChart';
import TransactionList from './components/TransactionList';

// Limit budget default per kategori
const initialBudgetLimits = [
  { categoryId: 'makan', limit: 1500000 },
  { categoryId: 'transport', limit: 500000 },
  { categoryId: 'hiburan', limit: 400000 },
  { categoryId: 'belanja', limit: 800000 },
];

function App() {
  // 1. Data persisten via useLocalStorage
  const [transactions, setTransactions] = useLocalStorage('budgetwise_transactions', []);
  const [categories] = useLocalStorage('budgetwise_categories', defaultCategories);
  const [budgetLimits] = useLocalStorage('budgetwise_limits', initialBudgetLimits);

  // 2. Handler Tambah Transaksi
  const handleAddTransaction = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  // 3. Handler Hapus Transaksi
  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((trx) => trx.id !== id));
  };

  // Kalkulasi total saldo
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

          {/* 2. Target Anggaran (Budget Limit Progress) */}
          <section>
            <BudgetProgress
              transactions={transactions}
              categories={categories}
              budgetLimits={budgetLimits}
            />
          </section>

          {/* 3. Form Input Transaksi (React Hook Form + Zod) */}
          <section>
            <TransactionForm
              categories={categories}
              onAddTransaction={handleAddTransaction}
            />
          </section>

          {/* 4. Visualisasi Grafik Distribusi Pengeluaran (Pie Chart) */}
          <section>
            <CategoryBreakdownChart
              transactions={transactions}
              categories={categories}
            />
          </section>

          {/* 5. Visualisasi Grafik Tren Bulanan (Bar Chart) */}
          <section>
            <MonthlyTrendChart transactions={transactions} />
          </section>

          {/* 6. List Riwayat Transaksi */}
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