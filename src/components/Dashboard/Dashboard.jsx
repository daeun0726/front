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
        <Box p={4}>
          <TitleContainer>
            <Typography variant="h4" gutterBottom>
              {searchState.keyword || 'Search Keyword'}
            </Typography>
            <StarIcon onClick={handleStarClick}>
              {isStarred ? (
                <FaStar size={24} color="gold" />
              ) : (
                <FaRegStar size={24} color="gray" />
              )}
            </StarIcon>
          </TitleContainer>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Total User</Typography>
                  <Typography variant="h4">40,689</Typography>
                  <Typography color="text.secondary" variant="body2">
                    8.5% Up from yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Total Order</Typography>
                  <Typography variant="h4">10,293</Typography>
                  <Typography color="text.secondary" variant="body2">
                    1.3% Up from past week
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Total Sales</Typography>
                  <Typography variant="h4">$89,000</Typography>
                  <Typography color="error" variant="body2">
                    4.3% Down from yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Total Pending</Typography>
                  <Typography variant="h4">2,040</Typography>
                  <Typography color="text.secondary" variant="body2">
                    1.8% Up from yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

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
      </ContentWrapper>
    </Layout>
  )
}
const Layout = styled.div`
  background-color: aqua;
  display: grid;
  height: 98.4vh;
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
