import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PendingService } from '@/types/cashregister-charges';

const paymentMethods = [
  'Efectivo',
  'Cheque',
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Transferencia',
  'Otro',
];

interface ModalCobroServicioProps {
  open: boolean;
  onClose: () => void;
  service: PendingService;
  cashierName: string;
  openingNumber: string | number;
  onConfirm: (paymentMethod: string, notes?: string) => void;
}

export const ModalCobroServicio: React.FC<ModalCobroServicioProps> = ({
  open,
  onClose,
  service,
  cashierName,
  openingNumber,
  onConfirm,
}) => {
  const [paymentMethod, setPaymentMethod] = React.useState(paymentMethods[0]);
  const [notes, setNotes] = React.useState('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Confirmar cobro</span>
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded text-xl font-bold">${service.total_price}</span>
          </DialogTitle>
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className="block text-xs text-muted-foreground">Apertura de caja:</span>
              <span className="font-semibold">{openingNumber}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Cajero:</span>
              <span className="font-semibold">{cashierName}</span>
            </div>
          </div>
        </DialogHeader>
        <div className="flex gap-6 mt-4">
          <div className="w-1/2">
            <div className="font-bold mb-2">Items a cobrar</div>
            <ul className="bg-gray-50 rounded p-2 text-sm">
              <li>
                <span className="font-semibold">{service.service_name}</span> x{service.quantity} - ${service.unit_price}
              </li>
              {/* Si hay más items, mapear aquí */}
            </ul>
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            <label className="font-semibold">Forma de pago</label>
            <select
              className="border rounded px-2 py-1"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <label className="font-semibold mt-2">Observaciones</label>
            <textarea
              className="border rounded px-2 py-1"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Opcional"
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={() => onConfirm(paymentMethod, notes)}>
            Confirmar cobro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
