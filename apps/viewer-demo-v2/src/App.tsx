import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { ErrorBoundary } from 'react-error-boundary'

import TestPage from './pages/Test'
import SvgPage from './pages/Svg'
import WebglPage from './pages/Webgl'
import TestCustom from './pages/TestCustom'
import Home from './pages'
import NoOverlay from './pages/NoOverlay'
import { atom } from 'jotai'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  .navigator {
    width: 160px !important;
    height: 160px !important;
    border: solid 1px rgba(134, 148, 177, 0.16) !important;
    background-color: #fff !important;
    margin-top: 16px !important;
    margin-right: 16px !important;
    border-radius: 4px;
  }
  .displayregion {
    border: 2px solid #5a79e3 !important;
  }
`

const OSDContainer = styled.div`
  flex: 1;
  height: 100%;
`

const Links = styled.div`
  width: 100px;
  a {
    display: block;
  }
`

// function makeTiledCoords(
//   tiles: number,
//   coordCount: number,
//   hSize: number,
//   wSize: number
// ) {
//   const squirt = Math.sqrt(tiles)
//   if (squirt % 1 !== 0) {
//     console.error('makeTiledCoords requires a square number')
//     return [{ h: 0, w: 0, y: 0, x: 0, data: [0] }]
//   }
//   const out = []
//   const h = hSize / squirt
//   const w = wSize / squirt
//   for (let i = 0; i < squirt; i++) {
//     const x = w * i
//     for (let j = 0; j < squirt; j++) {
//       const y = h * j
//       out.push({
//         h,
//         w,
//         y,
//         x,
//         data: makeRandomCoords(coordCount / tiles, h, w),
//       })
//     }
//   }
//   return out
// }

export const scaleFactorAtom = atom(1)
export const viewportZoomAtom = atom(1)

function App(this: any) {
  return (
    <BrowserRouter>
      <Container>
        <Links>
          <NavLink to="/">HOME</NavLink>
          <NavLink to="/test-custom">CUSTOM IMG URL</NavLink>
          <NavLink to="/no-overlay">NO OVERLAY</NavLink>
          <NavLink to="/test">TEST</NavLink>
          <NavLink to="/webgl">TEST WEBGL</NavLink>
          <NavLink to="/svg">SVG</NavLink>
        </Links>
        <Switch>
          <OSDContainer>
            <Route exact path="/test-custom">
              <TestCustom />
            </Route>
            <Route exact path="/no-overlay">
              <NoOverlay />
            </Route>
            <Route exact path="/test">
              <TestPage />
            </Route>
            <Route exact path="/webgl">
              <WebglPage />
            </Route>
            <Route exact path="/svg">
              <ErrorBoundary fallback={<div>error boundary test</div>}>
                <SvgPage />
              </ErrorBoundary>
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </OSDContainer>
        </Switch>
      </Container>
    </BrowserRouter>
  )
}

export default App
