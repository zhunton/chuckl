import { useState, useCallback, useMemo } from 'react'

// ─── Mock Data ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  'All', 'Reactions', 'Hype', 'Awkward', 'Savage',
  'Confused', 'Relatable', 'Wholesome', 'No Thanks', 'Agreement', 'Shock',
]

const MEME_DATA = [
  { id: 1,  emoji: '😂', label: 'Dead',          category: 'Reactions',  aspect: 'tall',   isGif: true,  stashCount: 14200, trendingScore: 10820, isNew: false },
  { id: 2,  emoji: '🔥', label: 'Lit',           category: 'Hype',       aspect: 'square', isGif: false, stashCount: 8900,  trendingScore: 6480,  isNew: false },
  { id: 3,  emoji: '😬', label: 'Yikes',         category: 'Awkward',    aspect: 'wide',   isGif: true,  stashCount: 5600,  trendingScore: 4150,  isNew: false },
  { id: 4,  emoji: '💀', label: "I'm Dead",      category: 'Savage',     aspect: 'tall',   isGif: true,  stashCount: 11300, trendingScore: 8340,  isNew: false },
  { id: 5,  emoji: '🤔', label: 'Confused',      category: 'Confused',   aspect: 'square', isGif: false, stashCount: 3400,  trendingScore: 2190,  isNew: false },
  { id: 6,  emoji: '😭', label: 'Too Real',      category: 'Relatable',  aspect: 'tall',   isGif: true,  stashCount: 9800,  trendingScore: 7510,  isNew: false },
  { id: 7,  emoji: '🥺', label: 'Please',        category: 'Wholesome',  aspect: 'square', isGif: false, stashCount: 7200,  trendingScore: 5290,  isNew: false },
  { id: 8,  emoji: '🙅', label: 'Hard No',       category: 'No Thanks',  aspect: 'wide',   isGif: true,  stashCount: 4100,  trendingScore: 2870,  isNew: false },
  { id: 9,  emoji: '💯', label: 'Facts',         category: 'Agreement',  aspect: 'square', isGif: false, stashCount: 6700,  trendingScore: 4960,  isNew: false },
  { id: 10, emoji: '😱', label: 'No Way',        category: 'Shock',      aspect: 'tall',   isGif: true,  stashCount: 12800, trendingScore: 11230, isNew: false },
  { id: 11, emoji: '🤣', label: 'Rolling',       category: 'Reactions',  aspect: 'wide',   isGif: true,  stashCount: 10500, trendingScore: 7920,  isNew: false },
  { id: 12, emoji: '🚀', label: "Let's Go",      category: 'Hype',       aspect: 'tall',   isGif: false, stashCount: 7800,  trendingScore: 5600,  isNew: false },
  { id: 13, emoji: '😅', label: 'Awkward...',    category: 'Awkward',    aspect: 'square', isGif: true,  stashCount: 2900,  trendingScore: 1840,  isNew: false },
  { id: 14, emoji: '😤', label: 'Not It',        category: 'Savage',     aspect: 'wide',   isGif: false, stashCount: 1800,  trendingScore: 1050,  isNew: false },
  { id: 15, emoji: '🫠', label: 'Melting',       category: 'Relatable',  aspect: 'tall',   isGif: true,  stashCount: 9100,  trendingScore: 6730,  isNew: false },
  { id: 16, emoji: '🤯', label: 'Mind Blown',    category: 'Shock',      aspect: 'square', isGif: true,  stashCount: 13500, trendingScore: 10180, isNew: false },
  { id: 17, emoji: '🫶', label: 'Big Love',      category: 'Wholesome',  aspect: 'tall',   isGif: false, stashCount: 5300,  trendingScore: 3640,  isNew: false },
  { id: 18, emoji: '🙌', label: 'Agreed',        category: 'Agreement',  aspect: 'wide',   isGif: true,  stashCount: 8400,  trendingScore: 6390,  isNew: false },
  { id: 19, emoji: '😵', label: 'Dizzy',         category: 'Confused',   aspect: 'square', isGif: true,  stashCount: 2200,  trendingScore: 1380,  isNew: false },
  { id: 20, emoji: '🫡', label: 'Understood',    category: 'No Thanks',  aspect: 'tall',   isGif: false, stashCount: 1400,  trendingScore: 820,   isNew: false },
  // New items — discovery window
  { id: 21, emoji: '🫨', label: 'Shaking',       category: 'Reactions',  aspect: 'square', isGif: true,  stashCount: 42,    trendingScore: 390,   isNew: true  },
  { id: 22, emoji: '🥴', label: 'Woozy',         category: 'Relatable',  aspect: 'tall',   isGif: false, stashCount: 18,    trendingScore: 210,   isNew: true  },
  { id: 23, emoji: '🚨', label: 'Red Alert',     category: 'Hype',       aspect: 'wide',   isGif: true,  stashCount: 7,     trendingScore: 520,   isNew: true  },
  { id: 24, emoji: '😮‍💨', label: 'Phew',          category: 'Awkward',    aspect: 'square', isGif: false, stashCount: 31,    trendingScore: 175,   isNew: true  },
  { id: 25, emoji: '🫥', label: 'Ghost Mode',    category: 'No Thanks',  aspect: 'tall',   isGif: true,  stashCount: 5,     trendingScore: 290,   isNew: true  },
]

