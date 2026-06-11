import QRCode from 'qrcode';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  if (!username) {
    return new Response('Username required', { status: 400 });
  }

  const profileUrl = `https://smartprofile.in/${username}`;
  
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });

  return new Response(JSON.stringify({ qr: qrDataUrl, url: profileUrl }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
