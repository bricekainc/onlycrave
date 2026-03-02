import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getCreators } from '../lib/getCreators'

export async function getStaticProps() {
  try {
    const creators = await getCreators()
    return { props: { creators: creators || [] }, revalidate: 60 }
  } catch {
    return { props: { creators: [] }, revalidate: 60 }
  }
}

export default function CombinedHome({ creators }: { creators: any[] }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isFansnub, setIsFansnub] = useState(false)

  /* ===============================
     FANSNUB STATE
  =============================== */
  const [timer, setTimer] = useState(5)
  const [timeReady, setTimeReady] = useState(false)
  const [captchaReady, setCaptchaReady] = useState(false)
  const [answer, setAnswer] = useState(0)
  const [choices, setChoices] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [stage, setStage] = useState(1)
  const [age, setAge] = useState('')
  const [ageError, setAgeError] = useState(false)

  /* ===============================
     ONLYCRAVE STATE
  =============================== */
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingCreator, setLoadingCreator] = useState('')
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')
  const [followers, setFollowers] = useState(5000)
  const [subPrice, setSubPrice] = useState(10)

  useEffect(() => {
    setMounted(true)
    const host = window.location.hostname

    if (host.includes('fansnub.com')) {
      setIsFansnub(true)

      const n1 = Math.floor(Math.random() * 9) + 1
      const n2 = Math.floor(Math.random() * 9) + 1
      const ans = n1 + n2
      setAnswer(ans)
      setChoices([ans, ans + 2, ans - 3].sort(() => Math.random() - 0.5))

      const interval = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            clearInterval(interval)
            setTimeReady(true)
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      const saved = localStorage.getItem('crave-theme') as any
      if (saved) setThemeMode(saved)
    }
  }, [])

  useEffect(() => {
    if (!mounted || isFansnub) return

    if (themeMode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setResolvedTheme(isDark ? 'dark' : 'light')
    } else {
      setResolvedTheme(themeMode)
    }

    localStorage.setItem('crave-theme', themeMode)
  }, [themeMode, mounted, isFansnub])

  if (!mounted) return null

  /* =========================================================
     ================= FANSNUB LANDING =======================
  ========================================================= */
  if (isFansnub) {
    const newUrl = `https://onlycrave.com${router.asPath}`

    return (
      <>
        <Head>
          <title>
            Fansnub Has Moved to OnlyCrave – Exclusive Creator Platform | Onlycrave - Connect with Fans. Earn with Content.
          </title>
          <meta
            name="description"
            content="Fansnub (Fansnub.com) is now OnlyCrave.com — an exclusive content platform for creators to share and monetize videos, images, and more. Low fees, fast payouts, and the content you crave! Onlycrave is an all-in-one creator subscription platform where independent creators monetize exclusive content with subscriptions, tips, and pay-per-view access"
          />
          <meta name="keywords" content="OnlyCrave" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={newUrl} />
          <meta property="og:title" content="Fansnub is now OnlyCrave.com – Connect with Fans. Earn with Content." />
          <meta property="og:description" content="We've moved! Join us at the new, improved OnlyCrave.com." />
          <meta property="og:url" content={newUrl} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://onlycrave.com/public/img/logo.png" />
        </Head>

        <div style={{ background: '#050505', minHeight: '100vh', color: '#fff', padding: 20, fontFamily: 'Inter, sans-serif' }}>
          <div style={{ maxWidth: 600, margin: '40px auto' }}>

            {stage === 1 && (
              <div style={{
                background: '#111',
                padding: 40,
                borderRadius: 28,
                border: '1px solid #222',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}>
                <div style={{ fontFamily: 'monospace', marginBottom: 20 }}>
                  {timeReady
                    ? 'SECURE TUNNEL ESTABLISHED. SELECT ANSWER.'
                    : `ESTABLISHING SECURE TUNNEL... (${timer}s)`}
                </div>

                <h1 style={{ fontSize: '1.8rem', marginBottom: 12 }}>
                  Fansnub <span style={{ color: '#ff3e80' }}>➔</span> OnlyCrave
                </h1>

                <p style={{ opacity: 0.6 }}>
                  404: The page has moved to our new platform.
                </p>

                <div style={{
                  background: '#000',
                  padding: 20,
                  borderRadius: 18,
                  marginTop: 20,
                  border: '1px solid #0102FD'
                }}>
                  <div style={{ marginBottom: 10 }}>
                    Security Check: {answer - 2} + 2 = ?
                  </div>

                  {choices.map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelected(c)
                        setCaptchaReady(c === answer)
                      }}
                      style={{
                        margin: 5,
                        padding: '10px 20px',
                        background: selected === c ? '#0102FD' : '#1a1a1a',
                        border: '1px solid #333',
                        color: '#fff',
                        borderRadius: 8,
                        cursor: 'pointer'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!timeReady || !captchaReady}
                  onClick={() => setStage(2)}
                  style={{
                    marginTop: 20,
                    padding: 16,
                    width: '100%',
                    borderRadius: 14,
                    background: timeReady && captchaReady ? '#ff3e80' : '#333',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Continue to Age Gate
                </button>
              </div>
            )}

            {stage === 2 && (
              <div style={{
                background: '#111',
                padding: 40,
                borderRadius: 28,
                border: '1px solid #ff3e80'
              }}>
                <h1>18+ Mature Access</h1>
                <p style={{ opacity: 0.6 }}>
                  OnlyCrave contains adult content. Please confirm your eligibility.
                </p>

                <input
                  type="number"
                  placeholder="18"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  style={{
                    background: '#000',
                    border: '1px solid #ff3e80',
                    padding: 12,
                    borderRadius: 10,
                    width: 80,
                    textAlign: 'center',
                    marginTop: 20,
                    color: '#fff'
                  }}
                />

                {ageError && (
                  <p style={{ color: '#ff4444', fontSize: 12 }}>
                    Access Denied: 18+ Only.
                  </p>
                )}

                <button
                  onClick={() =>
                    parseInt(age) >= 18
                      ? (window.location.href = newUrl)
                      : setAgeError(true)
                  }
                  style={{
                    marginTop: 20,
                    padding: 16,
                    width: '100%',
                    background: '#ff3e80',
                    color: '#fff',
                    borderRadius: 14,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Confirm & Enter OnlyCrave
                </button>
              </div>
            )}

          </div>
        </div>
      </>
    )
  }

  /* =========================================================
     ================= ONLYCRAVE FULL UI =====================
  ========================================================= */

  const t = {
    bg: resolvedTheme === 'dark' ? '#050505' : '#f8f9fa',
    text: resolvedTheme === 'dark' ? '#ffffff' : '#0a0a0a',
    card: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    border: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    pink: '#e33cc7',
    cyan: '#2ddfff',
  }

  const estimatedEarnings = followers * 0.05 * subPrice * 0.95

  const filteredCreators = creators.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAction = (username: string) => {
    setLoadingCreator(username)
    setTimeout(() => router.push(`/${username}`), 5000)
  }

  return (
    <div style={{ backgroundColor: t.bg, color: t.text, minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>OnlyCrave | The World's Most Profitable Creator Platform</title>
        <meta name="description" content="Join OnlyCrave and keep 95% of your earnings. Optimized for M-Pesa, Crypto, and global creators." />
        <link rel="canonical" href="https://onlycrave.com" />
      </Head>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 80 }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 900 }}>
          EARN <span style={{ color: t.pink }}>MORE</span>.<br />
          CRAVE <span style={{ color: t.cyan }}>FREEDOM</span>.
        </h1>

        <input
          style={{
            marginTop: 30,
            padding: 20,
            width: '100%',
            borderRadius: 30,
            border: `1px solid ${t.border}`,
            background: t.card,
            color: t.text
          }}
          placeholder="Discover verified creators..."
          onChange={e => setSearchTerm(e.target.value)}
        />

        <section style={{ marginTop: 60 }}>
          {filteredCreators.slice(0, 8).map(c => (
            <div key={c.username} style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              padding: 30,
              borderRadius: 30,
              marginBottom: 20
            }}>
              <h3>{c.name}</h3>
              <p style={{ color: t.pink }}>@{c.username}</p>
              <button
                onClick={() => handleAction(c.username)}
                style={{
                  marginTop: 10,
                  padding: 15,
                  borderRadius: 20,
                  border: 'none',
                  background: t.text,
                  color: t.bg,
                  cursor: 'pointer'
                }}
              >
                {loadingCreator === c.username ? 'AUTHENTICATING...' : 'VIEW EXCLUSIVE CONTENT'}
              </button>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 80 }}>
          <h2>The 95% Rule.</h2>
          <p style={{ opacity: 0.6 }}>We only take a 5% fee.</p>
          <h3 style={{ color: t.cyan }}>${estimatedEarnings.toLocaleString()}</h3>
        </section>
      </main>
    </div>
  )
}
