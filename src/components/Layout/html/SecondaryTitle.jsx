import React, {Component} from 'react'
import _ from 'lodash'
import { cleanDoubleByteChars } from '../../../helpers/cleanDoubleByteChars'
import Link from 'gatsby-link'

class SecondaryTitle extends Component {
  render () {
    let h2Text = ''
    switch (this.props.children[1].type) {
      case 'strong':
        h2Text = this.props.children[1].props.children[0]
        break
      case 'em':
        h2Text = this.props.children[1].props.children[0].props.children[0]
        break
      case 'a':
        h2Text = this.props.children[2]
        break
      default:
        h2Text = this.props.children[1]
    }
    const svgAnchor = this.props.children[0].props.children[0]
    const id = cleanDoubleByteChars(_.kebabCase(h2Text))
    return (
      <h2 id={id}>
        <Link to={`#${id}`} aria-hidden='true' className='anchor'>
          {svgAnchor}
        </Link>
        {h2Text}
      </h2>
    )
  }
}

export default SecondaryTitle
