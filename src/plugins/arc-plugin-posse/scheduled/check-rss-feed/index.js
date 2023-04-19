async function handler (event) {
  console.log(JSON.stringify(event, null, 2))
  console.log(process.env.RSS_URL)
  return
}

module.exports = { handler }
