import React from 'react';
import { POSItem } from '../../hooks/usePOS'; // Asegúrate de exportar esta interfaz desde usePOS

interface TicketPanelProps {
  items: POSItem[];
  total: number;
}

export default function TicketPanel({ items, total }: TicketPanelProps) {
  return (
    <div className="h-full flex flex-col bg-gray-800 rounded-xl p-4">
      <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
        Ticket Actual
      </h2>

      {/* Lista de Productos */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 italic">
            Ticket vacío
          </div>
        ) : (
          items.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="flex justify-between items-center bg-gray-700 p-3 rounded-lg animate-fade-in"
            >
              <div>
                <div className="text-white font-medium">{item.name}</div>
                <div className="text-sm text-gray-400">
                  {item.qty} x ${item.price.toFixed(2)}
                </div>
              </div>
              <div className="text-green-400 font-bold">
                ${item.subtotal.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700 bg-gray-800">
        <div className="flex justify-between items-end">
          <span className="text-gray-400 text-sm uppercase tracking-wider">Total a Pagar</span>
          <span className="text-3xl font-bold text-white">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
