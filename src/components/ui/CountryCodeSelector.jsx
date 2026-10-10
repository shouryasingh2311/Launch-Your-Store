import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export const COUNTRIES = [
  { iso: 'in', code: '+91',  name: 'India' },
  { iso: 'us', code: '+1',   name: 'United States' },
  { iso: 'gb', code: '+44',  name: 'United Kingdom' },
  { iso: 'ae', code: '+971', name: 'United Arab Emirates' },
  { iso: 'ca', code: '+1',   name: 'Canada' },
  { iso: 'au', code: '+61',  name: 'Australia' },
  { iso: 'sg', code: '+65',  name: 'Singapore' },
  { iso: 'de', code: '+49',  name: 'Germany' },
  { iso: 'fr', code: '+33',  name: 'France' },
  { iso: 'jp', code: '+81',  name: 'Japan' },
  { iso: 'sa', code: '+966', name: 'Saudi Arabia' },
  { iso: 'br', code: '+55',  name: 'Brazil' },
  { iso: 'za', code: '+27',  name: 'South Africa' },
  { iso: 'it', code: '+39',  name: 'Italy' },
  { iso: 'es', code: '+34',  name: 'Spain' },
  { iso: 'nl', code: '+31',  name: 'Netherlands' },
]

export function CountryCodeSelector({
  value = '+91',
  onChange,
  className
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)

  const selectedCountry = COUNTRIES.find(c => c.code === value) || COUNTRIES[0]

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search)
  )

  return (
    <div className={cn("relative h-11", className)} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="clay-input w-full h-11 flex items-center justify-between gap-1.5 px-2.5 text-sm cursor-pointer hover:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <img
            src={`https://flagcdn.com/w40/${selectedCountry.iso}.png`}
            alt={selectedCountry.name}
            className="w-5 h-3.5 object-cover rounded-[2px] shadow-xs flex-shrink-0"
            loading="eager"
          />
          <span className="font-semibold text-xs text-[var(--sc-ink)]">
            {selectedCountry.code}
          </span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-[var(--sc-muted)] flex-shrink-0 ml-0.5" />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-64 clay-card p-2 shadow-2xl z-50 bg-white border border-champagne-border rounded-2xl animate-in fade-in-50 zoom-in-95">
          {/* Search box */}
          <div className="relative mb-2">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--sc-muted)]" />
            <input
              type="text"
              placeholder="Search country or code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="clay-input w-full pl-8 pr-3 py-1.5 text-xs bg-brand/5 border-champagne-border min-h-[34px] rounded-lg"
              autoFocus
            />
          </div>

          {/* Country list */}
          <div className="max-h-52 overflow-y-auto space-y-0.5 text-xs">
            {filteredCountries.length > 0 ? (
              filteredCountries.map(c => {
                const isSelected = c.code === value && c.iso === selectedCountry.iso
                return (
                  <button
                    key={`${c.iso}-${c.code}`}
                    type="button"
                    onClick={() => {
                      onChange?.(c.code)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors min-h-[34px]",
                      isSelected ? "bg-brand text-champagne font-semibold" : "hover:bg-brand/10 text-[var(--sc-ink)]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={`https://flagcdn.com/w40/${c.iso}.png`}
                        alt={c.name}
                        className="w-5 h-3.5 object-cover rounded-[2px] shadow-xs flex-shrink-0"
                      />
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className={cn("text-[11px] font-mono ml-2", isSelected ? "text-champagne" : "text-[var(--sc-muted)]")}>
                      {c.code}
                    </span>
                  </button>
                )
              })
            ) : (
              <p className="text-center py-3 text-xs text-[var(--sc-muted)]">No country matched</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
