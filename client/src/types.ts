export type EventStatus = 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING'
export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export type EventDto = {
  id: string
  title: string
  startTime: string
  endTime: string
  status: EventStatus
  ownerId?: string
}

export type SwapRequestDto = {
  id: string
  mySlotId: string
  theirSlotId: string
  requesterId: string
  responderId: string
  status: SwapStatus
}

