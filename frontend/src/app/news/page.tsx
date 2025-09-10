// ====================================
// frontend/src/app/news/page.tsx
// ====================================
import { Calendar, Clock, Tag, TrendingUp, Award, Users } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchNews() {
  try {
    const res = await fetch(`${API}/news`, { cache: "no-store" });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch {
    // Données de démonstration si l'API n'est pas disponible
    return {
      news: [
        {
          id: '1',
          title: 'TechVision AI Raises €2.5M in Series A Funding',
          excerpt: 'The revolutionary AI startup has secured major funding from leading European VCs to accelerate product development.',
          category: 'Funding',
          date: '2025-09-08',
          image: '/api/placeholder/800/400',
          readTime: '3 min'
        },
        {
          id: '2',
          title: 'GreenEnergy Solutions Wins Innovation Award',
          excerpt: 'Recognized for breakthrough in sustainable energy storage technology at the European CleanTech Summit.',
          category: 'Awards',
          date: '2025-09-07',
          image: '/api/placeholder/800/400',
          readTime: '2 min'
        },
        {
          id: '3',
          title: 'JEB Incubator Partners with Major Investment Fund',
          excerpt: 'New partnership will provide additional €10M funding pool for early-stage startups in the program.',
          category: 'Partnership',
          date: '2025-09-05',
          image: '/api/placeholder/800/400',
          readTime: '4 min'
        },
        {
          id: '4',
          title: 'FinFlow Launches Revolutionary Payment Platform',
          excerpt: 'The fintech startup unveils its B2B payment solution, already adopted by 50+ enterprises.',
          category: 'Launch',
          date: '2025-09-03',
          image: '/api/placeholder/800/400',
          readTime: '5 min'
        },
        {
          id: '5',
          title: 'Summer Cohort Demo Day: Record Attendance',
          excerpt: 'Over 200 investors attended the showcase of 15 promising startups from our summer program.',
          category: 'Events',
          date: '2025-09-01',
          image: '/api/placeholder/800/400',
          readTime: '3 min'
        }
      ]
    };
  }
}

export default async function NewsPage() {
  const { news } = await fetchNews();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Funding': '#F18585',
      'Awards': '#F49C9C',
      'Partnership': '#F6AEAE',
      'Launch': '#D5A8F2',
      'Events': '#CB90F1',
      'default': '#E4BEF8'
    };
    return colors[category] || colors.default;
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Funding': return <TrendingUp size={14} />;
      case 'Awards': return <Award size={14} />;
      case 'Partnership': return <Users size={14} />;
      default: return <Tag size={14} />;
    }
  };

  return (
    <main className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontFamily: 'var(--font-montserrat)',
          marginBottom: 12,
          background: 'linear-gradient(90deg, var(--rose-200), var(--vio-400))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          News & Updates
        </h1>
        <p style={{ opacity: 0.8, fontSize: 18 }}>
          Stay informed about the latest developments, funding rounds, and success stories from our ecosystem
        </p>
      </div>

      {/* Featured News */}
      {news && news.length > 0 && (
        <div className="card" style={{ 
          padding: 0, 
          marginBottom: 32,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(241,133,133,0.1), rgba(203,144,241,0.1))',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            height: 300, 
            background: 'linear-gradient(135deg, var(--rose-200), var(--vio-400))',
            opacity: 0.3
          }}></div>
          <div style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span className="tag" style={{ 
                background: getCategoryColor(news[0].category),
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                {getCategoryIcon(news[0].category)}
                {news[0].category}
              </span>
              <span style={{ fontSize: 14, opacity: 0.7 }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />
                {new Date(news[0].date).toLocaleDateString()}
              </span>
              <span style={{ fontSize: 14, opacity: 0.7 }}>
                <Clock size={14} style={{ display: 'inline', marginRight: 4 }} />
                {news[0].readTime}
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: 16 }}>{news[0].title}</h2>
            <p style={{ fontSize: 18, opacity: 0.9, lineHeight: 1.6, marginBottom: 24 }}>
              {news[0].excerpt}
            </p>
            <button className="button" style={{
              background: 'linear-gradient(90deg, var(--rose-200), var(--vio-400))'
            }}>
              Read Full Article →
            </button>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: 24
      }}>
        {news?.slice(1).map((item: any) => (
          <article key={item.id} className="card news-card" style={{ 
            padding: 0,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}>
            <div style={{ 
              height: 180, 
              background: `linear-gradient(135deg, ${getCategoryColor(item.category)}33, transparent)`,
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}></div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span className="tag" style={{ 
                  background: getCategoryColor(item.category) + '22',
                  color: getCategoryColor(item.category),
                  border: `1px solid ${getCategoryColor(item.category)}44`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12
                }}>
                  {getCategoryIcon(item.category)}
                  {item.category}
                </span>
                <span style={{ fontSize: 12, opacity: 0.6 }}>
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>{item.title}</h3>
              <p style={{ opacity: 0.8, lineHeight: 1.5, marginBottom: 16 }}>
                {item.excerpt}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {item.readTime}
                </span>
                <a href="#" className="button button--ghost" style={{ fontSize: 14 }}>
                  Read more →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .news-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(241,133,133,0.1);
        }
      `}</style>
    </main>
  );
}
