'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold transition-all duration-300 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${
                type === 'success'
                    ? 'bg-white border-green-200 text-green-800'
                    : 'bg-white border-red-200 text-red-800'
            }`}
        >
            {type === 'success'
                ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            }
            <span>{message}</span>
            <button
                onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
                className="ml-2 text-gray-400 hover:text-gray-700 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
