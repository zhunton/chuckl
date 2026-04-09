import { useState, useCallback, useMemo } from 'react'

// ─── Mock Data ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  'All', 'Reactions', 'Hype', 'Awkward', 'Savage',
  'Confused', 'Relatable', 'Wholesome', 'No Thanks', 'Agreement', 'Shock',
]

const MEME_DATA = [
  { id: 1,  emoji: '😂', label: 'Dead',          category: 'Reactions',  aspect: 'tall',   isGif: true,  stashCount: 14200, trendingScore: 10820, isNew: false, daysAgo: 60 },
  { id: 2,  emoji: '🔥', label: 'Lit',           category: 'Hype',       aspect: 'square', isGif: false, stashCount: 8900,  trendingScore: 6480,  isNew: false, daysAgo: 58 },
  { id: 3,  emoji: '😬', label: 'Yikes',         category: 'Awkward',    aspect: 'wide',   isGif: true,  stashCount: 5600,  trendingScore: 4150,  isNew: false, daysAgo: 55 },
  { id: 4,  emoji: '💀', label: "I'm Dead",      category: 'Savage',     aspect: 'tall',   isGif: true,  stashCount: 11300, trendingScore: 8340,  isNew: false, daysAgo: 52 },
  { id: 5,  emoji: '🤔', label: 'Confused',      category: 'Confused',   aspect: 'square', isGif: false, stashCount: 3400,  trendingScore: 2190,  isNew: false, daysAgo: 49 },
  { id: 6,  emoji: '😭', label: 'Too Real',      category: 'Relatable',  aspect: 'tall',   isGif: true,  stashCount: 9800,  trendingScore: 7510,  isNew: false, daysAgo: 46 },
  { id: 7,  emoji: '🥺', label: 'Please',        category: 'Wholesome',  aspect: 'square', isGif: false, stashCount: 7200,  trendingScore: 5290,  isNew: false, daysAgo: 43 },
  { id: 8,  emoji: '🙅', label: 'Hard No',       category: 'No Thanks',  aspect: 'wide',   isGif: true,  stashCount: 4100,  trendingScore: 2870,  isNew: false, daysAgo: 40 },
  { id: 9,  emoji: '💯', label: 'Facts',         category: 'Agreement',  aspect: 'square', isGif: false, stashCount: 6700,  trendingScore: 4960,  isNew: false, daysAgo: 36 },
  { id: 10, emoji: '😱', label: 'No Way',        category: 'Shock',      aspect: 'tall',   isGif: true,  stashCount: 12800, trendingScore: 11230, isNew: false, daysAgo: 32 },
  { id: 11, emoji: '🤣', label: 'Rolling',       category: 'Reactions',  aspect: 'wide',   isGif: true,  stashCount: 10500, trendingScore: 7920,  isNew: false, daysAgo: 28 },
  { id: 12, emoji: '🚀', label: "Let's Go",      category: 'Hype',       aspect: 'tall',   isGif: false, stashCount: 7800,  trendingScore: 5600,  isNew: false, daysAgo: 24 },
  { id: 13, emoji: '😅', label: 'Awkward...',    category: 'Awkward',    aspect: 'square', isGif: true,  stashCount: 2900,  trendingScore: 1840,  isNew: false, daysAgo: 21 },
  { id: 14, emoji: '😤', label: 'Not It',        category: 'Savage',     aspect: 'wide',   isGif: false, stashCount: 1800,  trendingScore: 1050,  isNew: false, daysAgo: 18 },
  { id: 15, emoji: '🫠', label: 'Melting',       category: 'Relatable',  aspect: 'tall',   isGif: true,  stashCount: 9100,  trendingScore: 6730,  isNew: false, daysAgo: 15 },
  { id: 16, emoji: '🤯', label: 'Mind Blown',    category: 'Shock',      aspect: 'square', isGif: true,  stashCount: 13500, trendingScore: 10180, isNew: false, daysAgo: 12 },
  { id: 17, emoji: '🫶', label: 'Big Love',      category: 'Wholesome',  aspect: 'tall',   isGif: false, stashCount: 5300,  trendingScore: 3640,  isNew: false, daysAgo: 10 },
  { id: 18, emoji: '🙌', label: 'Agreed',        category: 'Agreement',  aspect: 'wide',   isGif: true,  stashCount: 8400,  trendingScore: 6390,  isNew: false, daysAgo: 8  },
  { id: 19, emoji: '😵', label: 'Dizzy',         category: 'Confused',   aspect: 'square', isGif: true,  stashCount: 2200,  trendingScore: 1380,  isNew: false, daysAgo: 6  },
  { id: 20, emoji: '🫡', label: 'Understood',    category: 'No Thanks',  aspect: 'tall',   isGif: false, stashCount: 1400,  trendingScore: 820,   isNew: false, daysAgo: 4  },
  // New items — discovery window
  { id: 21, emoji: '🫨', label: 'Shaking',       category: 'Reactions',  aspect: 'square', isGif: true,  stashCount: 42,    trendingScore: 390,   isNew: true,  daysAgo: 3  },
  { id: 22, emoji: '🥴', label: 'Woozy',         category: 'Relatable',  aspect: 'tall',   isGif: false, stashCount: 18,    trendingScore: 210,   isNew: true,  daysAgo: 2  },
  { id: 23, emoji: '🚨', label: 'Red Alert',     category: 'Hype',       aspect: 'wide',   isGif: true,  stashCount: 7,     trendingScore: 520,   isNew: true,  daysAgo: 1  },
  { id: 24, emoji: '😮‍💨', label: 'Phew',          category: 'Awkward',    aspect: 'square', isGif: false, stashCount: 31,    trendingScore: 175,   isNew: true,  daysAgo: 1  },
  { id: 25, emoji: '🫥', label: 'Ghost Mode',    category: 'No Thanks',  aspect: 'tall',   isGif: true,  stashCount: 5,     trendingScore: 290,   isNew: true,  daysAgo: 0  },
]

