"use strict";
import React from 'react'
import Button from 'app/components/button.jsx'
import Api from 'app/api.js'


function RatiosList(props) {
  return <ul className="nav col-md-2">
    <li className="heading">{props.heading}</li>
    {props.ratios.map((ratio, idx) => {
      return <li key={idx}>
        <a onClick={() => props.onRatioClick(ratio)}>
          {ratio[1]}
        </a>
      </li>
    })}
  </ul>
}

RatiosList.propTypes = {
  heading: React.PropTypes.string.isRequired,
  ratios: React.PropTypes.array.isRequired,
  onRatioClick: React.PropTypes.func.isRequired
}


class RatioGallery extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleCategorySelection = this.handleCategorySelection.bind(this)
    this.state = {
      ratios: [],
      galleryOpen: false,
      currentCategory: "Annual Results"
    }
  }

  handleOpen() {
    return Api.get(['ratios', 'all']).then(
      response => {
        this.setState({
          ratios: response,
          galleryOpen: true
        })
        this.props.onOpen()
      }
    )
  }

  handleClose() {
    this.setState({galleryOpen: false})
    this.props.onClose()
  }

  handleCategorySelection(category) {
    this.setState({currentCategory: category})
  }

  getCategoryGroups(ratios, currentCategory) {
    var groups = {
      recent: [],
      preceding: [],
      historical: []
    }
    for (var i = 0; i < ratios.length; i++) {
      var ratio = ratios[i]
      var category = ratio[3]
      if (currentCategory != category)
        continue
      var group
      if (ratio[1].indexOf("receding") > -1)
        group = "preceding"
      else if (ratio[1].search(/\dyear/i) > -1)
        group = "historical"
      else
        group = "recent"
      groups[group].push(ratio)
    }
    return groups
  }

  renderOpen() {
    var categories = [
      "Annual Results",
      "Balance Sheet",
      "Cash Flow Statement",
      "Quarterly Results",
      "Valuation",
      "Ratios"
    ]
    var currentCategory = this.state.currentCategory
    var ratios = this.state.ratios.system_ratios
    var groups = this.getCategoryGroups(ratios, currentCategory)
    return <div className="gallery">
      <div className="pull-right">
        <br />
        <Button
          style="danger"
          icon="eye-close"
          onClick={this.handleClose}
          name="Close Gallery"
        />
      </div>

      <div className="row">
        <ul className="nav col-md-2">
          <li className="heading">Select Category</li>
          {categories.map((category, idx) => {
            var active = currentCategory == category ? 'active' : ''
            return <li key={idx} className={active}>
              <a onClick={() => this.handleCategorySelection(category)}>
                {category}
              </a>
            </li>
          })}
        </ul>

        <RatiosList
          heading="Recent"
          ratios={groups.recent}
          onRatioClick={this.props.onRatioClick}
          />
        <RatiosList
          heading="Preceding"
          ratios={groups.preceding}
          onRatioClick={this.props.onRatioClick}
          />
        <RatiosList
          heading="Historical"
          ratios={groups.historical}
          onRatioClick={this.props.onRatioClick}
          />
      </div>
    </div>
  }

  render() {
    if (this.state.galleryOpen)
      return this.renderOpen()
    return <div className="pull-right">
      <br />
      <Button
        style="default"
        icon="eye-open"
        onClick={this.handleOpen}
        name="Show all ratios"
      />
    </div>
  }
}

RatioGallery.propTypes = {
  onOpen: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func.isRequired,
  onRatioClick: React.PropTypes.func.isRequired
}

module.exports = RatioGallery