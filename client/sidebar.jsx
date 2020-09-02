import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Style from './style.jsx';

const PATH = document.location.pathname.substring(1);

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.product || {},
      // seller: props.seller || { reviews: { rating: 0 } },
      isWatched: false
    };
  }

  // when initializing the page
  componentDidMount() {
    // send a get request for the product and seller infomation
    axios.get(`/sb/api/${PATH}`)
    .then((result) => {
        this.setState({
          //legacy code set state
          // product: result.data.product,
          // seller: result.data.product.seller

          //postgres set state
          product: result.data.rows[0],

          //cassandra set state


        });
        console.log(this.state)
      })
      .catch(() => null);
  }

  categoryStyleBrand() {
    const text = `${this.state.product.category}`
       + ` > ${this.state.product.style}`
       + ` > ${this.state.product.brand}`;
    return (
      <div className="sb-smallText sb-grey">
        {text}
      </div>
    );
  }

  condition() {
    return (
      <div className="sb-smallText sb-green sb-dashBottomBorder">
        {this.state.product.condition}
      </div>
    );
  }

  cost() {
    return (
      <div className="sb-bigSpace">
        <div className="sb-smallText">
          Shipping fee: {this.state.product.shippingfee}
        </div>
        <div className="sb-lineThroughText">
          ${this.state.product.priceoriginal}
        </div>
        <div className="sb-bold sb-bigText">
          ${this.state.product.priceactual}
        </div>
        <div className="sb-smallText sb-grey">
          +Shipping
        </div>
      </div>
    );
  }

  watchProduct() {
    // get the watch button
    var watchButton = document.getElementById('watchButton');
    var currentlyWatched = this.state.isWatched;
    if (currentlyWatched) {
      // set button text to ☆ Watch
      watchButton.innerHTML = '☆ Watch';
    } else {
      // set button text to ★ Watch
      watchButton.innerHTML = '★ Watch';
    }

    this.setState({
      isWatched: !currentlyWatched
    });
  }

  openToOffer() {
    if (this.state.product.isopentooffers) {
      return (
        <div className="sb-smallText sb-goldenrod sb-dialogBubble">
          This seller is open to offers
        </div>
      );
    }
  }

  shippingSpeed() {
    // if (this.state.seller.isQuickShipper) {
      if (this.state.product.isquickshipper) {
      return (
        <div className="sb-greyBottomBorder">
          <div className="sb-bigSpace sb-floatLeft">
            <img
              src="https://live.staticflickr.com/65535/50230580552_b385a5e7a6_t.jpg"
              alt=""
            />
          </div>
          <div className="sb-bigSpace">
            <div className="sb-smallText sb-bold">
              Still Shipping Quickly
            </div>
            <div className="sb-smallText sb-grey">
              This seller is shipping orders within 24 hours, on average.<br /><br />
            </div>
          </div>
        </div>
      );
    }
  }

  confidence() {
    const text = 'Reverb Protection has you covered. We provide a safe community for finding the gear you want';
    return (
      <div className="sb-greyBottomBorder">
        <div className="sb-bigSpace sb-floatLeft">
          <img
            src="https://live.staticflickr.com/65535/50229716218_21f92f760b_t.jpg"
            alt=""
          />
        </div>
        <div className="sb-bigSpace">
          <div className="sb-smallText sb-bold">
            Buy With Confidence
          </div>
          <div className="sb-smallText sb-grey">
            {text}
          </div>
        </div>
      </div>
    );
  }

  sellerRaiting(rating) {
    let text = '';
    for (var i = 0; i < rating; i++) {
      text += '★';
    }
    for (var i = text.length; i < 5; i++) {
      text += '☆';
    }
    return (
      <div className="sb-orange">
        {text}
      </div>
    );
  }

  joinedYear() {
    return (
      <div>
        <div>Joined Reverb</div>
        {/* <div>{this.state.seller.joinedYear}</div> */}
        <div>{this.state.product.joinyear}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Style.Global />
        <div className="sb-whole">
          {this.categoryStyleBrand()}
          <div className="sb-bigText">{this.state.product.productname}</div>
          {this.condition()}
          {this.cost()}
          <button className="sb-bigButton">Add to Cart</button>
          <div>
            <button className="sb-smallButton sb-bold">
              Make an Offer
            </button>
            <button
              className="sb-smallButton sb-bold sb-floatRight"
              id="watchButton"
              onClick={this.watchProduct.bind(this)}
            >
              ☆ Watch
            </button>
          </div>
          {this.openToOffer()}
          {this.shippingSpeed()}
          {this.confidence()}
          <section className="sb-smallText">
            <div className="sb-bigSpace sb-grey sb-half sb-floatLeft">
              Shipped From
              {/* <div className="sb-bold sb-black">{this.state.seller.name}</div> */}
              <div className="sb-bold sb-black">{this.state.product.sellername}</div>
              {/* <div>{this.state.seller.address}</div> */}
              <div>{this.state.product.address}</div>
              {/* {this.sellerRaiting(this.state.seller.reviews.rating)} */}
              {this.sellerRaiting(this.state.product.reviews)}
              {this.joinedYear()}
            </div>
            <div className="sb-extraSpace sb-blue">
              <img
                src="https://live.staticflickr.com/65535/50230360666_5e65ab8b7c_t.jpg"
                alt=""
              />
            </div>
          </section>
          <div>
            <button className="sb-smallButton sb-smallText sb-bold">
              Message Seller
            </button>
            <button className="sb-smallButton sb-smallText sb-bold sb-floatRight">
              Payment &#38; Returns
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Sidebar />, document.getElementById('sb'));
