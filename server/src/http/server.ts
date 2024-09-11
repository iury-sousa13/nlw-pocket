import fastify from 'fastify'
import { createGoalRoute } from './routes/create-goal'

const app = fastify({ logger: true })

app.register(createGoalRoute)

app
  .listen({
    port: 3001,
  })
  .then(() => console.log('HTTP server in running!'))
