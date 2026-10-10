import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts'
import {
  Globe, Store, Users, TrendingUp, ExternalLink, ArrowRight,
  ShieldCheck, LayoutDashboard, PlusCircle, CheckCircle2, Search
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useAuthStore } from '../store/useAuthStore'
import { useStoreData } from '../store/useStoreData'

const STORE_NICHE_PIE_DATA = [
  { name: 'Coffee & Specialty Roasteries', value: 28, color: '#064E3B' },
  { name: 'Fashion & Streetwear Apparel', value: 24, color: '#0D9488' },
  { name: 'Ceramics & Handcrafted Decor', value: 20, color: '#B45309' },
  { name: 'Botanical Skincare & Wellness', value: 16, color: '#E11D48' },
  { name: 'Workspace Gear & Hardware', value: 12, color: '#8B5CF6' }
]

const SAMPLE_BUILT_WEBSITES = [
  {
    id: 'site-1',
    businessName: 'Velvet Roast Coffee Co.',
    niche: 'Coffee & Beverages',
    ownerName: 'Vikram Mehta',
    ownerEmail: 'vikram@velvetroast.in',
    slug: 'velvet-roast',
    productsCount: 16,
    createdDate: '2026-10-08',
    status: 'Live',
    theme: 'Emerald & Champagne'
  },
  {
    id: 'site-2',
    businessName: 'Terra Clay Studio',
    niche: 'Ceramics & Decor',
    ownerName: 'Ananya Sen',
    ownerEmail: 'ananya@terraclay.com',
    slug: 'terra-clay',
    productsCount: 22,
    createdDate: '2026-10-07',
    status: 'Live',
    theme: 'Sunset Amber & Espresso'
  },
  {
    id: 'site-3',
    businessName: 'Kinetics Streetwear',
    niche: 'Fashion & Apparel',
    ownerName: 'Rohan Verma',
    ownerEmail: 'rohan@kinetics.style',
    slug: 'kinetics-streetwear',
    productsCount: 34,
    createdDate: '2026-10-06',
    status: 'Live',
    theme: 'Midnight Teal & Violet'
  },
  {
    id: 'site-4',
    businessName: 'Lumina Botanical Skincare',
    niche: 'Skincare & Wellness',
    ownerName: 'Dr. Neha Kapoor',
    ownerEmail: 'neha@luminaskin.co',
    slug: 'lumina-botanicals',
    productsCount: 12,
    createdDate: '2026-10-04',
    status: 'Live',
    theme: 'Rose Gold & Obsidian'
  },
  {
    id: 'site-5',
    businessName: 'KeebWorks Mechanical Lab',
    niche: 'Workspace Hardware',
    ownerName: 'Arjun Das',
    ownerEmail: 'arjun@keebworks.tech',
    slug: 'keebworks',
    productsCount: 19,
    createdDate: '2026-10-02',
    status: 'Live',
    theme: 'Midnight Teal & Violet'
  }
]

