import React from 'react'
import { Container, Grid, Col, Spacer, small } from '../../layouts/grid'

export default props => (<div className='detailsContainer'>
  <Grid>
    <Col span={6}>
      <div className='field'>
        <h4 className='label'>App Name</h4>
        <p>{props.currentApp.name}</p>
      </div>
      <div className='field'>
        <h4 className='label'>Network</h4>
        <p>{props.currentApp.configuration.network}</p>
      </div>
    </Col>
    <Col span={6}>
      <div className='previewContainer'>
        <div className='appItem'>
          <div className='appCover' style={{backgroundColor: props.currentApp.configuration.accentColor || '#5c54c7'}}>&nbsp;</div>
          <div className={'avatar ' + (props.currentApp.configuration.profileImage ? 'uploaded' : 'default')}
            style={props.bgImageStyle}>&nbsp;</div>
          <h3>{props.currentApp.name}</h3>
          <span>{props.currentApp.configuration.network}</span>
        </div>
        <p>This is how users see your app in their uPort mobile app.</p>
      </div>
    </Col>
  </Grid>
</div>)
