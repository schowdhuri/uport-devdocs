import styled from 'styled-components'

export const xlarge = styles => `
  @media all and (min-width: 1440px) {
    ${styles}
  }
`
export const large = styles => `
  @media all and (min-width: 1024px) {
    ${styles}
  }
`
export const medium = styles => `
  @media all and (min-width: 768px) {
    ${styles}
  }
`
export const small = styles => `
  @media all and (max-width: 767px) {
    ${styles}
  }
`
export const Container = styled.div`
  margin: 0 30px;
  max-width: 1200px;
  ${xlarge('margin: 0 auto;')}
`

export const Grid = styled.div`
  display: grid;
  grid-gap: 30px 20px;
  grid-template-columns: repeat(4, 1fr);
  ${medium(`
    grid-gap: 30px;
    grid-template-columns: repeat(12, 1fr);
  `)}
`

export const Col = styled.div`
  grid-column: span 4;
  ${props => {
    if(props.large) {
      return `
        grid-column: span 12;
        ${large(`grid-column: span ${props.span || 1};`)}
      `
    }
    return `
      grid-column: span 12;
      ${medium(`grid-column: span ${props.span || 1};`)}
    `
  }}

`
