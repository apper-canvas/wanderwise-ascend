import documentData from '../mockData/document.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...documentData]

const documentService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const document = data.find(item => item.id === id)
    if (!document) throw new Error('Document not found')
    return { ...document }
  },

  async create(item) {
    await delay(400)
    const newDocument = {
      ...item,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString()
    }
    data.push(newDocument)
    return { ...newDocument }
  },

  async update(id, updates) {
    await delay(300)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Document not found')
    
    data[index] = { ...data[index], ...updates }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Document not found')
    
    data.splice(index, 1)
    return true
  }
}

export default documentService