// Feed: all items newest first
const FEED_DATA = [...MEME_DATA].sort((a, b) => b.id - a.id)

const FREE_LIMIT = 30

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getBgColor(emoji) {
  const palette = ['#1a1a1a', '#1c1408', '#0d1a0d', '#1a0d0d', '#0d0d1a', '#1a1a0d', '#0d1a1a']
  const code = emoji.codePointAt(0) || 0
  return palette[code % palette.length]
}

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return `${n}`
}

function formatDaysAgo(days) {
  if (days === 0) return 'New'
  if (days === 1) return '1d ago'
  if (days < 7)  return `${days}d ago`
  if (days < 14) return '1w ago'
  return `${Math.floor(days / 7)}w ago`
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

function SettingsModal({ visible, onClose, onUpgradeClick }) {
  const [notifs, setNotifs] = useState(true)
  if (!visible) return null
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 920, padding: '0 0 80px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#141414', borderRadius: 20, padding: '24px', width: '100%',
          maxWidth: 430, border: '1px solid #222', boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, color: '#ff3c00',
          letterSpacing: 3, marginBottom: 16,
        }}>SETTINGS</div>

        <div style={{ background: '#1a1a1a', borderRadius: 12, border: '1px solid #222', overflow: 'hidden', marginBottom: 16 }}>
          {/* Notifications */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 16px', borderBottom: '1px solid #222',
          }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#ccc' }}>Notifications</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555' }}>Trending alerts &amp; updates</div>
            </div>
            <div
              onClick={() => setNotifs(v => !v)}
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
            padding: '14px 16px', opacity: 0.4,
          }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#ccc' }}>Dark Mode</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555' }}>Always dark, baby</div>
            </div>
            <div style={{ width: 44, height: 26, borderRadius: 13, background: '#ff3c00', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 3, left: 21, width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
            </div>
          </div>
        </div>

        <button
          onClick={onUpgradeClick}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #cc2e00, #ff3c00)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 2,
            cursor: 'pointer', marginBottom: 10,
          }}
        >UPGRADE TO PREMIUM &#x26A1; — $2.99/month</button>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px', background: 'transparent', color: '#555',
            border: '1px solid #2a2a2a', borderRadius: 12, fontFamily: 'Space Mono, monospace',
            fontSize: 11, cursor: 'pointer',
          }}
        >Close</button>
      </div>
    </div>
  )
}

