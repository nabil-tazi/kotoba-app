import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import styled from 'styled-components'

const WordsTableWrapper = styled.div`
    width: 100%;
    grid-template-columns: 100px 50px 100px;
`
const TableEntry = styled.div`
    display: inline-grid;
    align-items: center;
    grid-template-columns: 200px 200px 200px 300px 200px 100px;
    justify-content: space-between;
    border-bottom: 1px solid gray;
`

const WordProperty = styled.div``

const ProgressBarContainer = styled.div`
    position: relative;

    height: 20px;
    width: 200px;
    background-color: #e0e0de;
    border-radius: 50px;
    margin: 10px;
`
const ProgressBarFiller = styled.div`
    height: 100%;
    width: ${(props) => props.completed};
    background-color: lightgreen;
    border-radius: inherit;
    text-align: right;
`
const ProgressBarLabel = styled.div`
    position: absolute;
    left: 50%;
    font-size: 12px;
    margin-top: 2px;
`

const ReviewButton = styled.button`
    height: 20px;
`

function WordsTable({ WordsData }) {
    const handleReview = function (pageId, newReviewLevel) {
        console.log('PAGE ID ?')
        console.log(pageId)

        Axios.put('http://localhost:8000/NotionAPIUpdate', {
            pageId: pageId.toString(),
            newReviewLevel: newReviewLevel,
        }).catch((error) => {
            console.log(error)
        })

        updateDisplayedData()
    }
    return (
        <WordsTableWrapper>
            {WordsData.map((data) => {
                return (
                    <TableEntry key={data.id}>
                        <WordProperty>
                            {data.properties.Kanji.title[0].plain_text}
                        </WordProperty>
                        <WordProperty>
                            {data.properties.Kana.rich_text[0] &&
                                data.properties.Kana.rich_text[0].plain_text}
                        </WordProperty>
                        <WordProperty>
                            {data.properties.English.rich_text[0] &&
                                data.properties.English.rich_text[0].plain_text}
                        </WordProperty>
                        <WordProperty>
                            <ProgressBarContainer>
                                <ProgressBarLabel>
                                    {data.properties.ReviewLevel.number
                                        ? data.properties.ReviewLevel.number
                                        : 0}
                                </ProgressBarLabel>
                                <ProgressBarFiller
                                    completed={
                                        data.properties.ReviewLevel.number
                                            ? (
                                                  data.properties.ReviewLevel
                                                      .number * 10
                                              ).toString() + '%'
                                            : 0
                                    }
                                ></ProgressBarFiller>
                            </ProgressBarContainer>
                        </WordProperty>
                        <WordProperty>
                            {data.properties.LastReview.date
                                ? data.properties.LastReview.date.start
                                : 'Never'}
                        </WordProperty>
                        <WordProperty>
                            <ReviewButton
                                onClick={() =>
                                    handleReview(
                                        data.id,
                                        data.properties.ReviewLevel.number
                                            ? data.properties.ReviewLevel
                                                  .number + 1
                                            : 1
                                    )
                                }
                            >
                                Review
                            </ReviewButton>
                        </WordProperty>
                    </TableEntry>
                )
            })}
        </WordsTableWrapper>
    )
}

export default WordsTable
