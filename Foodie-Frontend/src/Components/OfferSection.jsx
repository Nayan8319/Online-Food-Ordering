import React from 'react';
import { Link } from 'react-router-dom';

const OfferSection = () => {
  return (
    <section className="offer_section layout_padding-bottom wow fadeInUp">
      <div className="offer_container">
        <div className="container">
          <div className="row">
            {/* Tasty Thursdays - e.g., categoryId 1 */}
            <div className="col-md-6">
              <div className="box">
                <div className="img-box">
                  <img src="images/o1.jpg" alt="Tasty Thursdays" />
                </div>
                <div className="detail-box">
                  <h5>Tasty Thursdays</h5>
                  <h6>
                    <span>20%</span> Off
                  </h6>
                  <Link to="/menu">
                    Order Now
                    <i className="fa-solid fa-cart-shopping ms-2"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Pizza Days - e.g., categoryId 2 */}
            <div className="col-md-6">
              <div className="box">
                <div className="img-box">
                  <img src="images/o2.jpg" alt="Pizza Days" />
                </div>
                <div className="detail-box">
                  <h5>Pizza Days</h5>
                  <h6>
                    <span>15%</span> Off
                  </h6>
                  <Link to="/menu">
                    Order Now
                    <i className="fa-solid fa-cart-shopping ms-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
