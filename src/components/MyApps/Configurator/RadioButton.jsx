import React from 'react'
import styled from 'styled-components'

import tick from '../../../images/Tick.svg'

class RadioButton extends React.Component {
  handleChange = e => {
    const { onChange } = this.props
    if(typeof(onChange) === 'function')
      onChange(e.target.value)
  }
  render() {
    const { checked, name, value, label } = this.props
    return (<Label>
      <Radio type='radio'
        value={value}
        name={name}
        checked={checked}
        onChange={this.handleChange} />
      <p>{label}</p>
      {checked ? <Checked src={tick} /> : <Unchecked />}
    </Label>)
  }
}

const Label = styled.label`
  cursor: pointer;
  padding-bottom: 0;
  position: relative;
`
const Unchecked = styled.div`
  position: absolute;
  top: 5px;
  right: 0;
  height: 25px;
  width: 25px;
  background-color: #f9f9fa;
  border-radius: 50%;
  &:after {
    top: 0;
    left: 0;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 2px solid #e0dfe6;
    content: "";
    position: absolute;
    display: block;
  }
`
const Checked = styled.img`
  position: absolute;
  top: 5px;
  right: 0;
  height: 25px;
  width: 25px;
`
const Radio = styled.input`
  display: none
`
export default RadioButton
