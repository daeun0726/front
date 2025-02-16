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

// [
//   {
//     "date": "20250207",
//     "description": "꾸준히 출근길 자주 들르는 <b>스타벅스</b>! 버스 정류장 바로 앞에 있다 보니 모닝커피가 절실한 날엔 집에서 조금 일찍 나서서 <b>스타벅스</b>를 들르게 돼요. 시간이 여유 있는 날엔 매장에서, 시간이 없는 날엔... ",
//     "sentiment": "긍정"
//   },
//   {
//     "date": "20250213",
//     "description": "만들어줄 <b>스타벅스</b> 발렌타인 리유저블 텀블러 소식을 들고왔는데요..! 무엇보다 이번에 뜬 디자인이 너무 예뻐서 일찍 가지 않으면 겟하기 어려울거 같아서 얼른 다녀왔습니다 그럼 리뷰쓰따또 <b>스타벅스</b>... ",
//     "sentiment": "긍정"
//   },
//   {
//     "date": "20250215",
//     "description": "'3')/ 이번에 <b>스타벅스</b> 신메뉴 나온 거 드셔보셨나요? 제가 또 하나를 마셔보았습니다 바로 <b>스타벅스</b> 아몬드 크림 오뜨 라떼! 아니 이거 인기 많던데요? 제가 첫번째 매장에 방문했는데 솔드아웃이라고 그래서... ",
//     "sentiment": "부정"
//   },
//   {
//     "date": "20250214",
//     "description": "그래서 잠시 <b>스타벅스</b> 위치를 확인하고 들러서 기프티콘과 페이 카드를 활용해 커피를 마셨어요. <b>스타벅스</b> 인천공항T2에어점 위치 : 인천 중구 제2터미널대로 444 (운서동)인천공항2터미널 3층 Air side 운영시간... ",
//     "sentiment": "긍정"
//   },
//   {
//     "date": "20250209",
//     "description": "<b>스타벅스</b> 점점 독특해짐 핫플 서울 장충동 스벅 리저브 카페 회장님댁 장충라운지 가볼만해요. 주택가에 있는 장충라운지R매장 입구는 웅장한 나무대문에 <b>스타벅스</b> 리저브 간판하나 달랑... ",
//     "sentiment": "긍정"
//   },
//   {
//     "date": "20250214",
//     "description": "우붓 <b>스타벅스</b>로 가는 길에 있던 지도 우붓 왕궁에서 도보로 5분도 안걸림 나무 간판이 멋진 우붓 <b>스타벅스</b> 우붓 <b>스타벅스</b> 옆에는 따만 사라스와띠 사원이 있다 입구가 같음 따만 사라스와띠 사원으로 가려면... ",
//     "sentiment": "긍정"
//   },
//   {
//     "date": "20250208",
//     "description": "집순이의 주말 외출 *동물병원에서 약 받기 *이마트에서 장보기 *<b>스타벅스</b> 쿠폰 사용하기 <b>스타벅스</b>에서 제조음료 1+1 쿠폰을 넣어줬길래 신나게 쿠폰 사용을 하고 왔어요 쿠폰사용기간이 3일로 짧지만 주말이... ",
//     "sentiment": "중립"
//   },
//   {
//     "date": "20250213",
//     "description": "<b>스타벅스</b> 핑크 리유저블 컵 받는 방법 <b>스타벅스</b> 핑크 리유저블 컵 받는 방법을 먼저 알려드릴게요! 오후 2시~저녁 8시까지 아몬드크림라떼, 헤이즐넛클라우드모카, 카라멜마끼아또, <b>스타벅스</b>딸기라떼 ! 이 4가지... ",
//     "sentiment": "긍정"
//   },
//   {
//     "date": "20250203",
//     "description": "<b>스타벅스</b>는 1971년 미국 시애틀에서 시작해 현재 전 세계 80여 개국에 매장을 운영 중에 있는 세계적인... 않게 <b>스타벅스</b> 커피를 맛볼 수 있다. 이 시간에는 이렇게 전 세계인의 사랑을 받는 <b>스타벅스</b>의 메뉴 및... ",
//     "sentiment": "긍정"
//   },
//   {
//     "date": "20250214",
//     "description": "<b>스타벅스</b> 핑크리유저블컵 헤이즐넛 클라우드 모카 오늘은 저희 교회 유년부 겨울성경학교날이에요.... 아들과 함께 분위기 좋은 레스토랑에서 점심도 먹고 2차로 티타임을 즐기려고 오랜만에 <b>스타벅스</b>에... ",
//     "sentiment": "긍정"
//   }
// ]

// {
//   "startDate": "2024-12-30",
//   "endDate": "2025-02-02",
//   "timeUnit": "week",
//   "results": [
//     {
//       "title": "커피",
//       "keywords": [
//         "아메리카노",
//         "카페라떼"
//       ],
//       "data": [
//         {
//           "period": "2024-12-30",
//           "ratio": 8.7956
//         },
//         {
//           "period": "2025-01-06",
//           "ratio": 9.39036
//         },
//         {
//           "period": "2025-01-13",
//           "ratio": 8.39528
//         },
//         {
//           "period": "2025-01-20",
//           "ratio": 9.33318
//         },
//         {
//           "period": "2025-01-27",
//           "ratio": 9.4018
//         }
//       ]
//     },
//     {
//       "title": "주스",
//       "keywords": [
//         "오렌지",
//         "딸기"
//       ],
//       "data": [
//         {
//           "period": "2024-12-30",
//           "ratio": 95.47066
//         },
//         {
//           "period": "2025-01-06",
//           "ratio": 100
//         },
//         {
//           "period": "2025-01-13",
//           "ratio": 94.24682
//         },
//         {
//           "period": "2025-01-20",
//           "ratio": 77.2618
//         },
//         {
//           "period": "2025-01-27",
//           "ratio": 62.09539
//         }
//       ]
//     }
//   ]
// }
