const axios = require('axios')

async function translateENtoVI(text) {
    const res = await axios.post(`${process.env.TRANSFORMER_API || 'http://localhost:8000'}/translate`, { text })
    return res.data
}

module.exports = { translateENtoVI }