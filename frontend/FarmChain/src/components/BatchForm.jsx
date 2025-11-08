import { useState } from 'react'
import api from '../services/api'
import QRCode from 'qrcode.react'

export default function BatchForm() {
  const [cropType, setCropType] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [harvestDate, setHarvestDate] = useState('')
  const [qualityGrade, setQualityGrade] = useState('A')
  const [location, setLocation] = useState('')
  const [batchId, setBatchId] = useState(null)
  const [error, setError] = useState('')

  async function submit(e){
    e.preventDefault()
    try{
      const token = localStorage.getItem('token')
      if(!token) {
        setError('Please login first')
        return
      }

      const res = await api.post('/batches', {
        cropType,
        quantity: Number(quantity),
        unit,
        harvestDate: new Date(harvestDate).toISOString().split('T')[0],
        qualityGrade,
        location
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setBatchId(res.data.batch_id || res.data.batchId || res.data.id)
      setError('')
      alert('Batch created successfully!')
    }catch(err){
      console.error('Batch creation error:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Failed to create batch. Please try again.')
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4">Create Batch</h3>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm">Crop Type</label>
          <input required className="w-full border rounded px-3 py-2" value={cropType} onChange={e=>setCropType(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Quantity</label>
            <input required type="number" min="0" step="0.01" className="w-full border rounded px-3 py-2" value={quantity} onChange={e=>setQuantity(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Unit</label>
            <select className="w-full border rounded px-3 py-2" value={unit} onChange={e=>setUnit(e.target.value)}>
              <option value="kg">Kilograms (kg)</option>
              <option value="ton">Tons</option>
              <option value="quintal">Quintals</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm">Harvest Date</label>
          <input required type="date" className="w-full border rounded px-3 py-2" value={harvestDate} onChange={e=>setHarvestDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Quality Grade</label>
          <select className="w-full border rounded px-3 py-2" value={qualityGrade} onChange={e=>setQualityGrade(e.target.value)}>
            <option value="A+">A+ (Premium)</option>
            <option value="A">A (Standard)</option>
            <option value="B+">B+ (Good)</option>
            <option value="B">B (Average)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Location</label>
          <input required className="w-full border rounded px-3 py-2" placeholder="Farm/Field location" value={location} onChange={e=>setLocation(e.target.value)} />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <button type="submit" className="btn-primary w-full">Create Batch</button>
        </div>
      </form>

      {batchId && (
        <div className="mt-6">
          <h4 className="font-medium">Batch ID</h4>
          <p className="mb-3">{batchId}</p>
          <div className="inline-block bg-white p-2">
            <QRCode value={String(batchId)} size={160} />
          </div>
        </div>
      )}
    </div>
  )
}
