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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material'
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

  // 날짜 범위, 성별, 연령대 필터 상태
  const [startDate, setStartDate] = useState(searchState.startDate)
  const [endDate, setEndDate] = useState(searchState.endDate)
  const [timeUnit, setTimeUnit] = useState('week')

  useEffect(() => {}, [startDate, endDate, timeUnit])

  // 키워드 트렌드 분석 데이터
  const keywordTrendData =
    searchState.datalabData?.results?.flatMap((result) =>
      result.data.map((entry) => ({
        name: `${result.title} (${entry.period})`,
        value: entry.ratio,
      })),
    ) || []

  // 감성 분석 데이터
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

  // 감성 분포 데이터 (긍정/부정/중립)
  const sentimentDistribution =
    searchState.resultData?.map((item) => ({
      sentiment: item.sentiment,
      count: 1, // 각 날짜별 하나의 데이터
    })) || []

  // 감성 시간 변화 데이터 (막대 차트용)
  const sentimentTimeChange =
    searchState.resultData?.map((item) => ({
      date: item.date,
      positive: item.sentiment === 'positive' ? 1 : 0,
      negative: item.sentiment === 'negative' ? 1 : 0,
      neutral: item.sentiment === 'neutral' ? 1 : 0,
    })) || []

  return (
    <Layout>
      <ContentWrapper>
        {!searchState.keyword ? (
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

            {/* 기간 필터링 */}
            <Grid container spacing={2} mt={4}>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Start Date</InputLabel>
                  <Select
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  >
                    <MenuItem value="2024-12-01">2024-12-01</MenuItem>
                    <MenuItem value="2025-01-01">2025-01-01</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>End Date</InputLabel>
                  <Select
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  >
                    <MenuItem value="2025-01-01">2025-01-01</MenuItem>
                    <MenuItem value="2025-02-01">2025-02-01</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Time Unit</InputLabel>
                  <Select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value)}
                  >
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* 키워드 트렌드 분석 차트 */}
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Keyword Trend Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={keywordTrendData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* 감성 분석: 원형 차트 */}
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Sentiment Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentDistribution}
                    dataKey="count"
                    nameKey="sentiment"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ff6347" />
                    <Cell fill="#808080" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* 감성 분석: 시간별 변화 (막대 차트) */}
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Sentiment Change Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sentimentTimeChange}>
                  <Bar dataKey="positive" fill="#82ca9d" />
                  <Bar dataKey="negative" fill="#ff6347" />
                  <Bar dataKey="neutral" fill="#808080" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* 상세 분석: 날짜별 감성 분석 테이블 */}
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Detailed Sentiment Analysis
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Keyword</TableCell>
                      <TableCell>Sentiment</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchState.resultData?.map((item) => (
                      <TableRow key={item.date}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{searchState.keyword}</TableCell>
                        <TableCell>{item.sentiment}</TableCell>
                        <TableCell>{item.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
