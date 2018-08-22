import React, { Component } from 'react'
import styled from 'styled-components'

class DevSurvey extends Component {

  constructor() {
    super();
    this.state = { choice: null }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const eventName = `content-survey-${this.state.choice !== null ? 'updated' : 'taken'}`;
    switch(event.target.value){
      case 'true':
        this.setState({choice: true}, () => {
          window.analytics.track(eventName, this.state, {context: { ip: '0.0.0.0' }});
        });
        break;
      case 'false':
        this.setState({choice: false}, () => {
          window.analytics.track(eventName, this.state, {context: { ip: '0.0.0.0' }});
        });
        break;
      default:
        this.setState({choice: null});
    }
  }

  render() {
    return(
      <SurveyContainer>
        <form>
          <Row>
            <H5>Was this article helpful?</H5>
            <Column>
              <Input type='radio' value='true' name='survey' onChange={this.handleChange} />
              <Label>
                Yes
              </Label>
            </Column>
            <Column>
              <Input type='radio' value='false' name='survey' onChange={this.handleChange} />
              <Label>
                No
              </Label>
            </Column>
          </Row>
        </form>
      </SurveyContainer>
    )
  }
}

export default DevSurvey

const H5 = styled.h5`
  margin: auto;
  padding-right: 10px;
`

const Input = styled.input`
  margin: auto;
  padding-left: 5px;
`

const Label = styled.label`
  padding-left: 5px;
  padding-right: 10px;
  margin: auto;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
`

const Column = styled.div`
  margin: auto;
  display: flex;
  padding-left: 20px;
`

const SurveyContainer = styled.div`
  padding-top: 20px;
  display: flex;
  margin: auto;
  color: #5c50ca;
`
