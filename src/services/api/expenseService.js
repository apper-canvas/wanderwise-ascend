import expenseData from '../mockData/expense.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...expenseData]

const expenseService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const expense = data.find(item => item.id === id)
    if (!expense) throw new Error('Expense not found')
    return { ...expense }
  },

  async create(item) {
    await delay(400)
    const newExpense = {
      ...item,
      id: Date.now().toString()
    }
    data.push(newExpense)
    return { ...newExpense }
  },

  async update(id, updates) {
    await delay(300)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Expense not found')
    
    data[index] = { ...data[index], ...updates }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Expense not found')
    
    data.splice(index, 1)
    return true
  }
}

export default expenseService