// Top 12 by trendingScore for Trending page
const TRENDING_DATA = [...MEME_DATA]
  .sort((a, b) => b.trendingScore - a.trendingScore)
  .slice(0, 12)

const FREE_LIMIT = 30

// ─── Helpers ─────────────────────────────────────────────────────────────────
function aspectHeight(aspect) {
  if (aspect === 'tall')   return 200
  if (aspect === 'wide')   return 110
  return 150
}

function getBgColor(emoji) {
  const palette = ['#1a1a1a', '#1c1408', '#0d1a0d', '#1a0d0d', '#0d0d1a', '#1a1a0d', '#0d1a1a']
  const code = emoji.codePointAt(0) || 0
  return palette[code % palette.length]
}

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return `${n}`
}

// ─── Components ──────────────────────────────────────────────────────────────

function Toast({ message, visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      background: '#1e1e1e', color: '#fff', padding: '10px 20px', borderRadius: 24,
      fontSize: 13, fontFamily: 'Space Mono, monospace', whiteSpace: 'nowrap',
      border: '1px solid #333', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      opacity: visible ? 1 : 0, transition: 'all 0.25s ease', zIndex: 1000,
      pointerEvents: 'none',
    }}>
      {message}
    </div>
  )
}

function UpgradeModal({ visible, onUpgrade, onDismiss }) {
  if (!visible) return null
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 900, padding: '0 0 80px',
      }}
      onClick={onDismiss}
    >
      <div
        style={{
          background: '#141414', borderRadius: 20, padding: '28px 24px', width: '100%',
          maxWidth: 400, border: '1px solid #333', boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>📦</div>
        <h2 style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#ff3c00',
          textAlign: 'center', margin: '0 0 8px', letterSpacing: 2,
        }}>Stash Full!</h2>
        <p style={{
          fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#aaa',
          textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6,
        }}>
          Upgrade to Premium for unlimited stash &mdash; $2.99/month
        </p>
        <button
          onClick={onUpgrade}
          style={{
            width: '100%', padding: '14px', background: '#ff3c00', color: '#fff',
            border: 'none', borderRadius: 12, fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 18, letterSpacing: 2, cursor: 'pointer', marginBottom: 10,
          }}
        >UPGRADE</button>
        <button
          onClick={onDismiss}
          style={{
            width: '100%', padding: '12px', background: 'transparent', color: '#666',
            border: '1px solid #333', borderRadius: 12, fontFamily: 'Space Mono, monospace',
            fontSize: 12, cursor: 'pointer',
          }}
        >Not now</button>
      </div>
    </div>
  )
}

function ComingSoonModal({ visible, onClose }) {
  if (!visible) return null
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 950, padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#141414', borderRadius: 20, padding: '36px 24px', textAlign: 'center',
          border: '1px solid #333', maxWidth: 320, width: '100%',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
        <h2 style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#ff3c00',
          margin: '0 0 8px', letterSpacing: 2,
        }}>Coming Soon</h2>
        <p style={{
          fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#888',
          lineHeight: 1.6, margin: '0 0 24px',
        }}>
          Premium is almost ready.<br />We&apos;ll let you know when it launches.
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '12px 32px', background: '#ff3c00', color: '#fff',
            border: 'none', borderRadius: 12, fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 18, letterSpacing: 2, cursor: 'pointer',
          }}
        >GOT IT</button>
      </div>
    </div>
  )
}

