import { Button } from '@/shared/ui/Button';

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmActionModal({
  open,
  title,
  message,
  confirmLabel = '네',
  cancelLabel = '아니오',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl">
        <h2 className="text-xl font-black text-gray-950">{title}</h2>
        {message && <p className="mt-3 text-sm font-bold leading-6 text-gray-500">{message}</p>}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isConfirming}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? '처리 중' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
