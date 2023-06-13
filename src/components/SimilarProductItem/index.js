import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {imageUrl, title, price, brand, rating} = similarProductDetails
  return (
    <li>
      <img
        className="similar-prod-img"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <h1 className="sim-head">{title}</h1>
      <p className="sim-brand">{brand}</p>
      <div className="price-rating">
        <p className="sim-price">Rs {price}/- </p>
        <p className="rating-div">
          <span className="sim-rating">{rating}</span>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
