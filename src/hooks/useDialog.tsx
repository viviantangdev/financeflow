import { useState } from 'react';

export function useDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return { isDialogOpen, setIsDialogOpen };
}
