import { Usuario, UsuarioToSignup } from '@/types/usuario.types';

import { APIError } from '@/types/error.types';
import { API_URL } from '@/config/api';
import { Token } from '@/types/auth.types';
import { signup } from './auth.service';

export const getUsuariosByEmpresaId = async (
  access_token: string,
  refresh_token: Token,
) => {
  const PATH = `${API_URL}/v1/usuarios/empresa`;
  const OPTIONS: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${access_token}`,
      Cookie: JSON.stringify(refresh_token),
    },
    next: { tags: ['usuarios'] },
  };

  const res = await fetch(PATH, OPTIONS);
  const data: Usuario[] | APIError = await res.json();
  if (!res.ok) return data as APIError;

  return data as Usuario[];
};

// Reutiliza la funcion de "signup" pero con otro PATH
export const addUsuario = async (
  payload: UsuarioToSignup,
  access_token: string,
) => await signup(payload, 'usuarios/empresa', access_token);

// export const editUsuario = async (payload: Usuario, access_token: string) => {
//   const PATH = `${API_URL}/v1/usuarios/empresa`;
//   const OPTIONS: RequestInit = {
//     method: 'PUT',
//     credentials: 'include',
//     body: JSON.stringify(payload),
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${access_token}`,
//     },
//   };

//   const res = await fetch(PATH, OPTIONS);
//   const data: Usuario | APIError = await res.json();
//   if (!res.ok) throw data as APIError;

//   return data as Usuario;
// };
