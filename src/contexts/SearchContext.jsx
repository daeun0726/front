import React, { createContext, useContext, useState } from 'react'
import { getResult, getDatalab } from '../services/Api'

const initialState = {
  keyword: '', // 검색할 키워드
  relatedKeywords: [], // 키워드의 연관 검색어 배열
  startDate: '', // 시작 날짜
  endDate: '', // 끝 날짜
  timeUnit: '', // 기간 단위
  device: '', // 기기 유형
  gender: '', // 성별
  ages: [], // 연령대
  // isComparisonDisabled: false, // 비교 기능 활성화 여부
  comparisonTarget: '', // 비교 대상
  comparisonKeywords: [], // 비교 대상의 연관 검색어 배열
  resultData: null, // 결과 분석 데이터
  datalabData: null, // Datalab 데이터
  loading: false, // 로딩 상태
  error: null, // 에러 상태
}

const SearchContext = createContext()

export const useSearch = () => useContext(SearchContext)

export const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState(initialState)

  const updateSearchState = (newState) => {
    setSearchState((prev) => ({ ...prev, ...newState }))
  }

  // 결과 분석 요청
  const fetchResult = async () => {
    updateSearchState({ loading: true, error: null }) // 로딩 시작
    try {
      const result = await getResult(searchState.keyword)
      updateSearchState({ resultData: result, loading: false })
      console.log(result)
    } catch (error) {
      updateSearchState({ error: error.message, loading: false })
    }
  }

  // Datalab 요청
  const fetchDatalab = async () => {
    let keywordGroups = []

    // 메인 키워드 추가
    if (searchState.keyword && searchState.relatedKeywords.length > 0) {
      keywordGroups.push({
        groupName: searchState.keyword,
        keywords: searchState.relatedKeywords,
      })
    }

    // 비교 대상 추가 (비교 기능이 활성화된 경우)
    if (
      searchState.comparisonTarget &&
      searchState.comparisonKeywords.length > 0
      // && !searchState.isComparisonDisabled
    ) {
      keywordGroups.push({
        groupName: searchState.comparisonTarget,
        keywords: searchState.comparisonKeywords,
      })
    }

    const body = {
      startDate: searchState.startDate,
      endDate: searchState.endDate,
      timeUnit: searchState.timeUnit,
      keywordGroups: keywordGroups, // 최종 keywordGroups
      device: searchState.device,
      gender: searchState.gender,
      ages: searchState.ages,
    }

    updateSearchState({ loading: true, error: null }) // 로딩 시작
    try {
      console.log('fetchDatalab body:', body)
      const data = await getDatalab(body)
      updateSearchState({ datalabData: data, loading: false })
      console.log(data)
    } catch (error) {
      updateSearchState({ error: error.message, loading: false })
    }
  }

  return (
    <SearchContext.Provider
      value={{ searchState, updateSearchState, fetchResult, fetchDatalab }}
    >
      {children}
    </SearchContext.Provider>
  )
}

// {
//   "startDate": "2025-01-01",
//   "endDate": "2025-02-01",
//   "timeUnit": "week",
//   "keywordGroups": [
//     {
//       "groupName": "커피",
//       "keywords": ["아메리카노", "카페라떼"]
//     },
//     {
//       "groupName": "주스",
//       "keywords": ["오렌지", "딸기"]
//     }
//   ],
//   "device": "mo",
//   "gender": "f",
//   "ages": ["3", "4", "5"]
// }
