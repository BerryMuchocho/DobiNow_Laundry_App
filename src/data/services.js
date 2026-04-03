import { Building2, Shirt, Sparkles, Zap } from 'lucide-react'
import { formatCurrency } from '../utils/formatCurrency'

export const services = [
  {
    id: 'wash-fold',
    title: 'Wash & Fold',
    description: 'Everyday laundry care for clothes, towels, and bedding.',
    price: 850,
    priceLabel: formatCurrency(850),
    tag: 'Popular',
    turnaround: 'Ready in 24 hrs',
    icon: Shirt,
  },
  {
    id: 'dry-cleaning',
    title: 'Dry Cleaning',
    description: 'Best for delicate pieces, suits, dresses, and special fabrics.',
    price: 1250,
    priceLabel: formatCurrency(1250),
    tag: 'Premium',
    turnaround: 'Ready in 48 hrs',
    icon: Sparkles,
  },
  {
    id: 'express',
    title: 'Express Service',
    description: 'Priority handling with same-day turnaround in supported zones.',
    price: 1450,
    priceLabel: formatCurrency(1450),
    tag: 'Fastest',
    turnaround: 'Ready today',
    icon: Zap,
  },
  {
    id: 'office-plan',
    title: 'Office Laundry Plan',
    description: 'Pickup bundles and recurring care for uniforms and staff wear.',
    price: 2100,
    priceLabel: formatCurrency(2100),
    tag: 'Business',
    turnaround: 'Custom schedule',
    icon: Building2,
  },
]
