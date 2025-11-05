import { EventStatus } from '../types'

export type EventItem = {
  id: string
  title: string
  startTime: string
  endTime: string
  status: EventStatus
}

export default function EventList({ events, onDelete, onToggleSwappable }: {
  events: EventItem[]
  onDelete: (id: string) => void
  onToggleSwappable: (id: string, next: EventStatus) => void
}) {
  return (
    <div className="space-y-3">
      {events.map(ev => (
        <div key={ev.id} className="card flex items-center justify-between">
          <div className="card-body py-4">
            <div className="font-medium text-base">{ev.title}</div>
            <div className="text-sm text-gray-600">{new Date(ev.startTime).toLocaleString()} → {new Date(ev.endTime).toLocaleString()}</div>
            <div className="text-xs mt-1">Status: <span className="font-medium">{ev.status}</span></div>
          </div>
          <div className="pr-4 flex gap-2">
            <button onClick={() => onDelete(ev.id)} className="btn-danger text-sm">Delete</button>
            {ev.status === 'SWAPPABLE' ? (
              <button onClick={() => onToggleSwappable(ev.id, 'BUSY')} className="btn-secondary text-sm">Mark Busy</button>
            ) : ev.status === 'BUSY' ? (
              <button onClick={() => onToggleSwappable(ev.id, 'SWAPPABLE')} className="btn-primary text-sm">Make Swappable</button>
            ) : (
              <span className="text-xs text-amber-700">Swap pending…</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

