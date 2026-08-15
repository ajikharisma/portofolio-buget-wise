import { useState, useEffect } from 'react';

/**
 * Custom hook untuk sinkronisasi state dengan localStorage.
 * Bekerja persis seperti useState, namun tersimpan permanen di browser.
 * 
 * @param {string} key - Kunci penyimpanan di localStorage
 * @param {*} defaultValue - Nilai awal jika data di localStorage belum ada
 * @returns {[any, Function]} - [stateValue, setStateFunction]
 */
function useLocalStorage(key, defaultValue) {
    // TODO 1: Inisialisasi state secara lazy (hanya dieksekusi sekali saat mount)
    const [value, setValue] = useState(() => {
        try {
            const saved = localStorage.getItem(key);
            if (saved !== null) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error(`Gagal membaca key "${key}" dari localStorage:`, error);
        }

        // Jika defaultValue berupa function (mirip useState), jalankan function-nya
        return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    });

    // TODO 2: Sync ke localStorage setiap kali `key` atau `value` berubah
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Gagal menyimpan key "${key}" ke localStorage:`, error);
        }
    }, [key, value]);

    // TODO 3: Return [value, setValue] agar identik dengan useState
    return [value, setValue];
}

export default useLocalStorage;