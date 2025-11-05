import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/apiClient'

export default function Requests() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['requests'], queryFn: async () => (await api.get('/requests')).data })

  const respond = useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'ACCEPT' | 'REJECT' }) => api.post(`/swap-response/${requestId}`, { action }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] })
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['swappable'] })
    }
  })

  const incoming = data?.received ?? []
  const outgoing = data?.sent ?? []

  return (
    <div className="space-y-6">
      <h1 className="section-title">Requests</h1>
      <div>
        <h2 className="font-medium mb-2">Incoming</h2>
        <div className="space-y-3">
          {incoming.length === 0 && <div className="text-sm text-gray-600">No incoming requests</div>}
          {incoming.map((r: any) => (
            <div key={r.id} className="card flex items-center justify-between">
              <div className="card-body py-4">
                <div className="text-sm">Request from <span className="font-medium">{r.requesterId}</span></div>
                <div className="text-xs text-gray-600">Status: {r.status}</div>
              </div>
              {r.status === 'PENDING' && (
                <div className="pr-4 flex gap-2">
                  <button className="btn-primary text-sm" onClick={() => respond.mutate({ requestId: r.id, action: 'ACCEPT' })}>Accept</button>
                  <button className="btn-danger text-sm" onClick={() => respond.mutate({ requestId: r.id, action: 'REJECT' })}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-medium mb-2">Outgoing</h2>
        <div className="space-y-3">
          {outgoing.length === 0 && <div className="text-sm text-gray-600">No outgoing requests</div>}
          {outgoing.map((r: any) => (
            <div key={r.id} className="card">
              <div className="card-body">
                <div className="text-sm">To <span className="font-medium">{r.responderId}</span></div>
                <div className="text-xs text-gray-600">Status: {r.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

