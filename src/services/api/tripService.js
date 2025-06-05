import tripData from '../mockData/trip.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...tripData]

const tripService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const trip = data.find(item => item.id === id)
    if (!trip) throw new Error('Trip not found')
    return { ...trip }
  },

  async create(item) {
    await delay(400)
    const newTrip = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    data.unshift(newTrip)
    return { ...newTrip }
  },

  async update(id, updates) {
    await delay(300)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    data.splice(index, 1)
    return true
  }
}

export default tripService