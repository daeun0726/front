import axios from 'axios'
import { BASE_URL, API_URLS } from './urls'

// Axios 기본 클라이언트 설정
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청마다 Authorization 헤더 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 오류 핸들러
const handleApiError = (error) => {
  if (error.response) {
    console.error('Response error:', error.response)
    throw new Error(error.response.data?.detail || 'API response error')
  } else if (error.request) {
    console.error('No response received:', error.request)
    throw new Error('No response from server')
  } else {
    console.error('Request setup error:', error.message)
    throw new Error(error.message)
  }
}

// 로그인 API 호출
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post(API_URLS.LOGIN, {
      email,
      pw: password,
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 회원 정보 가져오기 API 호출
export const getUserInfo = async () => {
  try {
    const response = await apiClient.get(API_URLS.PROTECTED)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 회원가입 API 호출
export const signupUser = async (nickname, pw, email, userName) => {
  try {
    const response = await apiClient.post(API_URLS.SIGNUP, {
      nickname,
      pw,
      email,
      user_name: userName,
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// 키워드 저장 API 호출
export const saveKeyword = async (keyword) => {
  try {
    const response = await apiClient.post(API_URLS.SAVE_KEYWORD, { keyword })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// {
//   "message": "Keyword 'example_keyword' saved successfully!"
// }

// 키워드 삭제 API 호출
export const deleteKeyword = async (keyword) => {
  try {
    const response = await apiClient.delete(API_URLS.DELETE_KEYWORD, {
      data: { keyword },
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// {
//   "message": "Keyword 'example_keyword' removed from favorites successfully!"
// }

// 사용자가 즐겨찾기한 키워드 조회 API 호출
export const getUserFavorites = async () => {
  try {
    const response = await apiClient.get(API_URLS.GET_FAVORITES)
    console.log('Favorites Response:', response.data)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// [
//   {
//     "keyword": "example_keyword_1"
//   },
//   {
//     "keyword": "example_keyword_2"
//   }
// ]

// 사용자가 즐겨찾기한 키워드에 대한 리포트 조회 API 호출
export const getReportsForKeyword = async (keyword) => {
  try {
    const response = await apiClient.get(`${API_URLS.GET_REPORTS}/${keyword}`)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// [
//   {
//     "reportId": 1,
//     "keyword": "example_keyword_1",
//     "reportDate": "2025-02-10",
//     "reportContent": "This is a report content for example_keyword_1.",
//     "isViewed": false
//   },
//   {
//     "reportId": 2,
//     "keyword": "example_keyword_1",
//     "reportDate": "2025-02-11",
//     "reportContent": "This is a report content for example_keyword_2.",
//     "isViewed": true
//   }
// ]

// 리포트의 'isViewed' 상태 업데이트 API 호출
export const updateReportViewed = async (
  reportId,
  isViewed,
  keyword,
  reportDate,
  keywordId,
  reportContent,
) => {
  try {
    const response = await apiClient.put(API_URLS.UPDATE_REPORT_VIEWED, {
      reportId,
      isViewed,
      keyword,
      reportDate,
      keywordId,
      reportContent,
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// {
//   "reportId": 1,
//   "keyword": "example_keyword_1",
//   "reportDate": "2025-02-10",
//   "reportContent": "This is a report content for example_keyword_1.",
//   "isViewed": true
// }

// 리포트 삭제 API 호출
export const deleteReport = async (reportId) => {
  try {
    const response = await apiClient.delete(API_URLS.DELETE_REPORTS, {
      data: { reportId },
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// {
//   "message": "Report with ID 1 deleted successfully!"
// }

// 결과 분석 API 호출
export const getResult = async (keyword) => {
  try {
    const response = await apiClient.post(
      `${API_URLS.GET_RESULT}?keyword=${encodeURIComponent(keyword)}`,
      {},
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}

// Datalab 데이터 API 호출
export const getDatalab = async (body) => {
  try {
    const response = await apiClient.post(API_URLS.GET_DATALAB, body)
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}
