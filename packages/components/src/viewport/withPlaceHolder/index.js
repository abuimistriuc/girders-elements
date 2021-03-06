'use strict'

import React from 'react'
import PropTypes from 'prop-types'

export default (WrappedComponent, PlaceHolderComponent) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context)
    }

    render() {
      if (this.props.inViewport) {
        return <WrappedComponent {...this.props} />
      }
      return this.props.placeHolder ? (
        <this.props.placeHolder />
      ) : PlaceHolderComponent ? (
        <PlaceHolderComponent />
      ) : null
    }

    static propTypes = {
      inViewport: PropTypes.bool.isRequired,
      placeHolder: PropTypes.func,
    }

    static displayName = `WithPlaceHolder(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`
  }
}
