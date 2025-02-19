import React from 'react'
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { SideBar } from './SideBar/SideBar'

export const Layout = () => {
  return (
    <Wrapper>
      <SideBar />
      <ContentArea>
        <Outlet />
      </ContentArea>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr;
  height: 98.4vh;
`
const ContentArea = styled.div``
