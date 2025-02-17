import React, { useState, useEffect, useMemo } from 'react'
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
import parse from 'html-react-parser'

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

  const [startDate, setStartDate] = useState(searchState.startDate)
  const [endDate, setEndDate] = useState(searchState.endDate)
  const [timeUnit, setTimeUnit] = useState(searchState.timeUnit)
  const COLORS = ['#8884d8', '#82ca9d', '#ff6347', '#ffc658', '#8dd1e1']

  useEffect(() => {}, [searchState.keyword])

  const titleColorMap = {}
  let colorIndex = 0

  const filteredTrendData =
    searchState.datalabData?.results?.flatMap((result) =>
      result.data
        .filter((entry) => entry.period >= startDate && entry.period <= endDate)
        .map((entry) => ({
          title: result.title,
          period: entry.period,
          positiveRatio: entry.ratio,
        })),
    ) || []

  const transformedTrendData = Object.values(
    filteredTrendData.reduce((acc, { title, period, positiveRatio }) => {
      if (!acc[period]) {
        acc[period] = { period }
      }
      acc[period][title] = positiveRatio

      if (!(title in titleColorMap)) {
        titleColorMap[title] = COLORS[colorIndex % COLORS.length]
        colorIndex++
      }

      return acc
    }, {}),
  )

  const sentimentTimeChange =
    searchState.resultData?.map((item) => ({
      date: item.date,
      positive: item.sentiment === 'positive' ? 1 : 0,
      negative: item.sentiment === 'negative' ? 1 : 0,
      neutral: item.sentiment === 'neutral' ? 1 : 0,
    })) || []

  const totalSentiments = searchState.resultData?.length || 1

  const sentimentDistribution = searchState.resultData?.reduce(
    (acc, item) => {
      acc[item.sentiment] += 1
      return acc
    },
    { positive: 0, negative: 0, neutral: 0 },
  )

  const sentimentPieData = Object.entries(sentimentDistribution).map(
    ([sentiment, count]) => ({
      sentiment,
      percentage: ((count / totalSentiments) * 100).toFixed(2),
    }),
  )

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

            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                시간 별 긍정 비율 변화
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={transformedTrendData}>
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  {Object.keys(titleColorMap).map((title) => (
                    <Bar
                      key={title}
                      dataKey={title}
                      name={title}
                      fill={titleColorMap[title]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                반응 분포
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    dataKey="percentage"
                    nameKey="sentiment"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ff6347" />
                    <Cell fill="#808080" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                감정 별 상세 반응 내용
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
                        <TableCell>{parse(item.description)}</TableCell>
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
