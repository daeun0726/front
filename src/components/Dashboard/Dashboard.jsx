import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Box, Card, CardContent, Typography, Grid } from '@mui/material'
import { useSearch } from '../../contexts/SearchContext'
import { useFavorites } from '../../contexts/FavoritesContext'
import { FaRegStar, FaStar } from 'react-icons/fa'

export const Dashboard = () => {
  const { searchState } = useSearch()
  const { favorites, addKeyword, removeKeyword } = useFavorites()
  const [isStarred, setIsStarred] = useState(() =>
    favorites.some((favorite) => favorite.keyword === searchState.keyword),
  )

  const handleStarClick = async () => {
    const keyword = searchState.keyword
    if (!keyword) return

    if (isStarred) {
      await removeKeyword(keyword)
    } else {
      await addKeyword(keyword)
    }
    setIsStarred(!isStarred)
  }

  // 감정 분석 차트용 데이터
  const sentimentData =
    searchState.resultData?.map((item) => ({
      date: item.date,
      sentiment:
        item.sentiment === 'positive'
          ? 100
          : item.sentiment === 'negative'
            ? -100
            : 0,
    })) || []

  // 검색 트렌드 차트용 데이터 (Datalab 데이터를 기반으로)
  const searchTrendData =
    searchState.datalabData?.results?.flatMap((result) =>
      result.data.map((entry) => ({
        name: `${result.title} (${entry.period})`,
        value: entry.ratio,
      })),
    ) || []

  useEffect(() => {}, [searchState.resultData, searchState.datalabData])

  return (
    <Layout>
      <ContentWrapper>
        {!searchState.keyword ? (
          // 검색어가 없으면 ContentWrapper만 표시
          <Typography variant="h6">검색어를 입력해주세요.</Typography>
        ) : (
          <Box p={4}>
            <TitleContainer>
              <Typography variant="h4" gutterBottom>
                {searchState.keyword}
              </Typography>
              <StarIcon onClick={handleStarClick}>
                {isStarred ? (
                  <FaStar size={24} color="gold" />
                ) : (
                  <FaRegStar size={24} color="gray" />
                )}
              </StarIcon>
            </TitleContainer>

            {/* 감정 분석 차트 */}
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Sentiment Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={sentimentData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <Line type="monotone" dataKey="sentiment" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* 검색 트렌드 차트 */}
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Search Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={searchTrendData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </ContentWrapper>
    </Layout>
  )
}
const Layout = styled.div`
  display: grid;
  height: 98.4vh;
  background-color: #f9fafb;
`
const ContentWrapper = styled.div`
  background-color: #f9fafb;
  padding: 20px;
  overflow-y: auto;
`
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const StarIcon = styled.div`
  cursor: pointer;
`
