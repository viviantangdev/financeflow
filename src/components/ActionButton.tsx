import { Plus } from 'lucide-react';
import { Button } from './ui/button';

type ActionButtonProps = {
  text: string;
  onClick?: () => void;
};

export const ActionButton = ({ text, onClick }: ActionButtonProps) => {
  return (
    <Button type='button' variant={'default'} size={'lg'} onClick={onClick} className='primaryButton'>
      <Plus />
      {text}
    </Button>
  );
};
