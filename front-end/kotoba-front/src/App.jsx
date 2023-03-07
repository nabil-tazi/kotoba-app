import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import styled from 'styled-components'

import WordsTable from './Components/WordsTable'

function App() {
    const [appMode, setAppMode] = useState('browse')
    const [APIData, setAPIData] = useState([])

    function updateDisplayedData() {
        Axios.get('http://localhost:8000/NotionAPIGet')
            .then((response) => {
                setAPIData(response.data.results)
                console.log('response.data.results')

                console.log(response.data.results)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        updateDisplayedData()
    }, [])

    return (
        <>
            {appMode === 'browse' && (
                <WordsTable WordsData={APIData}></WordsTable>
            )}
        </>
    )
}

export default App
