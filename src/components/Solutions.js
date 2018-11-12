import React, {Component} from 'react'
import styled from 'styled-components'
import ServerLanding from '../components/server/ServerLanding';

class Solutions extends Component {

  render() {
    return (
      <SolutionsWrapper>
        <div className='solutions-grid'>
          <h2 className='solutions-grid-header'>Build with uPort for different application types</h2>
          <ServerLanding />

        </div>
      </SolutionsWrapper>
    )
  }
}

export default Solutions

const SolutionsWrapper = styled.div`
.solutions-grid {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-gap: 50px;
  padding-top: 100px;
  padding-top: 150px;
  margin-bottom: -150px;
}
.solutions-grid-header {
  padding: 0 20px;
  text-align: center;
}

`