function MemeCard({ item, onStash, onCopy, isStashed, rank }) {
  const [hovered, setHovered] = useState(false)
  const h = aspectHeight(item.aspect)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 1200)}
      style={{
        position: 'relative', borderRadius: 12, overflow: 'hidden',
        height: h, background: getBgColor(item.emoji),
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none',
        border: isStashed ? '1px solid rgba(255,60,0,0.4)' : '1px solid transparent',
        transition: 'border 0.2s',
      }}
    >
      <div style={{ fontSize: h > 160 ? 56 : 44, lineHeight: 1 }}>{item.emoji}</div>
      <div style={{
        fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#666',
        marginTop: 8, letterSpacing: 1, textTransform: 'uppercase',
      }}>{item.label}</div>

      {/* GIF badge */}
      {item.isGif && (
        <div style={{
          position: 'absolute', top: 8, left: 8, background: '#ff3c00',
          color: '#fff', fontSize: 9, fontFamily: 'Bebas Neue, sans-serif',
          padding: '2px 6px', borderRadius: 4, letterSpacing: 1,
        }}>GIF</div>
      )}

      {/* Trend rank badge */}
      {rank != null && (
        <div style={{
          position: 'absolute', top: item.isGif ? 28 : 8, left: 8,
          background: '#ff3c00', color: '#fff', fontSize: 9,
          fontFamily: 'Bebas Neue, sans-serif', padding: '2px 6px',
          borderRadius: 4, letterSpacing: 1,
        }}>#{rank}</div>
      )}

      {isStashed && (
        <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 14 }}>📌</div>
      )}

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
      }}>
        <button
          onClick={() => onStash(item)}
          style={{
            padding: '8px 16px', background: isStashed ? '#333' : '#ff3c00',
            color: '#fff', border: 'none', borderRadius: 20,
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 15, letterSpacing: 1,
            cursor: 'pointer', width: 110,
          }}
        >
          {isStashed ? 'STASHED \u2713' : '+STASH'}
        </button>
        <button
          onClick={() => onCopy(item)}
          style={{
            padding: '8px 16px', background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.4)', borderRadius: 20,
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 15, letterSpacing: 1,
            cursor: 'pointer', width: 110,
          }}
        >
          COPY
        </button>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#777',
          letterSpacing: 0.5,
        }}>
          {formatCount(item.stashCount)} stashed
        </div>
      </div>
    </div>
  )
}

function MemeGrid({ items, onStash, onCopy, stashedIds, rankMap }) {
  const col1 = items.filter((_, i) => i % 2 === 0)
  const col2 = items.filter((_, i) => i % 2 === 1)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 12px 12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {col1.map(item => (
          <MemeCard
            key={item.id} item={item} onStash={onStash} onCopy={onCopy}
            isStashed={stashedIds.has(item.id)}
            rank={rankMap ? rankMap[item.id] : undefined}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {col2.map(item => (
          <MemeCard
            key={item.id} item={item} onStash={onStash} onCopy={onCopy}
            isStashed={stashedIds.has(item.id)}
            rank={rankMap ? rankMap[item.id] : undefined}
          />
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      padding: '8px 12px 4px',
      fontFamily: 'Bebas Neue, sans-serif', fontSize: 13, color: '#ff3c00',
      letterSpacing: 3,
    }}>{children}</div>
  )
}

function CategoryChips({ selected, onSelect }) {
  return (
    <div style={{
      display: 'flex', gap: 8, overflowX: 'auto', padding: '0 12px 12px',
      scrollbarWidth: 'none', msOverflowStyle: 'none',
    }}>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            flexShrink: 0, padding: '6px 14px',
            background: selected === cat ? '#ff3c00' : '#1a1a1a',
            color: selected === cat ? '#fff' : '#888',
            border: selected === cat ? 'none' : '1px solid #2a2a2a',
            borderRadius: 20, fontFamily: 'Space Mono, monospace',
            fontSize: 11, cursor: 'pointer', letterSpacing: 0.5,
            transition: 'all 0.15s',
          }}
        >{cat}</button>
      ))}
    </div>
  )
}

