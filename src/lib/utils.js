import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

import { useStoreData } from '../store/useStoreData'

export const CURRENCY_CONFIG = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee (INR ₹)' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar (USD $)' },
  EUR: { code: 'EUR', symbol: '€', locale: 'en-IE', name: 'Euro (EUR €)' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound (GBP £)' },
  AED: { code: 'AED', symbol: 'AED', locale: 'en-AE', name: 'UAE Dirham (AED)' },
  CAD: { code: 'CAD', symbol: 'CA$', locale: 'en-CA', name: 'Canadian Dollar (CAD $)' },
  AUD: { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar (AUD $)' },
  JPY: { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen (JPY ¥)' },
}

export function getActiveCurrency() {
  try {
    return useStoreData?.getState?.()?.store?.currency || 'INR'
  } catch {
    return 'INR'
  }
}

export function formatCurrency(amount, currencyCode) {
  const storeCurrency = currencyCode || getActiveCurrency()
  const conf = CURRENCY_CONFIG[storeCurrency] || CURRENCY_CONFIG.INR
  return new Intl.NumberFormat(conf.locale, {
    style: 'currency',
    currency: conf.code,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

export function formatINR(amount, currencyCode) {
  return formatCurrency(amount, currencyCode)
}

export function formatPlaceValues(value, currencyCode = 'INR') {
  if (!value && value !== 0) return ''
  const clean = String(value).replace(/[^0-9.]/g, '')
  if (!clean) return ''
  const num = parseFloat(clean)
  if (isNaN(num)) return clean
  const conf = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.INR
  return new Intl.NumberFormat(conf.locale, {
    maximumFractionDigits: 2
  }).format(num)
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
