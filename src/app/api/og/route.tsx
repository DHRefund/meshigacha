import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'MeshiGacha | メシガチャ';
    const subtitle = searchParams.get('subtitle') || '「今日何食べる？」迷ったら、回せ！';
    const price = searchParams.get('price') || '850';
    const item = searchParams.get('item') || 'サーモンのガーリックバター醤油定食';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0c131a',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(245, 158, 11, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(56, 189, 248, 0.1) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '50px 60px',
            fontFamily: 'sans-serif',
            color: '#f8fafc',
            border: '8px solid #f59e0b',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Brand Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f59e0b, #b45309)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                }}
              >
                🍱
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '36px',
                    fontWeight: 900,
                    color: '#fbbf24',
                    letterSpacing: '-1px',
                  }}
                >
                  Meshi<span style={{ color: '#f59e0b' }}>Gacha</span>
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#d97706',
                    letterSpacing: '4px',
                  }}
                >
                  メシガチャ // TACTICAL ARSENAL
                </span>
              </div>
            </div>

            {/* LIVE Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '30px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#34d399',
                fontSize: '16px',
                fontWeight: 800,
              }}
            >
              🟢 LIVE GACHA
            </div>
          </div>

          {/* Main Dish Spotlight Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: '30px 36px',
              borderRadius: '24px',
              background: 'linear-gradient(145deg, rgba(26, 38, 50, 0.9), rgba(15, 23, 32, 0.95))',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              marginTop: '20px',
            }}
          >
            <div style={{ fontSize: '16px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
              ✨ 本日の勝利ドロップ // VICTORY ITEM
            </div>
            <div style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', marginTop: '10px' }}>
              {item}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '16px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.2)', padding: '6px 16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.5)' }}>
                目安価格: 約{price}円
              </span>
              <span style={{ fontSize: '18px', color: '#38bdf8', fontWeight: 700 }}>
                ★ Special Edition Case
              </span>
            </div>
          </div>

          {/* Slogan Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#e2e8f0' }}>
              {subtitle}
            </div>
            <div style={{ fontSize: '16px', color: '#64748b', fontWeight: 600 }}>
              https://truanayangi.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response('Failed to generate OpenGraph Image', { status: 500 });
  }
}
