import { RedirectType, redirect } from 'next/navigation';

export default async function SprayDetailRootPage() {
  return redirect('/dashboard', RedirectType.replace);
}
