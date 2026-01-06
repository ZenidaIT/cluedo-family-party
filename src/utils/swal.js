import Swal from 'sweetalert2';

// Centralized SweetAlert2 Configuration
// Ensures responsive sizing (Desktop: max 450px, Mobile: 95%) and consistent styling.

const MySwal = Swal.mixin({
    width: 'clamp(300px, 95%, 450px)', // Responsive width logic
    padding: '1.5rem',
    customClass: {
        popup: 'rounded-2xl shadow-2xl border border-slate-100 bg-white font-sans',
        title: 'text-xl font-extrabold text-slate-800',
        content: 'text-slate-600',
        confirmButton: 'bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition-all',
        cancelButton: 'bg-white text-slate-500 px-4 py-3 rounded-xl font-bold border hover:bg-slate-50 focus:ring-4 focus:ring-slate-100 transition-all',
        actions: 'gap-3',
        input: 'rounded-lg border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-800'
    },
    buttonsStyling: false, // We use Tailwind classes above
    reverseButtons: true // Cancel on left, Confirm on right (or standard preference)
});

export default MySwal;
