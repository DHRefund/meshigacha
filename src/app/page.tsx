import React from 'react';
import { cookies } from 'next/headers';
import { CaseApp } from '@/components/case-app/CaseApp';
import type { Language } from '@/lib/i18n';

export default async function Home() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('lang')?.value;
  const initialLanguage: Language = langCookie === 'vi' || langCookie === 'en' ? langCookie : 'ja';
  const introSeen = cookieStore.get('intro-seen')?.value === 'true';

  return <CaseApp initialLanguage={initialLanguage} initialIntroSeen={introSeen} />;
}
