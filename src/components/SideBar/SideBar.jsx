import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { FaCog, FaSignOutAlt } from 'react-icons/fa'
import profile from '../../assets/profile.svg'
import { Modal } from '../Modal'
import { useNavigate, Link } from 'react-router-dom'
import { Bookmark } from './Bookmark'
import { Search } from './Search'
import { AuthContext } from '../../contexts/AuthContext'
import { useSearch } from '../../contexts/SearchContext'

export const SideBar = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const { auth, logout } = useContext(AuthContext)
  const { updateSearchState } = useSearch()

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setModalVisible(false)
    navigate('/')
  }

  const handleLogoClick = () => {
    updateSearchState({
      keyword: '',
      relatedKeywords: [],
      startDate: '',
      endDate: '',
      timeUnit: '',
      device: '',
      gender: '',
      ages: [],
      comparisonTarget: '',
      comparisonKeywords: [],
      resultData: null,
      datalabData: null,
      loading: false,
      error: null,
    })
  }

  return (
    <SidebarContainer>
      <Logo to="/dashboard" onClick={handleLogoClick}>
        OrangeFarm
      </Logo>

      <NavSection>
        <Search />
        <Bookmark />
      </NavSection>

      <UserSection>
        <UserProfile>
          <Avatar src={profile} alt="User Avatar" />
          <UserInfo>
            <UserName>{auth.user ? auth.user.nickname : 'unknown'}</UserName>
            <UserRole>{auth.isAuthenticated ? 'Admin' : 'Guest'}</UserRole>
          </UserInfo>
        </UserProfile>
        <SettingsLink>
          <FaCog /> Settings
        </SettingsLink>
        <LogoutLink onClick={() => setModalVisible(true)}>
          <FaSignOutAlt /> Log out
        </LogoutLink>
        {modalVisible && (
          <Modal
            title="계정을 로그아웃하시겠습니까?"
            message="해당 대시보드에 액세스하려면 다시 로그인해야 합니다."
            onCancel={() => setModalVisible(false)}
            onConfirm={handleLogout}
          />
        )}
      </UserSection>
    </SidebarContainer>
  )
}

const SidebarContainer = styled.div`
  /* width: 15vw; */
  /* height: 100vh; */
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`

const Logo = styled(Link)`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-decoration: none;
`

const NavSection = styled.div`
  flex-grow: 1;
`

const UserSection = styled.div``

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const UserName = styled.span`
  font-size: 14px;
  color: #333;
`

const UserRole = styled.span`
  font-size: 12px;
  color: #888;
`

const SettingsLink = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`

const LogoutLink = styled.div`
  font-size: 14px;
  color: #ff4d4d;
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`
