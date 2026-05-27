import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Recueille les demandes de démo. Si CONTACT_WEBHOOK_URL est défini (Make,
// Zapier, n8n, Slack…), la demande y est relayée. Sinon, on accepte la requête
// et on signale au client de basculer sur le lien mailto pour ne perdre aucun
// lead.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const company = String(body.company ?? '').trim();
  const phone = String(body.phone ?? '').trim();

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'required';
  if (!EMAIL_RE.test(email)) errors.email = 'email';
  if (company.length < 2) errors.company = 'required';
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, company, phone, source: 'novaxium.site', ts: Date.now() })
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
      return NextResponse.json({ ok: true, delivered: true });
    } catch {
      return NextResponse.json({ ok: true, delivered: false }, { status: 200 });
    }
  }

  return NextResponse.json({ ok: true, delivered: false });
}
