import React, { useState } from 'react'
import styled from 'styled-components'
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useSearch } from '../../contexts/SearchContext'
import { useNavigate, Link } from 'react-router-dom'

export const Search = () => {
  const { searchState, updateSearchState, fetchResult, fetchDatalab } =
    useSearch()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const [keyword, setKeyword] = useState(searchState.keyword)
  const [relatedKeywords, setRelatedKeywords] = useState(
    searchState.relatedKeywords,
  )
  const [startDate, setStartDate] = useState(searchState.startDate)
  const [endDate, setEndDate] = useState(searchState.endDate)
  const [timeUnit, setTimeUnit] = useState(searchState.timeUnit)
  const [device, setDevice] = useState(searchState.device)
  const [gender, setGender] = useState(searchState.gender)
  const [ages, setAges] = useState(searchState.ages)
  const [comparisonTarget, setComparisonTarget] = useState(
    searchState.comparisonTarget,
  )
  const [comparisonKeywords, setComparisonKeywords] = useState(
    searchState.comparisonKeywords,
  )

  const ageLabels = {
    1: '0∼12세',
    2: '13∼18세',
    3: '19∼24세',
    4: '25∼29세',
    5: '30∼34세',
    6: '35∼39세',
    7: '40∼44세',
    8: '45∼49세',
    9: '50∼54세',
    10: '55∼59세',
    11: '60세 이상',
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'keyword') setKeyword(value)
    if (name === 'relatedKeywords') setRelatedKeywords(value.split(','))
    if (name === 'startDate') setStartDate(value)
    if (name === 'endDate') setEndDate(value)
    if (name === 'timeUnit') setTimeUnit(value)
    if (name === 'device') setDevice(value)
    if (name === 'gender') setGender(value)
    if (name === 'ages') {
      const newAges = ages.includes(value)
        ? ages.filter((age) => age !== value)
        : [...ages, value]
      setAges(newAges)
    }
    if (name === 'comparisonTarget') setComparisonTarget(value)
    if (name === 'comparisonKeywords') setComparisonKeywords(value.split(','))
  }

  // const handleCheckboxChange = () => {
  //   setIsComparisonDisabled(!isComparisonDisabled)
  //   if (!isComparisonDisabled) {
  //     setComparisonTarget('')
  //     setComparisonKeywords([])
  //   }
  // }

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요')
      return
    }

    updateSearchState({
      keyword,
      relatedKeywords,
      startDate,
      endDate,
      timeUnit,
      device,
      gender,
      ages,
      comparisonTarget,
      comparisonKeywords,
      // isComparisonDisabled,
    })
    await fetchResult()
    await fetchDatalab()

    setIsSearchOpen(false)
  }

  return (
    <NavDropdown>
      <DropdownHeader onClick={() => setIsSearchOpen(!isSearchOpen)}>
        <FaSearch /> search {isSearchOpen ? <FaChevronUp /> : <FaChevronDown />}
      </DropdownHeader>
      {isSearchOpen && (
        <SearchPanel>
          <FieldLabel>
            키워드
            <SearchField
              type="text"
              name="keyword"
              value={keyword}
              placeholder="키워드"
              onChange={handleInputChange}
            />
          </FieldLabel>
          <FieldLabel>
            연관 키워드 (쉼표로 구분)
            <SearchField
              type="text"
              name="relatedKeywords"
              value={relatedKeywords.join(',')}
              placeholder="연관 키워드"
              onChange={handleInputChange}
            />
          </FieldLabel>
          <FieldLabel>
            기간
            <DateContainer>
              <SearchField
                type="date"
                name="startDate"
                value={startDate}
                onChange={handleInputChange}
              />
              <SearchField
                type="date"
                name="endDate"
                value={endDate}
                onChange={handleInputChange}
              />
            </DateContainer>
          </FieldLabel>
          <FieldLabel>
            기간 단위
            <FieldLabelRadio>
              {['day', 'week', 'month'].map((unit) => (
                <RadioInput key={unit}>
                  <input
                    type="radio"
                    name="timeUnit"
                    value={unit}
                    checked={timeUnit === unit}
                    onChange={handleInputChange}
                  />{' '}
                  {unit}
                </RadioInput>
              ))}
            </FieldLabelRadio>
          </FieldLabel>
          <FieldLabel>
            기기 유형
            <FieldLabelRadio>
              {['mo', 'pc'].map((d) => (
                <RadioInput key={d}>
                  <input
                    type="radio"
                    name="device"
                    value={d}
                    checked={device === d}
                    onChange={handleInputChange}
                  />{' '}
                  {d}
                </RadioInput>
              ))}
            </FieldLabelRadio>
          </FieldLabel>
          <FieldLabel>
            성별
            <FieldLabelRadio>
              {['m', 'f'].map((g) => (
                <RadioInput key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={handleInputChange}
                  />{' '}
                  {g}
                </RadioInput>
              ))}
            </FieldLabelRadio>
          </FieldLabel>
          <FieldLabel>
            연령대
            <CheckboxGroup>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((age) => (
                <CheckboxInput key={age}>
                  <input
                    type="checkbox"
                    name="ages"
                    value={age}
                    checked={ages.includes(String(age))}
                    onChange={handleInputChange}
                  />
                  {age}: {ageLabels[age]}
                </CheckboxInput>
              ))}
            </CheckboxGroup>
          </FieldLabel>
          <SearchButton to="/dashboard" onClick={handleSearch}>
            Search
          </SearchButton>
        </SearchPanel>
      )}
    </NavDropdown>
  )
}
const NavDropdown = styled.div`
  margin-bottom: 15px;
`

const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  margin-bottom: 8px;

  svg {
    margin-right: 10px;
  }
  svg:nth-of-type(2) {
    margin-left: 10px;
  }
`
const SearchPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
  margin-bottom: 20px;
`

const SearchField = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
`
const FieldLabel = styled.label`
  font-size: 14px;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 5px;
`
const FieldLabelRadio = styled.label`
  display: flex;
  flex-direction: row;
`

const RadioInput = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
`

const SearchButton = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`
const CheckboxInput = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
`

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`
