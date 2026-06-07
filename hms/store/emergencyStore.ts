import { create } from 'zustand'

interface EmergencyRequest {
  requestId: string
  emergencyId: string
  patientId: string
  symptoms: string[]
  severity: number
  requiredBedType: string
  distance: number
  eta: number
  score: number
  batchNumber: number
  timeoutAt: Date
  createdAt: Date
}

interface EmergencyStore {
  pendingRequests: EmergencyRequest[]
  addRequest: (request: EmergencyRequest) => void
  removeRequest: (requestId: string) => void
  clearRequests: () => void
}

export const useEmergencyStore = create<EmergencyStore>((set) => ({
  pendingRequests: [],
  
  addRequest: (request) =>
    set((state) => ({
      pendingRequests: [...state.pendingRequests, request],
    })),
  
  removeRequest: (requestId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter(
        (req) => req.requestId !== requestId
      ),
    })),
  
  clearRequests: () => set({ pendingRequests: [] }),
}))
