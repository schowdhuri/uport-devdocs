import React, { Component } from 'react'
import arrowWhite from '../../../images/ArrowWhite.svg'
import arrowBlurple from '../../../images/ArrowBlurple.png'

class AppConfigFooter extends Component {
  render() {
    const {
      Next,
      nextEnabled=false,
      Prev,
      prevEnabled=true,
      onNext,
      onPrev
    } = this.props
    return (<footer className='stepFooter'>
      <div className='cta-prev'>
        {Prev
          ? <button className={prevEnabled ? '' : 'disabled'} onClick={onPrev}>
            <img src={arrowBlurple} />
            <Prev />
          </button>
          : null}
      </div>
      <div className='cta-next'>
        {Next
          ? <button disabled={!nextEnabled} className={nextEnabled ? '' : 'disabled'} onClick={onNext}>
              <Next />
              <img src={arrowWhite} />
          </button>
          : null}
      </div>
    </footer>)
  }
}

export default AppConfigFooter