export function PlatformOwnerDashboardPage() {
  const { user, users, logout } = useAuthStore()
  const { store } = useStoreData()
  const [searchFilter, setSearchFilter] = useState('')

  // Include current active store if created
  const allWebsites = React.useMemo(() => {
    const list = [...SAMPLE_BUILT_WEBSITES]
    if (store && store.slug && !list.some(s => s.slug === store.slug)) {
      list.unshift({
        id: `site-active-${store.slug}`,
        businessName: store.name || 'Your Live Store',
        niche: store.business_type || 'Artisanal Retail',
        ownerName: user?.name || 'Administrator',
        ownerEmail: user?.email || 'admin@storekraft.com',
        slug: store.slug,
        productsCount: 8,
        createdDate: 'Today',
        status: 'Live',
        theme: store.theme_id?.toUpperCase() || 'Emerald'
      })
    }
    return list
  }, [store, user])

  const filteredSites = allWebsites.filter(s =>
    s.businessName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.niche.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.ownerEmail.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--sc-champagne)' }}>

      {/* ── Top Bar ────────────────────────────────────────── */}
      <header className="bg-brand text-champagne border-b border-brand/20 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-champagne text-brand font-black flex items-center justify-center text-sm shadow-sm">
              SK
            </div>
            <div>
              <span className="font-poppins font-bold text-sm tracking-tight text-champagne block leading-tight">
                StoreKraft Owner Console
              </span>
              <span className="text-[10px] text-champagne/60 font-mono">Platform Website Intelligence</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard">
            <Button size="sm" variant="secondary" className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-champagne border-white/20">
              <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
              Switch to User/Merchant Portal
            </Button>
          </Link>

          <Link to="/">
            <Button size="sm" variant="ghost" className="text-xs text-champagne/80 hover:text-champagne">
              StoreKraft Home
            </Button>
          </Link>

          <button
            onClick={logout}
            className="text-xs text-champagne/60 hover:text-champagne underline transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* Title and Scope Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-poppins font-bold text-2xl text-brand">Platform Owner Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand text-champagne uppercase tracking-wider">
                Website Owner
              </span>
            </div>
            <p className="text-xs text-[var(--sc-muted)] mt-1">
              Global statistics about websites built across StoreKraft, category market share, and merchant businesses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/onboarding">
              <Button size="sm" className="text-xs font-bold">
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Build New Website
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Primary Platform KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--sc-muted)]">
              <span>Total Websites Built</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-brand flex items-center justify-center">
                <Globe className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-brand font-poppins">
              {allWebsites.length + 18}
            </div>
            <p className="text-[11px] text-emerald-800 font-medium">
              +14% new store launches this month
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--sc-muted)]">
              <span>Active Live Stores</span>
              <div className="h-8 w-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <Store className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-brand font-poppins">
              {allWebsites.length + 12}
            </div>
            <p className="text-[11px] text-[var(--sc-muted)]">
              98.4% uptime across public storefronts
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--sc-muted)]">
              <span>Merchant Accounts</span>
              <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-brand font-poppins">
              {(users || []).length + 20}
            </div>
            <p className="text-[11px] text-[var(--sc-muted)]">
              Registered business owners
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--sc-muted)]">
              <span>Platform GMV</span>
              <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-brand font-poppins">
              ₹14.85 L
            </div>
            <p className="text-[11px] text-[var(--sc-muted)]">
              Cumulative gross transaction volume
            </p>
          </Card>
        </div>

        {/* ── Pie Chart & Niche Distribution ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Interactive Pie Chart */}
          <div className="lg:col-span-7">
            <Card className="p-6 space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-champagne-border pb-3">
                  <div>
                    <h3 className="font-poppins font-bold text-base text-brand">
                      Website Niche & Category Market Share
                    </h3>
                    <p className="text-xs text-[var(--sc-muted)]">
                      Distribution of commercial website types created on StoreKraft
                    </p>
                  </div>
                  <span className="text-xs font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-full">
                    Real-time
                  </span>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={STORE_NICHE_PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {STORE_NICHE_PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--sc-card)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name) => [`${val}% of all websites`, name]}
                        contentStyle={{
                          background: 'var(--sc-card)',
                          borderRadius: '12px',
                          border: '1px solid var(--sc-border)',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-champagne-border text-[11px]">
                {STORE_NICHE_PIE_DATA.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-[var(--sc-muted)] truncate">{item.name}:</span>
                    <strong className="text-brand">{item.value}%</strong>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Platform Insights */}
          <div className="lg:col-span-5">
            <Card className="p-6 space-y-4 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-poppins font-bold text-base text-brand border-b border-champagne-border pb-3">
                  Website Growth Summary
                </h3>
                <div className="space-y-4 pt-3 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-champagne-card/60 border border-champagne-border space-y-1">
                    <span className="font-bold text-brand block">Leading Sector: Artisanal Coffee & Food</span>
                    <p className="text-[var(--sc-muted)]">
                      Coffee shops and boutique food brands represent 28% of total websites created, with highest average cart conversion rates.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-champagne-card/60 border border-champagne-border space-y-1">
                    <span className="font-bold text-brand block">Fastest Growing: Ceramic & Living Goods</span>
                    <p className="text-[var(--sc-muted)]">
                      Handcrafted home decor and ceramics have grown +38% month-over-month utilizing StoreKraft's multi-color theme customizer.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-champagne-card/60 border border-champagne-border space-y-1">
                    <span className="font-bold text-brand block">Mobile Shopping Optimization</span>
                    <p className="text-[var(--sc-muted)]">
                      Over 84% of merchants utilized the mobile button positioning tool to position sticky footer or floating shopping CTAs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-champagne-border">
                <Link to="/admin/dashboard" className="w-full flex items-center justify-center py-2.5 rounded-xl bg-brand text-champagne text-xs font-bold hover:bg-brand/90 transition-all">
                  Open Store Merchant Console <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* ── Details of Businesses Who Built Websites ─────── */}
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-champagne-border pb-3">
            <div>
              <h2 className="font-poppins font-bold text-base text-brand">
                Directory of Businesses & Stores Built on StoreKraft
              </h2>
              <p className="text-xs text-[var(--sc-muted)]">
                Detailed registry of active businesses, site owners, and published stores
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--sc-muted)]" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search business or niche…"
                className="clay-input w-full pl-9 pr-3 py-1.5 text-xs min-h-[36px]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-champagne-border text-[var(--sc-muted)] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Business / Store</th>
                  <th className="py-2.5 px-3">Industry Niche</th>
                  <th className="py-2.5 px-3">Merchant Owner</th>
                  <th className="py-2.5 px-3">Catalog Size</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-champagne-border">
                {filteredSites.map((site) => (
                  <tr key={site.id} className="hover:bg-champagne-card/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-brand">{site.businessName}</div>
                      <div className="text-[10px] text-[var(--sc-muted)] font-mono">/s/{site.slug}</div>
                    </td>
                    <td className="py-3 px-3 text-[var(--sc-muted)]">
                      <span className="px-2 py-0.5 rounded-md bg-brand/10 text-brand font-medium text-[11px]">
                        {site.niche}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-brand">{site.ownerName}</div>
                      <div className="text-[10px] text-[var(--sc-muted)]">{site.ownerEmail}</div>
                    </td>
                    <td className="py-3 px-3 text-[var(--sc-muted)] font-medium">
                      {site.productsCount} products
                    </td>
                    <td className="py-3 px-3 text-[var(--sc-muted)]">
                      {site.createdDate}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Live
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/s/${site.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-champagne-border bg-white text-brand hover:border-brand transition-colors text-[11px] font-semibold"
                      >
                        Visit Store <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
