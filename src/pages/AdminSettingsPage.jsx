import React, { useState, useRef } from 'react'
import { AdminLayout } from '../components/admin/AdminLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useStoreData } from '../store/useStoreData'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/ui/Toast'
import { THEMES_METADATA } from '../lib/mockData'
import { api } from '../lib/api'
import { ShieldAlert, UserPlus, Trash2, Check, Store, Palette, Users, Image, RefreshCw } from 'lucide-react'
import { LivePhonePreview } from '../components/wizard/LivePhonePreview'
import { cn } from '../lib/utils'

const TABS = [
  { id: 'branding', label: 'Branding & Info', icon: Store },
  { id: 'theme',    label: 'Theme & Styles',  icon: Palette },
  { id: 'team',     label: 'Team & Roles',    icon: Users },
]

// Inline logo uploader (reused from WizardPage pattern)
function LogoUpload({ value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const toast = useToast()
  const handleFile = async (file) => {
    setUploading(true)
    try {
      const url = await api.uploadImage(file)
      onChange(url)
    } catch (err) {
      toast.error('Upload failed', err.message)
    } finally {
      setUploading(false)
    }
  }
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-[var(--sc-ink)] uppercase tracking-wide">Business Logo</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="clay-card p-4 flex items-center gap-4 cursor-pointer hover:border-brand/50 transition-colors"
      >
        {value ? (
          <img src={value} alt="Logo" className="h-12 max-w-[100px] object-contain rounded-lg" />
        ) : (
          <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
            <Image className="h-5 w-5" />
          </div>
        )}
        <div className="text-xs text-[var(--sc-muted)]">
          {uploading ? 'Uploading…' : value ? 'Click to replace logo' : 'Click to upload your business logo'}
          <p className="text-[10px] mt-0.5">JPEG, PNG, WebP — max 5 MB</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }}
      />
      {value && (
        <button onClick={() => onChange('')} className="text-[10px] text-[var(--sc-muted)] hover:text-[var(--sc-danger)]">
          Remove logo
        </button>
      )}
    </div>
  )
}

