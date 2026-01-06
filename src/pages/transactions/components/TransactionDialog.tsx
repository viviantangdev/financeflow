import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Separator } from '../../../components/ui/separator';

type TransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const TransactionDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: TransactionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-106'>
        <DialogHeader>
          <DialogTitle className='uppercase'>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <Separator />
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
