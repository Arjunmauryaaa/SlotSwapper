import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/apiClient'
import EventList from '../components/EventList'
import { EventStatus } from '../types'
import { useState } from 'react'

export default function Dashboard() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['events'], queryFn: async () => (await api.get('/events')).data })

  const createMutation = useMutation({
    mutationFn: (payload: { title: string; startTime: string; endTime: string }) => api.post('/events', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EventStatus }) => api.put(`/events/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })

  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  function submitNew(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !start || !end) return
    createMutation.mutate({ title, startTime: start, endTime: end })
    setTitle(''); setStart(''); setEnd('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title mb-3">Your Events</h1>
        <form onSubmit={submitNew} className="grid gap-2 grid-cols-1 sm:grid-cols-5">
          <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input type="datetime-local" className="input" value={start} onChange={e => setStart(e.target.value)} />
          <input type="datetime-local" className="input" value={end} onChange={e => setEnd(e.target.value)} />
          <button className="btn-primary sm:col-span-2">Add Event</button>
        </form>
      </div>
      <EventList
        events={data?.events ?? []}
        onDelete={(id) => deleteMutation.mutate(id)}
        onToggleSwappable={(id, next) => updateStatusMutation.mutate({ id, status: next })}
      />
    </div>
  )
}

