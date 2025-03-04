import { redirect, RedirectType } from 'next/navigation';

export default async function PulverizacionDetailRootPage() {
  return redirect('/panel', RedirectType.replace);
}
