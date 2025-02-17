import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
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
      result.data.map((entry) => ({
        title: result.title,
        period: entry.period,
        positiveRatio: entry.ratio,
      })),
    ) || []

  const transformedTrendData =
    Object.values(
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
    ) || []

  // const sentimentTimeChange =
  //   searchState.resultData?.map((item) => ({
  //     date: item.date,
  //     positive: item.sentiment === 'positive' ? 1 : 0,
  //     negative: item.sentiment === 'negative' ? 1 : 0,
  //     neutral: item.sentiment === 'neutral' ? 1 : 0,
  //   })) || []

  const sentimentMapping = {
    긍정: 'positive',
    부정: 'negative',
    중립: 'neutral',
  }

  const totalSentiments = searchState.resultData?.length || 1

  const sentimentDistribution = searchState.resultData?.reduce(
    (acc, item) => {
      const sentimentInEnglish =
        sentimentMapping[item.sentiment] || item.sentiment
      acc[sentimentInEnglish] += 1
      return acc
    },
    { positive: 0, negative: 0, neutral: 0 },
  ) || { positive: 0, negative: 0, neutral: 0 }

  const sentimentPieData =
    Object.entries(sentimentDistribution).map(([sentiment, count]) => ({
      sentiment,
      percentage: parseFloat(((count / totalSentiments) * 100).toFixed(2)),
    })) || []

  console.log('filteredTrendData', filteredTrendData)
  console.log('transformedTrendData', transformedTrendData)
  console.log('sentimentDistribution', sentimentDistribution)
  console.log('sentimentPieData', sentimentPieData)

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
                시간 별 언급율 변화
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
              <Box mt={2} display="flex" justifyContent="space-around">
                {sentimentPieData.map((data) => (
                  <Typography
                    key={data.sentiment}
                    variant="body1"
                    align="center"
                  >
                    <span
                      style={{
                        color:
                          data.sentiment === 'positive'
                            ? '#82ca9d'
                            : data.sentiment === 'negative'
                              ? '#ff6347'
                              : '#808080',
                      }}
                    >
                      {data.sentiment === 'positive'
                        ? '긍정'
                        : data.sentiment === 'negative'
                          ? '부정'
                          : '중립'}
                    </span>
                    : {data.percentage}%
                  </Typography>
                ))}
              </Box>
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
