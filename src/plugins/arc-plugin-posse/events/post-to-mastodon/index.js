const arc = require('@architect/functions')

const handler = arc.events.subscribe(async (event) => {
  console.log(JSON.stringify(event, null, 2))
  return
})

module.exports = { handler }
