/**
 * Data kategori bawaan untuk BudgetWise
 * type: 'income' (Pemasukan) | 'expense' (Pengeluaran)
 * color: Hex code untuk chart & badge kategori
 */
const defaultCategories = [
    // --- KATEGORI PEMASUKAN (INCOME) ---
    {
        id: 'gaji',
        name: 'Gaji Utama',
        type: 'income',
        color: '#10b981', // Emerald 500
    },
    {
        id: 'freelance',
        name: 'Side Hustle / Freelance',
        type: 'income',
        color: '#06b6d4', // Cyan 500
    },
    {
        id: 'investasi',
        name: 'Investasi & Dividen',
        type: 'income',
        color: '#6366f1', // Indigo 500
    },
    {
        id: 'bonus',
        name: 'Bonus & Hadiah',
        type: 'income',
        color: '#8b5cf6', // Violet 500
    },

    // --- KATEGORI PENGELUARAN (EXPENSE) ---
    {
        id: 'makan',
        name: 'Makanan & Minuman',
        type: 'expense',
        color: '#f43f5e', // Rose 500
    },
    {
        id: 'transport',
        name: 'Transportasi',
        type: 'expense',
        color: '#f97316', // Orange 500
    },
    {
        id: 'tagihan',
        name: 'Tagihan & Utilitas',
        type: 'expense',
        color: '#eab308', // Yellow 500
    },
    {
        id: 'belanja',
        name: 'Belanja Kebutuhan',
        type: 'expense',
        color: '#ec4899', // Pink 500
    },
    {
        id: 'hiburan',
        name: 'Hiburan & Hobi',
        type: 'expense',
        color: '#a855f7', // Purple 500
    },
    {
        id: 'kesehatan',
        name: 'Kesehatan & Medis',
        type: 'expense',
        color: '#14b8a6', // Teal 500
    },
    {
        id: 'pendidikan',
        name: 'Edukasi & Kursus',
        type: 'expense',
        color: '#3b82f6', // Blue 500
    },
];

export default defaultCategories;