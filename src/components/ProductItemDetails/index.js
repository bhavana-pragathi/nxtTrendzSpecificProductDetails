// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {Loader} from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsData: {},
    count: 1,
    similarProductsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getConvertedData = data => ({
    availability: data.availability,
    brand: data.brand,
    id: data.id,
    title: data.id,
    price: data.price,
    rating: data.rating,
    totalReviews: data.total_reviews,
    description: data.description,
    imageUrl: data.image_url,
  })

  getData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getConvertedData(fetchedData)
      const updatedSimilarProducts = fetchedData.similar_products.map(
        eachSimilarProd => this.getConvertedData(eachSimilarProd),
      )
      this.setState({
        productsData: updatedData,
        similarProductsList: updatedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 400) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  renderSuccessPage = () => {
    const {similarProductsList, productsData, count} = this.state
    const {
      imageUrl,
      brand,
      title,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productsData
    return (
      <div>
        <div className="main-div">
          <img className="product-image" src={imageUrl} alt={title} />
          <div className="content-div">
            <h1 className="prod-name">{title}</h1>
            <p className="prod-price"> Rs {price}/- </p>
            <div className="review-rating">
              <div className="rating-div">
                <p className="prod-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>
              <p className="prod-total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="prod-desc">{description}</p>
            <p className="prod-availability">Available: {availability}</p>
            <p className="prod-brand">Brand: {brand}</p>
            <hr />
            <div className="inc-dec">
              <button
                className="button-inc"
                onClick={this.onDecrement}
                type="button"
              >
                <BsDashSquare className="btn-icons" />
              </button>
              <p>{count}</p>
              <button
                className="button-dec"
                onClick={this.onIncrement}
                type="button"
              >
                <BsPlusSquare className="btn-icons" />
              </button>
            </div>
            <button className="add-to-cart" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-prod-head">Similar Products</h1>
        <ul className="list-items">
          {similarProductsList.map(eachSimilarProd => (
            <SimilarProductItem
              key={eachSimilarProd.id}
              similarProductDetails={eachSimilarProd}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessPage()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderProductData()}</div>
      </>
    )
  }
}

export default ProductItemDetails
