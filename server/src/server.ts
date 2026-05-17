import { connectDB } from '#config/database.js'
import { PORT } from '#config/env.js'
import app from './app.js'

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}.`))
})
