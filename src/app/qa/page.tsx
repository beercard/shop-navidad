import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { isQaEnvironmentReady } from '@/lib/qa-safety';
import QACenter from './qa-center';

export const metadata = { title: 'Centro de pruebas QA', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function QAPage() {
  if (!isQaEnvironmentReady()) notFound();
  const admin = await requireAdmin(['SUPERADMIN']);
  if (!admin) redirect('/admin');
  return <QACenter adminName={admin.name} />;
}
