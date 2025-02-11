import { Dispatch, SetStateAction, useState } from 'react';

export interface Dialog {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleOpen: () => void;
}

export const useDialog = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  return { open, setOpen, handleOpen };
};