const SORT_OPTIONS = [
  { id: 'most-stashed', label: 'Most Stashed' },
  { id: 'trending',     label: 'Trending' },
  { id: 'new',          label: 'New' },
]

function SortChips({ selected, onSelect }) {
  return (
    <div style={{
      display: 'flex', gap: 8, padding: '0 12px 12px',
      scrollbarWidth: 'none', msOverflowStyle: 'none',
    }}>
      {SORT_OPTIONS.map(opt => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          style={{
            flexShrink: 0, padding: '6px 14px',
            background: selected === opt.id ? '#ff3c00' : '#1a1a1a',
            color: selected === opt.id ? '#fff' : '#888',
            border: selected === opt.id ? 'none' : '1px solid #2a2a2a',
            borderRadius: 20, fontFamily: 'Space Mono, monospace',
            fontSize: 11, cursor: 'pointer', letterSpacing: 0.5,
            transition: 'all 0.15s',
          }}
        >{opt.label}</button>
      ))}
    </div>
  )
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function LibraryPage({ onStash, onCopy, stashedIds }) {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('most-stashed')

  const { newItems, mainItems } = useMemo(() => {
    const base = MEME_DATA.filter(m => {
      const matchCat = category === 'All' || m.category === category
      const matchSearch = m.label.toLowerCase().includes(search.toLowerCase()) ||
                          m.category.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })

    if (sort === 'new') {
      return { newItems: [], mainItems: base.filter(m => m.isNew) }
    }

    const newOnes = base.filter(m => m.isNew)
    const rest = base.filter(m => !m.isNew)

    if (sort === 'trending') {
      rest.sort((a, b) => b.trendingScore - a.trendingScore)
    } else {
      // most-stashed
      rest.sort((a, b) => b.stashCount - a.stashCount)
    }

    return { newItems: newOnes, mainItems: rest }
  }, [category, search, sort])

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 12px 8px' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search reactions..."
          style={{
            width: '100%', padding: '10px 16px', background: '#1a1a1a',
            border: '1px solid #2a2a2a', borderRadius: 24, color: '#fff',
            fontFamily: 'Space Mono, monospace', fontSize: 12, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <CategoryChips selected={category} onSelect={setCategory} />
      <SortChips selected={sort} onSelect={setSort} />

      {newItems.length > 0 && (
        <>
          <SectionLabel>🆕 New</SectionLabel>
          <MemeGrid items={newItems} onStash={onStash} onCopy={onCopy} stashedIds={stashedIds} />
        </>
      )}

      {mainItems.length > 0 && (
        <>
          {newItems.length > 0 && (
            <SectionLabel>
              {sort === 'trending' ? '📈 Trending' : '🔥 Most Stashed'}
            </SectionLabel>
          )}
          <MemeGrid items={mainItems} onStash={onStash} onCopy={onCopy} stashedIds={stashedIds} />
        </>
      )}

      {newItems.length === 0 && mainItems.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: 60, gap: 12,
        }}>
          <div style={{ fontSize: 36 }}>🔍</div>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#555', textAlign: 'center',
          }}>No reactions found</div>
        </div>
      )}
    </div>
  )
}

function TrendingPage({ onStash, onCopy, stashedIds }) {
  const rankMap = useMemo(() => {
    const map = {}
    TRENDING_DATA.forEach((item, i) => { map[item.id] = i + 1 })
    return map
  }, [])

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 12px 12px' }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 13, color: '#ff3c00',
          letterSpacing: 3, marginBottom: 4,
        }}>TRENDING THIS WEEK</div>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555',
        }}>Top reactions everyone&apos;s using right now</div>
      </div>
      <MemeGrid
        items={TRENDING_DATA} onStash={onStash} onCopy={onCopy}
        stashedIds={stashedIds} rankMap={rankMap}
      />
    </div>
  )
}

