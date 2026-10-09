import React, { useState } from 'react'
import { AdminLayout } from '../components/admin/AdminLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useStoreData } from '../store/useStoreData'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/ui/Toast'
import { THEMES_METADATA } from '../lib/mockData'
import { ShieldAlert, UserPlus, Trash2, Check, Store, Palette, Users, FileText } from 'lucide-react'

export function AdminSettingsPage() {
  const { store, updateStore, setTheme, team, inviteTeamMember, removeTeamMember } = useStoreData()
  const { user } = useAuthStore()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('branding') // 'branding' | 'theme' | 'team' | 'homepage'

  // Branding Form State
  const [brandingForm, setBrandingForm] = useState({
    name: store?.name || '',
    tagline: store?.tagline || '',
    logo_url: store?.logo_url || '',
    contact_email: store?.contact_email || '',
    phone: store?.phone || '',
    address: store?.address || ''
  })

  // Team Invite State
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('staff')

  // Check role guard for tenant isolation test (Checkpoint #12)
  if (user?.role === 'staff') {
    return (
      <AdminLayout>
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your current logged-in role is <strong>Staff</strong>. Under tenant security policies, only the <strong>Store Owner</strong> can modify branding, themes, or manage team members.
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
            💡 Tip: Use the top bar <strong>"Role: Staff (Click to switch)"</strong> button to switch back to Owner mode for testing.
          </div>
        </div>
      </AdminLayout>
    )
  }

  const handleSaveBranding = (e) => {
    e.preventDefault()
    updateStore(brandingForm)
    toast.success('Settings Saved', 'Store identity details updated across all public pages.')
  }

  const handleInvite = (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    inviteTeamMember(inviteEmail, inviteRole)
    setInviteEmail('')
    toast.success('Team Member Added', `${inviteEmail} was granted ${inviteRole.toUpperCase()} permissions.`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Store Settings & Customization
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure store identity, change themes, and manage staff access controls.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2">
          {[
            { id: 'branding', label: 'Branding & Info', icon: Store },
            { id: 'theme', label: 'Theme Styling', icon: Palette },
            { id: 'team', label: 'Team & Roles', icon: Users }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TAB 1: BRANDING */}
        {activeTab === 'branding' && (
          <Card className="p-6">
            <form onSubmit={handleSaveBranding} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Store Identity</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Store Name"
                  required
                  value={brandingForm.name}
                  onChange={e => setBrandingForm({ ...brandingForm, name: e.target.value })}
                />
                <Input
                  label="Logo Image URL"
                  value={brandingForm.logo_url}
                  onChange={e => setBrandingForm({ ...brandingForm, logo_url: e.target.value })}
                />
              </div>

              <Input
                label="Store Tagline"
                value={brandingForm.tagline}
                onChange={e => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={brandingForm.contact_email}
                  onChange={e => setBrandingForm({ ...brandingForm, contact_email: e.target.value })}
                />
                <Input
                  label="Support Phone"
                  value={brandingForm.phone}
                  onChange={e => setBrandingForm({ ...brandingForm, phone: e.target.value })}
                />
              </div>

              <Input
                label="Physical Address"
                value={brandingForm.address}
                onChange={e => setBrandingForm({ ...brandingForm, address: e.target.value })}
              />

              <div className="pt-2">
                <Button type="submit" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 2: THEMES */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEMES_METADATA.map((thm) => {
                const isSelected = store?.theme_id === thm.id

                return (
                  <Card
                    key={thm.id}
                    className={`p-5 cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => {
                      setTheme(thm.id)
                      toast.success('Theme Switched!', `Storefront updated to ${thm.name} theme design.`)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{thm.name}</h4>
                      {isSelected ? (
                        <span className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : (
                        <span className="text-[10px] text-indigo-600 font-semibold hover:underline">
                          Select
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{thm.tagline}</p>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Typography: <span className="font-semibold text-slate-900">{thm.font}</span></div>
                      <div>Hero Layout: <span className="font-semibold text-slate-900">{thm.heroStyle}</span></div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TEAM & ROLES */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Invite New Team Member</h3>
              <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@store.com"
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white focus:outline-none"
                >
                  <option value="staff">Staff (Orders & Products only)</option>
                  <option value="owner">Owner (Full Admin Access)</option>
                </select>
                <Button type="submit" size="sm" className="shrink-0">
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> Invite
                </Button>
              </form>
            </Card>

            {/* Team List Table */}
            <Card className="overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Added Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {team.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-4 font-semibold text-slate-900">
                        {m.name} ({m.email})
                      </td>
                      <td className="p-4">
                        <Badge variant={m.role === 'owner' ? 'indigo' : 'default'} size="sm" className="capitalize">
                          {m.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {m.added_at}
                      </td>
                      <td className="p-4 text-right">
                        {m.role !== 'owner' && (
                          <button
                            onClick={() => removeTeamMember(m.id)}
                            className="text-slate-400 hover:text-rose-600"
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
