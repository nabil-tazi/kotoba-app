const express = require('express')
const { Client } = require('@notionhq/client')
const cors = require('cors')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const port = process.env.PORT || 8000
require('dotenv').config()

const app = express()
app.use(cors())

const authToken = process.env.NOTION_INTEGRATION_TOKEN
const notionDbID = process.env.NOTION_DATABASE_ID
const notion = new Client({ auth: authToken })

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [day, month, year].join('-')
}

app.post('/NotionAPIPost', jsonParser, async (req, res) => {
    const { Kanji } = req.body

    try {
        const response = await notion.pages.create({
            parent: {
                database_id: notionDbID,
            },
            properties: {
                Kanji: {
                    title: [
                        {
                            text: {
                                content: Kanji,
                            },
                        },
                    ],
                },
            },
        })

        res.send(response)
        console.log('success')
    } catch (error) {
        console.log(error)
    }
})

app.put('/NotionAPIUpdate', jsonParser, async (req, res) => {
    const { pageId, newReviewLevel } = req.body

    var todayDate = new Date().toISOString().slice(0, 10)
    // formatDate(yourDate)

    try {
        const response = await notion.pages.update({
            page_id: pageId,
            properties: {
                ReviewLevel: {
                    number: newReviewLevel,
                },
                LastReview: {
                    date: {
                        start: todayDate,
                    },
                },
            },
        })

        res.send(response)
        console.log('success')
    } catch (error) {
        console.log(error)
    }
})

app.get('/NotionAPIGet', async (req, res) => {
    try {
        const response = await notion.databases.query({
            database_id: notionDbID,
            sorts: [
                {
                    timestamp: 'created_time',
                    direction: 'descending',
                },
            ],
        })

        res.send(response)
        const { results } = response
        console.log('success')
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log('server listening on port 8000!')
})