function StashPage({ stashedItems, stashCount, onStash, onCopy, stashedIds }) {
  const gifCount = stashedItems.filter(m => m.isGif).length
  const picCount = stashedItems.filter(m => !m.isGif).length
  const progress = Math.min(stashCount / FREE_LIMIT, 1)
  const nearLimit = stashCount >= FREE_LIMIT - 5

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 12px 0' }}>
        <div style={{
          background: '#141414', borderRadius: 16, padding: '16px',
          border: '1px solid #222', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16 }}>
            {[
              { label: 'SAVED', value: stashCount },
              { label: 'GIFs', value: gifCount },
              { label: 'PICS', value: picCount },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#ff3c00', lineHeight: 1,
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555', letterSpacing: 1,
                }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 6 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'Space Mono, monospace', fontSize: 10,
              color: nearLimit ? '#ff3c00' : '#555', marginBottom: 6,
            }}>
              <span>{stashCount} / {FREE_LIMIT} saved</span>
              <span>{nearLimit ? '\u26a0 Almost full' : 'Free tier'}</span>
            </div>
            <div style={{ height: 4, background: '#2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress * 100}%`,
                background: nearLimit ? '#ff3c00' : '#555',
                borderRadius: 2, transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </div>
      </div>

      {stashedItems.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: 60, gap: 12,
        }}>
          <div style={{ fontSize: 48 }}>📭</div>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: '#444', letterSpacing: 2,
          }}>Your stash is empty</div>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#555', textAlign: 'center',
          }}>Start stashing reactions from Library or Trending</div>
        </div>
      ) : (
        <MemeGrid items={stashedItems} onStash={onStash} onCopy={onCopy} stashedIds={stashedIds} />
      )}
    </div>
  )
}

function AccountPage({ stashCount, onUpgradeClick }) {
  const [notifs, setNotifs] = useState(true)
  const gifCount = Math.floor(stashCount * 0.6)
  const picCount = stashCount - gifCount

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Banner */}
      <div style={{
        height: 120, background: 'linear-gradient(135deg, #1a0800, #ff3c00 200%)',
        position: 'relative', marginBottom: 40,
      }}>
        <div style={{
          position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
          width: 64, height: 64, borderRadius: '50%',
          background: '#1a1a1a', border: '3px solid #ff3c00',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: '#ff3c00',
        }}>WB</div>
      </div>

      <div style={{ textAlign: 'center', padding: '0 24px 24px' }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', letterSpacing: 2,
        }}>wallybot</div>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#555',
        }}>Free tier &middot; Member since 2024</div>
      </div>

      {/* Stash stats */}
      <div style={{ padding: '0 12px 16px' }}>
        <div style={{
          background: '#141414', borderRadius: 16, padding: 16, border: '1px solid #222',
        }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 12, color: '#555',
            letterSpacing: 2, marginBottom: 12,
          }}>STASH STATS</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[
              { label: 'SAVED', value: stashCount },
              { label: 'GIFs', value: gifCount },
              { label: 'PICS', value: picCount },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: 30, color: '#ff3c00', lineHeight: 1,
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555',
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div style={{ padding: '0 12px 16px' }}>
        <button
          onClick={onUpgradeClick}
          style={{
            width: '100%', padding: '16px',
            background: 'linear-gradient(135deg, #cc2e00, #ff3c00)',
            color: '#fff', border: 'none', borderRadius: 16,
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, letterSpacing: 3,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,60,0,0.3)',
          }}
        >
          UPGRADE TO PREMIUM &#x26A1;
        </button>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555',
          textAlign: 'center', marginTop: 8,
        }}>Unlimited stash &middot; $2.99/month</div>
      </div>

      {/* Settings */}
      <div style={{ padding: '0 12px 32px' }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 12, color: '#555',
          letterSpacing: 2, padding: '0 4px 8px',
        }}>SETTINGS</div>
        <div style={{ background: '#141414', borderRadius: 16, border: '1px solid #222', overflow: 'hidden' }}>
          {/* Notifications */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px', borderBottom: '1px solid #1e1e1e',
          }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#ccc' }}>Notifications</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555' }}>Trending alerts &amp; updates</div>
            </div>
            <div
              onClick={() => setNotifs(!notifs)}
              style={{
                width: 44, height: 26, borderRadius: 13,
                background: notifs ? '#ff3c00' : '#333', position: 'relative',
                cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: notifs ? 21 : 3,
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s',
              }} />
            </div>
          </div>

          {/* Dark mode — grayed out, always on */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px', borderBottom: '1px solid #1e1e1e', opacity: 0.4,
          }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#ccc' }}>Dark Mode</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555' }}>Always dark, baby</div>
            </div>
            <div style={{
              width: 44, height: 26, borderRadius: 13, background: '#ff3c00', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 3, left: 21, width: 20, height: 20,
                borderRadius: '50%', background: '#fff',
              }} />
            </div>
          </div>

          {/* Version */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px',
          }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#555' }}>Version</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#444' }}>3.0.0</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const NAV_TABS = [
  { id: 'library',  label: 'Library',  icon: '🗂' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'stash',    label: 'Stash',    icon: '📦' },
  { id: 'account',  label: 'Account',  icon: '👤' },
]

