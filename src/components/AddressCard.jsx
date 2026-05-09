import { Check } from 'lucide-react';

export default function AddressCard({ address, isSelected, onSelect }) {
    return (
        <div 
            onClick={() => onSelect(address._id)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                isSelected 
                ? 'border-black bg-gray-50 shadow-sm' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
        >
            {isSelected && (
                <div className="absolute top-4 right-4 text-black">
                    <Check className="w-5 h-5 stroke-[3]" />
                </div>
            )}
            
            <div className="flex items-center justify-between mb-3">
                <span className="font-extrabold text-gray-900 uppercase tracking-wide text-sm">{address.alias || 'Address'}</span>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-gray-800">{address.street}</p>
                <p className="text-sm text-gray-600">{address.city}, {address.postalCode}</p>
                <p className="text-sm text-gray-600 pt-2 flex items-center">
                    <span className="text-gray-400 mr-2">Phone:</span>
                    <span className="font-medium text-gray-900">{address.phone}</span>
                </p>
            </div>
        </div>
    );
}
