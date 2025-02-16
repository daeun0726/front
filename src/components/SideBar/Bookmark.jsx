import React, { useState } from 'react'
import styled from 'styled-components'
import { FaBookmark, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../contexts/FavoritesContext'

export const Bookmark = () => {
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState(null)
  const navigate = useNavigate()
  const { favorites, reports, removeKeyword } = useFavorites()

  const handleBookmarkClick = (keyword) => {
    setSelectedKeyword(keyword)
    navigate(`/${encodeURIComponent(keyword)}/reportlist`)
    console.log(reports)
  }

  return (
    <NavDropdown>
      <DropdownHeader onClick={() => setIsBookmarkOpen(!isBookmarkOpen)}>
        <FaBookmark /> bookmark
        {isBookmarkOpen ? <FaChevronUp /> : <FaChevronDown />}
      </DropdownHeader>
      {isBookmarkOpen && (
        <DropdownList>
          {favorites.map((favorite) => {
            const unreadReportsCount = reports.filter(
              (report) =>
                report.keyword === favorite.keyword && !report.isViewed,
            ).length

            return (
              <DropdownItem
                key={favorite.keyword}
                isSelected={selectedKeyword === favorite.keyword}
              >
                <span
                  onClick={() => handleBookmarkClick(favorite.keyword)}
                  style={{ cursor: 'pointer' }}
                >
                  {favorite.keyword}
                </span>
                {/* 읽지 않은 리포트 개수 표시 */}
                {unreadReportsCount > 0 && (
                  <NotificationBadge>{unreadReportsCount}</NotificationBadge>
                )}
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation()
                    removeKeyword(favorite.keyword)
                  }}
                >
                  <FaTimes />
                </DeleteButton>
              </DropdownItem>
            )
          })}
        </DropdownList>
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

const DropdownList = styled.div`
  padding: 0;
  margin: 0;
`

const DropdownItem = styled.div`
  font-size: 14px;
  color: #666;
  margin-left: 25px;
  margin-bottom: 10px;
  background-color: ${(props) =>
    props.isSelected ? '#f6f6f6' : 'transparent'};
  display: flex;
  align-items: center;
  cursor: pointer;
  /* justify-content: space-between; */
`

const NotificationBadge = styled.span`
  background-color: #ff4d4d;
  color: white;
  padding: 2px 6px;
  border-radius: 50%;
  font-size: 10px;
  margin-left: 5px;
`

const DeleteButton = styled.span`
  color: #888;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  align-items: center;
`
