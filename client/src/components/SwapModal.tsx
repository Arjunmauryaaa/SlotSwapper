import { useState } from 'react'
import { EventItem } from './EventList'

export default function SwapModal({ open, onClose, mySwappable, onSelect }: {
  open: boolean
  onClose: () => void
  mySwappable: EventItem[]
  onSelect: (mySlotId: string) => void
}) {
  const [selected, setSelected] = useState<string>('')
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow w-full max-w-md p-4">
        <div className="font-semibold mb-2">Choose one of your swappable slots</div>
        <select className="w-full border rounded p-2" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="" disabled>Pick a slot</option>
          {mySwappable.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title} — {new Date(ev.startTime).toLocaleString()}</option>
          ))}
        </select>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-100 rounded" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => selected && onSelect(selected)} disabled={!selected}>Request Swap</button>
        </div>
      </div>
    </div>
  )
}

