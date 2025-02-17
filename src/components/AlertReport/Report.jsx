import React from 'react'
import styled from 'styled-components'
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
import { useFavorites } from '../../contexts/FavoritesContext'

export const Report = ({ bookmarkName, date }) => {
  const { reports, loading } = useFavorites()
  const filteredReports = reports.filter(
    (report) => report.keyword === bookmarkName && report.reportDate === date,
  )

  const parseReportContent = (content) => {
    try {
      const parsedContent = JSON.parse(content)
      return parsedContent.map(([text, date]) => ({
        content: text.replace(/<b>/g, '').replace(/<\/b>/g, ''),
        date: date,
      }))
    } catch (error) {
      console.error('Parsing error:', error)
      return []
    }
  }

  return (
    <Layout>
      <ContentWrapper>
        <Box p={4}>
          <Typography variant="h4" gutterBottom>
            {bookmarkName} {date}
          </Typography>

          {loading ? (
            <Typography variant="h6" color="text.secondary">
              Loading reports...
            </Typography>
          ) : (
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                감성 변화
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Content</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReports?.map((item) => {
                      const reportData = parseReportContent(item.reportContent)
                      return reportData.map((report, index) => (
                        <TableRow key={index}>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>{report.content}</TableCell>
                        </TableRow>
                      ))
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
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
