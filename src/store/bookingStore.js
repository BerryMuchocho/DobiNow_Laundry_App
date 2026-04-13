import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { DOBINOW_LAUNDRY_MART } from '../config/location'
import { activeOrder } from '../data/orders'
import { savedPlaces } from '../data/places'
import { services } from '../data/services'
import { formatCurrency } from '../utils/formatCurrency'
import { getDefaultPickupDate, getValidSelectedPickupDate } from '../utils/pickupDates'
import { validateServiceArea } from '../utils/serviceArea'

const BOOKING_STORAGE_KEY = 'dobinow-booking'

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

function normalizeLocation(location) {
  return {
    ...createEmptyLocation(),
    ...location,
  }
}

function findServiceById(serviceId) {
  return services.find((service) => service.id === serviceId) ?? services[0]
}

function isSelfDropoffOrder(orderFlow) {
  return orderFlow.pickup?.source === 'laundry-mart'
}

function hasDeliveryService(orderFlow) {
  const finalDropoff = orderFlow.returnToPickup ? orderFlow.pickup : orderFlow.dropoff
  return finalDropoff?.source !== 'laundry-mart'
}

function getDeliveryFee(orderFlow) {
  return hasDeliveryService(orderFlow) ? 150 : 0
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
const defaultPickupDate = getDefaultPickupDate()

const defaultBookingState = {
  orderFlow: {
    pickup: initialPickup,
    dropoff: initialDropoff,
    returnToPickup: true,
  },
  selectedAddress: initialPickup,
  selectedDate: defaultPickupDate.label,
  selectedDateLabel: defaultPickupDate.sublabel,
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
}

function createBookingState(set, get) {
  return {
    ...defaultBookingState,

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
        const normalizedLocation = normalizeLocation(location)
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
      const selfDropoffOrder = isSelfDropoffOrder(orderFlow)
      const deliveryService = hasDeliveryService(orderFlow)
      const deliveryFee = getDeliveryFee(orderFlow)
      const total = selectedService.price + deliveryFee

      set({
        currentOrder: {
          id: 'DBN-240401',
          serviceTitle: selectedService.title,
          status: selfDropoffOrder ? 'Awaiting drop-off' : 'Driver assigned',
          eta: selfDropoffOrder ? `${selectedDate}, ${selectedTimeSlot}` : `Pickup ${selectedDate.toLowerCase()} in 18 min`,
          addressLabel:
            pickup.source === 'laundry-mart' ? 'Laundry drop-off' : 'Pickup location',
          addressLine: pickup.address,
          riderName: 'Kevin Otieno',
          riderPhone: '+254 712 884 221',
          deliveryEstimate: !deliveryService
            ? 'Collect from DobiNow Laundry Mart'
            : `${selectedDate}, 7:30 PM`,
          total,
          totalLabel: formatCurrency(total),
          timeline: selfDropoffOrder
            ? [
                {
                  title: 'Booking confirmed',
                  time: `${selectedDate} - ${selectedDateLabel}`,
                  detail: `${selectedService.title} is scheduled for ${selectedTimeSlot}.`,
                  done: true,
                },
                {
                  title: 'Drop off at DobiNow Laundry Mart',
                  time: `${selectedDate}, ${selectedTimeSlot}`,
                  detail: `Bring your laundry to ${pickup.address}.`,
                  done: false,
                },
                {
                  title: 'Laundry in cleaning',
                  time: 'After drop-off',
                  detail: 'We will start cleaning once your laundry is received at the mart.',
                  done: false,
                },
                deliveryService
                  ? {
                      title: 'Out for delivery',
                      time: 'After cleaning',
                      detail: `Delivery is set for ${dropoff.address}.`,
                      done: false,
                    }
                  : {
                      title: 'Ready for collection',
                      time: 'After cleaning',
                      detail: 'We will notify you when your order is ready for collection at DobiNow Laundry Mart.',
                      done: false,
                    },
              ]
            : [
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
                deliveryService
                  ? {
                      title: 'Out for delivery',
                      time: 'Expected later today',
                      detail: `Drop-off is set for ${dropoff.address}.`,
                      done: false,
                    }
                  : {
                      title: 'Ready for collection',
                      time: 'After cleaning',
                      detail: 'We will notify you when your order is ready for collection at DobiNow Laundry Mart.',
                      done: false,
                    },
              ],
        },
      })
    },
  }
}

export const useBookingStore = create(
  persist(createBookingState, {
    name: BOOKING_STORAGE_KEY,
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      orderFlow: state.orderFlow,
      selectedDate: state.selectedDate,
      selectedDateLabel: state.selectedDateLabel,
      selectedTimeSlot: state.selectedTimeSlot,
      selectedServiceId: state.selectedService.id,
      currentOrder: state.currentOrder,
    }),
    merge: (persistedState, currentState) => {
      const persistedBookingState = persistedState && typeof persistedState === 'object' ? persistedState : {}
      const persistedOrderFlow =
        persistedBookingState.orderFlow && typeof persistedBookingState.orderFlow === 'object'
          ? persistedBookingState.orderFlow
          : currentState.orderFlow

      const pickup = normalizeLocation(persistedOrderFlow.pickup ?? currentState.orderFlow.pickup)
      const returnToPickup =
        typeof persistedOrderFlow.returnToPickup === 'boolean'
          ? persistedOrderFlow.returnToPickup
          : currentState.orderFlow.returnToPickup
      const dropoff = returnToPickup
        ? pickup
        : normalizeLocation(persistedOrderFlow.dropoff ?? currentState.orderFlow.dropoff)
      const selectedService = findServiceById(persistedBookingState.selectedServiceId)
      const validSelectedPickupDate = getValidSelectedPickupDate(
        persistedBookingState.selectedDate ?? currentState.selectedDate,
        persistedBookingState.selectedDateLabel ?? currentState.selectedDateLabel
      )

      return {
        ...currentState,
        ...persistedBookingState,
        orderFlow: {
          pickup,
          dropoff,
          returnToPickup,
        },
        selectedAddress: pickup,
        selectedDate: validSelectedPickupDate.label,
        selectedDateLabel: validSelectedPickupDate.sublabel,
        selectedTimeSlot: persistedBookingState.selectedTimeSlot ?? currentState.selectedTimeSlot,
        selectedService,
        currentOrder: persistedBookingState.currentOrder ?? currentState.currentOrder,
        serviceArea: {
          pickup: createServiceAreaState(pickup),
          dropoff: createServiceAreaState(dropoff),
        },
        locationLoading: currentState.locationLoading,
        locationError: currentState.locationError,
        locationPermissionStatus: currentState.locationPermissionStatus,
      }
    },
  })
)
