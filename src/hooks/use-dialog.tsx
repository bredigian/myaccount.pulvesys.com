import { useState } from 'react';

export const useDialog = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  return { open, setOpen, handleOpen };
};
