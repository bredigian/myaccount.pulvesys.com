import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

import { Button } from './ui/button';
import Cookies from 'js-cookie';
import { LogOut } from 'lucide-react';
import { signout } from '@/services/auth.service';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/use-dialog';
import { useRouter } from 'next/navigation';
import { usuarioStore } from '@/store/usuario.store';

export default function LogoutDialog() {
  const { open, setOpen } = useDialog();
  const { push } = useRouter();
  const { clearUserdata } = usuarioStore();

  const handleLogout = async () => {
    try {
      const access_token = Cookies.get('access_token');
      if (!access_token) {
        push(`/?session=${access_token}&expired=true`);
        return;
      }

      await signout(access_token);

      Cookies.remove('access_token');
      Cookies.remove('userdata');

      clearUserdata();

      push('/');
    } catch (e) {
      if (e instanceof Error)
        toast.error(e.message, { position: 'top-center' });
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={'destructive'} size={'icon'}>
          <LogOut />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás seguro?</DrawerTitle>
          <DrawerDescription>Se cerrará la sesión</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className=''>
          <Button variant={'destructive'} onClick={handleLogout}>
            Salir
          </Button>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
