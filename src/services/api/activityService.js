import activityData from '../mockData/activity.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...activityData]

const activityService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const activity = data.find(item => item.id === id)
    if (!activity) throw new Error('Activity not found')
    return { ...activity }
  },

  async create(item) {
    await delay(400)
    const newActivity = {
      ...item,
      id: Date.now().toString()
    }
    data.push(newActivity)
    return { ...newActivity }
  },

  async update(id, updates) {
    await delay(300)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Activity not found')
    
    data[index] = { ...data[index], ...updates }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Activity not found')
    
    data.splice(index, 1)
    return true
  }
}

export default activityService