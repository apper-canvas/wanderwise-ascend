import packingItemData from '../mockData/packingItem.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...packingItemData]

const packingItemService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const item = data.find(item => item.id === id)
    if (!item) throw new Error('Packing item not found')
    return { ...item }
  },

  async create(item) {
    await delay(400)
    const newItem = {
      ...item,
      id: Date.now().toString()
    }
    data.push(newItem)
    return { ...newItem }
  },

  async update(id, updates) {
    await delay(300)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Packing item not found')
    
    data[index] = { ...data[index], ...updates }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Packing item not found')
    
    data.splice(index, 1)
    return true
  }
}

export default packingItemService