function MemeCard({ item, onStash, onCopy, isStashed, showTimestamp }) {
  return (
    <div
      style={{
        position: 'relative', borderRadius: 8, overflow: 'hidden',
        aspectRatio: '4 / 3', background: getBgColor(item.emoji),
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        userSelect: 'none',
        border: isStashed ? '1px solid rgba(255,60,0,0.4)' : '1px solid transparent',
        transition: 'border 0.2s',
      }}
    >
      <div style={{ fontSize: 64, lineHeight: 1 }}>{item.emoji}</div>
      <div style={{
        fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#666',
        marginTop: 8, letterSpacing: 1, textTransform: 'uppercase',
        paddingBottom: 44,
      }}>{item.label}</div>

      {/* GIF badge */}
      {item.isGif && (
        <div style={{
          position: 'absolute', top: 8, left: 8, background: '#ff3c00',
          color: '#fff', fontSize: 9, fontFamily: 'Bebas Neue, sans-serif',
          padding: '2px 6px', borderRadius: 4, letterSpacing: 1,
        }}>GIF</div>
      )}

      {/* Timestamp badge — top right */}
      {showTimestamp && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: item.daysAgo === 0 ? '#ff3c00' : 'rgba(0,0,0,0.6)',
          color: item.daysAgo === 0 ? '#fff' : '#aaa',
          fontSize: 9, fontFamily: 'Space Mono, monospace',
          padding: '2px 7px', borderRadius: 4, letterSpacing: 0.5,
          border: item.daysAgo === 0 ? 'none' : '1px solid #333',
        }}>{formatDaysAgo(item.daysAgo)}</div>
      )}

      {/* Persistent bottom strip — always visible, mobile-friendly */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 44, background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6,
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#999',
          flexShrink: 1, minWidth: 0,
        }}>{item.label}</div>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#666',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>{formatCount(item.stashCount)}</div>
        <div style={{ flex: 1 }} />
        <button
          onClick={e => { e.stopPropagation(); onStash(item) }}
          style={{
            height: 28, minWidth: 60, padding: '0 8px',
            background: isStashed ? '#333' : '#ff3c00',
            color: '#fff', border: 'none', borderRadius: 14,
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 8, letterSpacing: 1,
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          {isStashed ? '\u2713' : 'STASH'}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onCopy(item) }}
          style={{
            height: 28, minWidth: 60, padding: '0 8px',
            background: '#1a1a1a', color: '#ccc',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14,
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 8, letterSpacing: 1,
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          COPY
        </button>
      </div>
    </div>
  )
}

function MemeGrid({ items, onStash, onCopy, stashedIds, showTimestamp }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 12px 12px' }}>
      {items.map(item => (
        <MemeCard
          key={item.id} item={item} onStash={onStash} onCopy={onCopy}
          isStashed={stashedIds.has(item.id)}
          showTimestamp={showTimestamp}
        />
      ))}
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

function FeedPage({ onStash, onCopy, stashedIds }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '12px 12px 4px' }}>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555', letterSpacing: 1,
        }}>Recently added reactions, newest first</div>
      </div>
      <MemeGrid
        items={FEED_DATA} onStash={onStash} onCopy={onCopy}
        stashedIds={stashedIds} showTimestamp
      />
    </div>
  )
}

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

