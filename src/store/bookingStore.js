import { create } from 'zustand'
import { activeOrder } from '../data/orders'
import { savedPlaces } from '../data/places'
import { services } from '../data/services'
import { formatCurrency } from '../utils/formatCurrency'

export const useBookingStore = create((set, get) => ({
  selectedAddress: savedPlaces[0],
  selectedDate: 'Today',
  selectedDateLabel: '20 Mar',
  selectedTimeSlot: '8:00 AM - 10:00 AM',
  selectedService: services[0],
  currentOrder: activeOrder,

  setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
  setSelectedDate: (selectedDate, selectedDateLabel) => set({ selectedDate, selectedDateLabel }),
  setSelectedTimeSlot: (selectedTimeSlot) => set({ selectedTimeSlot }),
  setSelectedService: (selectedService) => set({ selectedService }),

  // This keeps the MVP flow easy to follow while we use mock data.
  confirmBooking: () => {
    const { selectedAddress, selectedDate, selectedDateLabel, selectedTimeSlot, selectedService } =
      get()

    const total = selectedService.price + 150

    set({
      currentOrder: {
        id: 'DBN-240401',
        serviceTitle: selectedService.title,
        status: 'Driver assigned',
        eta: `Pickup ${selectedDate.toLowerCase()} in 18 min`,
        addressLabel: selectedAddress.label,
        addressLine: selectedAddress.address,
        riderName: 'Kevin Otieno',
        riderPhone: '+254 712 884 221',
        deliveryEstimate: `${selectedDate}, 7:30 PM`,
        total,
        totalLabel: formatCurrency(total),
        timeline: [
          {
            title: 'Booking confirmed',
            time: `${selectedDate} • ${selectedDateLabel}`,
            detail: `${selectedService.title} is scheduled for ${selectedTimeSlot}.`,
            done: true,
          },
          {
            title: 'Driver assigned',
            time: 'Just now',
            detail: `Pickup set for ${selectedAddress.label}, ${selectedAddress.address}.`,
            done: true,
          },
          {
            title: 'Laundry in cleaning',
            time: 'Expected after pickup',
            detail: 'Your order will move to the cleaning hub after collection.',
            done: false,
          },
          {
            title: 'Out for delivery',
            time: 'Expected later today',
            detail: 'We will share rider details again once delivery starts.',
            done: false,
          },
        ],
      },
    })
  },
}))