function BottomNav({ active, onChange }) {
  return (
    <div style={{
      display: 'flex', background: '#0e0e0e', borderTop: '1px solid #1e1e1e',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {NAV_TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, padding: '10px 0', background: 'transparent', border: 'none',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3,
            color: active === tab.id ? '#ff3c00' : '#555',
            transition: 'color 0.15s',
          }}
        >
          <span style={{ fontSize: 18 }}>{tab.icon}</span>
          <span style={{
            fontFamily: 'Space Mono, monospace', fontSize: 9,
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('library')
  const [stashedIds, setStashedIds] = useState(new Set())
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [upgradeModal, setUpgradeModal] = useState(false)
  const [comingSoon, setComingSoon] = useState(false)

  const stashedItems = MEME_DATA.filter(m => stashedIds.has(m.id))
  const stashCount = stashedIds.size

  const showToast = useCallback((message) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2500)
  }, [])

  const handleStash = useCallback((item) => {
    setStashedIds(prev => {
      if (prev.has(item.id)) {
        const next = new Set(prev)
        next.delete(item.id)
        showToast('Removed from stash')
        return next
      }
      if (prev.size >= FREE_LIMIT) {
        setUpgradeModal(true)
        return prev
      }
      const next = new Set(prev)
      next.add(item.id)
      showToast('+Stashed! 📦')
      return next
    })
  }, [showToast])

  const handleCopy = useCallback((item) => {
    const url = `https://chuckl.app/r/${item.id}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => showToast('Copied! Ready to paste 📋'))
        .catch(() => showToast('Long press to copy'))
    } else {
      showToast('Long press to copy')
    }
  }, [showToast])

  const handleUpgradeClick = useCallback(() => {
    setUpgradeModal(false)
    setComingSoon(true)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { background: #0a0a0a; color: #fff; overflow: hidden; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder { color: #555; }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 430, margin: '0 auto',
        height: '100dvh', display: 'flex', flexDirection: 'column',
        background: '#0a0a0a', position: 'relative', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 16px 10px', borderBottom: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 28,
            letterSpacing: 4, color: '#fff',
          }}>
            CHUCK<span style={{ color: '#ff3c00' }}>L</span>
          </div>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#444', letterSpacing: 1,
          }}>
            {activeTab === 'library'  && 'BROWSE'}
            {activeTab === 'trending' && 'THIS WEEK'}
            {activeTab === 'stash'    && 'MY STASH'}
            {activeTab === 'account'  && 'ACCOUNT'}
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'library'  && <LibraryPage  onStash={handleStash} onCopy={handleCopy} stashedIds={stashedIds} />}
          {activeTab === 'trending' && <TrendingPage onStash={handleStash} onCopy={handleCopy} stashedIds={stashedIds} />}
          {activeTab === 'stash'    && (
            <StashPage
              stashedItems={stashedItems} stashCount={stashCount}
              onStash={handleStash} onCopy={handleCopy} stashedIds={stashedIds}
            />
          )}
          {activeTab === 'account'  && <AccountPage stashCount={stashCount} onUpgradeClick={handleUpgradeClick} />}
        </div>

        {/* Bottom Nav */}
        <BottomNav active={activeTab} onChange={setActiveTab} />

        {/* Overlays */}
        <Toast message={toast.message} visible={toast.visible} />
        <UpgradeModal
          visible={upgradeModal}
          onUpgrade={handleUpgradeClick}
          onDismiss={() => setUpgradeModal(false)}
        />
        <ComingSoonModal visible={comingSoon} onClose={() => setComingSoon(false)} />
      </div>
    </>
  )
}