function ProfilePage({ stashedItems, stashCount, stashedIds, onStash, onCopy, onUpgradeClick }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const gifCount = stashedItems.filter(m => m.isGif).length
  const picCount = stashedItems.filter(m => !m.isGif).length
  const progress = Math.min(stashCount / FREE_LIMIT, 1)
  const nearLimit = stashCount >= FREE_LIMIT - 5

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Banner + avatar */}
      <div style={{
        height: 120, background: 'linear-gradient(135deg, #1a0800, #ff3c00 200%)',
        position: 'relative', marginBottom: 40,
      }}>
        {/* Gear icon — top right */}
        <button
          onClick={() => setSettingsOpen(true)}
          style={{
            position: 'absolute', top: 12, right: 14,
            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', fontSize: 16,
          }}
          title="Settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        <div style={{
          position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
          width: 64, height: 64, borderRadius: '50%',
          background: '#1a1a1a', border: '3px solid #ff3c00',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: '#ff3c00',
        }}>WB</div>
      </div>

      {/* Username */}
      <div style={{ textAlign: 'center', padding: '0 24px 24px' }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', letterSpacing: 2,
        }}>wallybot</div>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#555',
        }}>Free tier &middot; Member since 2024</div>
      </div>

      {/* MY STASH section */}
      <div style={{ padding: '0 12px 8px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 10,
        }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 13, color: '#ff3c00',
            letterSpacing: 3,
          }}>MY STASH</div>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 10,
            color: nearLimit ? '#ff3c00' : '#555',
          }}>{stashCount} / {FREE_LIMIT} saved {nearLimit ? '⚠' : ''}</div>
        </div>

        {/* Stash stats + progress */}
        <div style={{
          background: '#141414', borderRadius: 16, padding: '14px 16px',
          border: '1px solid #222', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 12 }}>
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
                  fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555', letterSpacing: 1,
                }}>{stat.label}</div>
              </div>
            ))}
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
          }}>Stash reactions from Feed or Library</div>
        </div>
      ) : (
        <MemeGrid items={stashedItems} onStash={onStash} onCopy={onCopy} stashedIds={stashedIds} />
      )}

      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onUpgradeClick={() => { setSettingsOpen(false); onUpgradeClick() }}
      />
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

// SVG icons rendered inline for crispness
function IconFeed({ active }) {
  const c = active ? '#ff3c00' : '#555'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

function IconLibrary({ active }) {
  const c = active ? '#ff3c00' : '#555'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/>
      <line x1="9" y1="3" x2="9" y2="21"/>
    </svg>
  )
}

function IconProfile({ active }) {
  const c = active ? '#ff3c00' : '#555'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )
}

const NAV_TABS = [
  { id: 'feed',    label: 'Feed' },
  { id: 'library', label: 'Library' },
  { id: 'profile', label: 'Profile' },
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
          {tab.id === 'feed'    && <IconFeed    active={active === tab.id} />}
          {tab.id === 'library' && <IconLibrary active={active === tab.id} />}
          {tab.id === 'profile' && <IconProfile active={active === tab.id} />}
          <span style={{
            fontFamily: 'Space Mono, monospace', fontSize: 9,
            letterSpacing: 0.5, textTransform: 'uppercase',
            color: active === tab.id ? '#ff3c00' : '#555',
          }}>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('feed')
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

  const headerLabel = {
    feed:    'FRESH',
    library: 'BROWSE',
    profile: 'PROFILE',
  }[activeTab]

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
            {headerLabel}
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'feed' && (
            <FeedPage onStash={handleStash} onCopy={handleCopy} stashedIds={stashedIds} />
          )}
          {activeTab === 'library' && (
            <LibraryPage onStash={handleStash} onCopy={handleCopy} stashedIds={stashedIds} />
          )}
          {activeTab === 'profile' && (
            <ProfilePage
              stashedItems={stashedItems} stashCount={stashCount}
              stashedIds={stashedIds} onStash={handleStash} onCopy={handleCopy}
              onUpgradeClick={handleUpgradeClick}
            />
          )}
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
