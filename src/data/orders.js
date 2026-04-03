import { formatCurrency } from '../utils/formatCurrency'

export const activeOrder = {
  id: 'DBN-240321',
  serviceTitle: 'Wash & Fold',
  status: 'Driver assigned',
  eta: 'Kevin arrives in 18 min',
  addressLabel: 'Home',
  addressLine: 'Fedha Estate, House 14, Nairobi',
  riderName: 'Kevin Otieno',
  riderPhone: '+254 712 884 221',
  deliveryEstimate: 'Today, 7:30 PM',
  total: 1000,
  totalLabel: formatCurrency(1000),
  timeline: [
    {
      title: 'Booking confirmed',
      time: '10:10 AM',
      detail: 'Your pickup request was received and scheduled.',
      done: true,
    },
    {
      title: 'Driver assigned',
      time: '10:16 AM',
      detail: 'Kevin is on the way to your pickup point in Fedha.',
      done: true,
    },
    {
      title: 'Laundry in cleaning',
      time: 'Expected 12:00 PM',
      detail: 'We will notify you once the clothes reach the cleaning hub.',
      done: false,
    },
    {
      title: 'Out for delivery',
      time: 'Expected 6:40 PM',
      detail: 'Your cleaned order will head back to your doorstep.',
      done: false,
    },
  ],
}

export const recentOrders = [
  {
    id: 'DBN-240300',
    serviceTitle: 'Dry Cleaning',
    date: '18 Mar 2026',
    status: 'Delivered',
    totalLabel: formatCurrency(1250),
  },
  {
    id: 'DBN-240288',
    serviceTitle: 'Wash & Fold',
    date: '12 Mar 2026',
    status: 'Delivered',
    totalLabel: formatCurrency(850),
  },
]
