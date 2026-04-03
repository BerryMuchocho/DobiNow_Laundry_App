import { create } from 'zustand'
import { DOBINOW_LAUNDRY_MART } from '../config/location'
import { activeOrder } from '../data/orders'
import { savedPlaces } from '../data/places'
import { services } from '../data/services'
import { formatCurrency } from '../utils/formatCurrency'
import { validateServiceArea } from '../utils/serviceArea'

function createEmptyLocation() {
  return {
    address: '',
    lat: null,
    lng: null,
    instructions: '',
    isConfirmed: false,
    source: '',
  }
}

function createLocationFromSavedPlace(place) {
  return {
    address: place.address,
    lat: place.lat ?? null,
    lng: place.lng ?? null,
    instructions: place.instructions ?? '',
    isConfirmed: true,
    source: place.source ?? 'manual-pin',
  }
}

function createServiceAreaState(location = createEmptyLocation()) {
  const validation = validateServiceArea(location.lat, location.lng)

  return {
    isEligible: validation.isEligible,
    message: validation.message,
    distanceKm: validation.distanceKm,
  }
}

const initialPickup = createLocationFromSavedPlace(savedPlaces[0])
const initialDropoff = initialPickup
const initialValidation = createServiceAreaState(initialPickup)
const initialLocationStatus = {
  search: false,
  currentLocation: false,
  reverseGeocode: false,
}
const initialLocationErrors = {
  search: '',
  currentLocation: '',
  reverseGeocode: '',
}

export const useBookingStore = create((set, get) => ({
  orderFlow: {
    pickup: initialPickup,
    dropoff: initialDropoff,
    returnToPickup: true,
  },
  selectedAddress: initialPickup,
  selectedDate: 'Today',
  selectedDateLabel: '20 Mar',
  selectedTimeSlot: '8:00 AM - 10:00 AM',
  selectedService: services[0],
  currentOrder: activeOrder,
  serviceArea: {
    pickup: initialValidation,
    dropoff: initialValidation,
  },
  locationLoading: {
    pickup: initialLocationStatus,
    dropoff: initialLocationStatus,
  },
  locationError: {
    pickup: initialLocationErrors,
    dropoff: initialLocationErrors,
  },
  locationPermissionStatus: 'idle',

  setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
  setSelectedDate: (selectedDate, selectedDateLabel) => set({ selectedDate, selectedDateLabel }),
  setSelectedTimeSlot: (selectedTimeSlot) => set({ selectedTimeSlot }),
  setSelectedService: (selectedService) => set({ selectedService }),
  setLocationLoading: (type, key, value) =>
    set((state) => ({
      locationLoading: {
        ...state.locationLoading,
        [type]: {
          ...state.locationLoading[type],
          [key]: value,
        },
      },
    })),
  setLocationError: (type, key, value) =>
    set((state) => ({
      locationError: {
        ...state.locationError,
        [type]: {
          ...state.locationError[type],
          [key]: value,
        },
      },
    })),
  setLocationPermissionStatus: (locationPermissionStatus) => set({ locationPermissionStatus }),
  setReturnToPickup: (returnToPickup) =>
    set((state) => {
      const nextDropoff = returnToPickup ? state.orderFlow.pickup : state.orderFlow.dropoff
      const nextDropoffValidation = returnToPickup
        ? createServiceAreaState(state.orderFlow.pickup)
        : state.serviceArea.dropoff

      return {
        orderFlow: {
          ...state.orderFlow,
          returnToPickup,
          dropoff: nextDropoff,
        },
        serviceArea: {
          ...state.serviceArea,
          dropoff: nextDropoffValidation,
        },
      }
    }),
  saveLocation: (type, location) =>
    set((state) => {
      const normalizedLocation = {
        ...createEmptyLocation(),
        ...location,
      }
      const validation = createServiceAreaState(normalizedLocation)
      const nextOrderFlow = {
        ...state.orderFlow,
        [type]: normalizedLocation,
      }
      const nextServiceArea = {
        ...state.serviceArea,
        [type]: validation,
      }

      if (type === 'pickup' && state.orderFlow.returnToPickup) {
        nextOrderFlow.dropoff = normalizedLocation
        nextServiceArea.dropoff = validation
      }

      return {
        orderFlow: nextOrderFlow,
        selectedAddress: type === 'pickup' ? normalizedLocation : state.selectedAddress,
        serviceArea: nextServiceArea,
      }
    }),
  useLaundryMartFallback: (type) =>
    get().saveLocation(type, {
      ...DOBINOW_LAUNDRY_MART,
      isConfirmed: true,
    }),

  confirmBooking: () => {
    const { orderFlow, selectedDate, selectedDateLabel, selectedTimeSlot, selectedService } = get()
    const pickup = orderFlow.pickup
    const dropoff = orderFlow.returnToPickup ? orderFlow.pickup : orderFlow.dropoff
    const total = selectedService.price + 150

    set({
      currentOrder: {
        id: 'DBN-240401',
        serviceTitle: selectedService.title,
        status: 'Driver assigned',
        eta: `Pickup ${selectedDate.toLowerCase()} in 18 min`,
        addressLabel: pickup.source === 'laundry-mart' ? 'DobiNow Laundry Mart' : 'Pickup location',
        addressLine: pickup.address,
        riderName: 'Kevin Otieno',
        riderPhone: '+254 712 884 221',
        deliveryEstimate: `${selectedDate}, 7:30 PM`,
        total,
        totalLabel: formatCurrency(total),
        timeline: [
          {
            title: 'Booking confirmed',
            time: `${selectedDate} - ${selectedDateLabel}`,
            detail: `${selectedService.title} is scheduled for ${selectedTimeSlot}.`,
            done: true,
          },
          {
            title: 'Driver assigned',
            time: 'Just now',
            detail: `Pickup confirmed for ${pickup.address}.`,
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
            detail: `Drop-off is set for ${dropoff.address}.`,
            done: false,
          },
        ],
      },
    })
  },
}))
