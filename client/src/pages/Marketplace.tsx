import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/apiClient'
import SwapModal from '../components/SwapModal'
import { useState, useMemo } from 'react'

export default function Marketplace() {
  const qc = useQueryClient()
  const { data: swappable } = useQuery({ queryKey: ['swappable'], queryFn: async () => (await api.get('/swappable-slots')).data })
  const { data: myEvents } = useQuery({ queryKey: ['events'], queryFn: async () => (await api.get('/events')).data })
  const mySwappable = useMemo(() => (myEvents?.events ?? []).filter((e: any) => e.status === 'SWAPPABLE'), [myEvents])
  const [modalFor, setModalFor] = useState<any | null>(null)

  const createSwap = useMutation({
    mutationFn: ({ mySlotId, theirSlotId }: { mySlotId: string; theirSlotId: string }) => api.post('/swap-request', { mySlotId, theirSlotId }),
    onSuccess: () => {
      setModalFor(null)
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['swappable'] })
    }
  })

  return (
    <div className="space-y-4">
      <h1 className="section-title">Marketplace</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {(swappable?.events ?? []).map((ev: any) => (
          <div key={ev.id} className="card">
            <div className="card-body">
              <div className="font-medium">{ev.title}</div>
              <div className="text-sm text-gray-600">{new Date(ev.startTime).toLocaleString()} → {new Date(ev.endTime).toLocaleString()}</div>
              <div className="text-xs text-gray-700 mt-1">Owner: {ev.owner?.name} ({ev.owner?.email})</div>
              <div className="mt-3">
                <button className="btn-primary" onClick={() => setModalFor(ev)}>Request Swap</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <SwapModal
        open={!!modalFor}
        onClose={() => setModalFor(null)}
        mySwappable={mySwappable}
        onSelect={(mySlotId) => createSwap.mutate({ mySlotId, theirSlotId: modalFor.id })}
      />
    </div>
  )
}