export function AdminSettingsPage() {
  const { store, updateStore, setTheme, team, inviteTeamMember, removeTeamMember, products } = useStoreData()
  const { user } = useAuthStore()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('branding')

  const [brandingForm, setBrandingForm] = useState({
    name:          store?.name          || '',
    tagline:       store?.tagline       || '',
    logo_url:      store?.logo_url      || '',
    contact_email: store?.contact_email || '',
    phone:         store?.phone         || '',
    address:       store?.address       || '',
  })

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole,  setInviteRole]  = useState('staff')
  const [previewPage, setPreviewPage] = useState('home')

  // Guard: Staff cannot access settings
  if (user?.role === 'staff') {
    return (
      <AdminLayout>
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-[var(--sc-danger-bg)] text-[var(--sc-danger)] flex items-center justify-center mx-auto">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-poppins font-bold text-brand">Access Restricted</h2>
          <p className="text-xs text-[var(--sc-muted)] leading-relaxed">
            Your role is <strong>Staff</strong>. Only the <strong>Store Owner</strong> can modify branding, themes, or manage team members.
          </p>
          <div className="p-3 bg-[var(--sc-warning-bg)] rounded-xl border border-amber-200 text-xs text-[var(--sc-warning)]">
            Use the top bar <strong>"Role: Staff · switch"</strong> button to switch back to Owner mode.
          </div>
        </div>
      </AdminLayout>
    )
  }

  const handleSaveBranding = (e) => {
    e.preventDefault()
    updateStore(brandingForm)
    toast.success('Settings Saved', 'Store identity updated across all public pages.')
  }

  const handleInvite = (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    inviteTeamMember(inviteEmail, inviteRole)
    setInviteEmail('')
    toast.success('Team Member Added', `${inviteEmail} granted ${inviteRole.toUpperCase()} permissions.`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">

        {/* Page header */}
        <div>
          <h1 className="font-poppins text-xl font-bold text-brand">Store Settings</h1>
          <p className="text-xs text-[var(--sc-muted)] mt-0.5">
            Configure store identity, theme, and team access.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-champagne-border gap-1">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all min-h-[44px]',
                  isActive
                    ? 'border-brand text-brand'
                    : 'border-transparent text-[var(--sc-muted)] hover:text-brand'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TAB 1: BRANDING */}
        {activeTab === 'branding' && (
          <Card className="p-6">
            <form onSubmit={handleSaveBranding} className="space-y-5">
              <h3 className="font-poppins font-semibold text-sm text-brand">Store Identity</h3>

              {/* Logo upload */}
              <LogoUpload
                value={brandingForm.logo_url}
                onChange={url => setBrandingForm(f => ({ ...f, logo_url: url }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Store Name"
                  required
                  value={brandingForm.name}
                  onChange={e => setBrandingForm(f => ({ ...f, name: e.target.value }))}
                />
                <Input
                  label="Store Tagline"
                  value={brandingForm.tagline}
                  onChange={e => setBrandingForm(f => ({ ...f, tagline: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={brandingForm.contact_email}
                  onChange={e => setBrandingForm(f => ({ ...f, contact_email: e.target.value }))}
                />
                <Input
                  label="Support Phone"
                  value={brandingForm.phone}
                  onChange={e => setBrandingForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <Input
                label="Physical Address"
                value={brandingForm.address}
                onChange={e => setBrandingForm(f => ({ ...f, address: e.target.value }))}
              />

              <div className="pt-2">
                <Button type="submit" size="sm">Save Changes</Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 2: THEME */}
        {activeTab === 'theme' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Theme selector */}
            <div className="w-full lg:w-[380px] space-y-4 flex-shrink-0">
              <Card className="p-5 space-y-3">
                <h3 className="font-poppins font-semibold text-sm text-brand">Storefront Theme</h3>
                <p className="text-xs text-[var(--sc-muted)]">
                  Changing the theme here applies it immediately to your live store. For fine-grained colour and font overrides, use the wizard Theme step.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEMES_METADATA.map((thm) => {
                    const isSelected = store?.theme_id === thm.id
                    return (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => {
                          setTheme(thm.id)
                          toast.success('Theme Applied', `Storefront switched to ${thm.name}.`)
                        }}
                        className={cn(
                          'p-4 rounded-2xl border-2 text-left transition-all space-y-1.5 min-h-[44px]',
                          isSelected
                            ? 'border-brand bg-brand/8 shadow-clay'
                            : 'border-champagne-border bg-champagne-card hover:border-brand/30'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className={cn('text-sm font-bold', isSelected ? 'text-brand' : 'text-[var(--sc-ink)]')}>
                            {thm.name}
                          </h4>
                          {isSelected && (
                            <span className="h-5 w-5 rounded-full bg-brand text-champagne flex items-center justify-center">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--sc-muted)]">{thm.tagline}</p>
                        <div className="text-[10px] text-[var(--sc-muted)] space-y-0.5">
                          <div>Font: <span className="font-semibold text-[var(--sc-ink)]">{thm.font}</span></div>
                          <div>Layout: <span className="font-semibold text-[var(--sc-ink)]">{thm.heroStyle}</span></div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Live preview */}
            <div className="flex-1 flex flex-col items-center gap-3 sticky top-24">
              <div className="flex gap-1 bg-champagne-card border border-champagne-border rounded-xl p-1">
                {['home', 'product', 'cart'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPreviewPage(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize min-h-[36px]',
                      previewPage === p ? 'bg-brand text-champagne' : 'text-[var(--sc-muted)] hover:text-brand'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[var(--sc-muted)] uppercase tracking-wider">Live Preview</span>
              <LivePhonePreview
                themeId={store?.theme_id || 'minimal'}
                storeName={store?.name}
                tagline={store?.tagline}
                categoryNames={[]}
                themeOverrides={store?.theme_overrides || {}}
                previewPage={previewPage}
                logoUrl={store?.logo_url || brandingForm.logo_url}
                products={products}
                currency={store?.currency || 'INR'}
              />
            </div>
          </div>
        )}

        {/* TAB 3: TEAM */}
        {activeTab === 'team' && (
          <div className="space-y-5">
            <Card className="p-6 space-y-4">
              <h3 className="font-poppins font-semibold text-sm text-brand">Invite Team Member</h3>
              <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@store.com"
                  className="clay-input flex-1 px-3.5 py-2.5 text-xs min-h-[44px]"
                />
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="clay-input px-3 py-2 text-xs min-h-[44px]"
                >
                  <option value="staff">Staff (Orders & Products)</option>
                  <option value="owner">Owner (Full Access)</option>
                </select>
                <Button type="submit" size="sm" className="shrink-0">
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> Invite
                </Button>
              </form>
            </Card>

            <Card className="overflow-hidden">
              <table className="w-full text-left text-xs text-[var(--sc-muted)]">
                <thead className="bg-champagne border-b border-champagne-border text-[10px] font-bold uppercase tracking-wider text-brand">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Added</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-champagne-border">
                  {team.map((m) => (
                    <tr key={m.id} className="hover:bg-champagne-card transition-colors">
                      <td className="p-4 font-semibold text-[var(--sc-ink)]">
                        {m.name} <span className="text-[var(--sc-muted)] font-normal">({m.email})</span>
                      </td>
                      <td className="p-4">
                        <Badge variant={m.role === 'owner' ? 'indigo' : 'default'} size="sm" className="capitalize">
                          {m.role}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-[11px]">{m.added_at}</td>
                      <td className="p-4 text-right">
                        {m.role !== 'owner' && (
                          <button
                            onClick={() => removeTeamMember(m.id)}
                            className="text-[var(--sc-muted)] hover:text-[var(--sc-danger)] transition-colors p-1.5 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Remove Staff Access"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
