import React from "react";

const ContactSection = () => {
  const FormData = (e) => {
    e.preventDefault();
  };

  return (
    <section className="book_section layout_padding">
      <div className="container">
        <div className="heading_container">
          <h2>Contact</h2>
        </div>
        <div className="row">
          <div className="col-md-6 fadeInLeft" data-wow-delay="0.1s">
            <div className="form_container">
              <form onSubmit={FormData}>
                <div>
                  <input type="text" className="form-control" placeholder="Your Name" />
                </div>
                <div>
                  <input type="text" className="form-control" placeholder="Phone Number" />
                </div>
                <div>
                  <input type="email" className="form-control" placeholder="Your Email" />
                </div>
                <div>
                  <select className="form-control nice-select wide">
                    <option readOnly>How many persons?</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <div>
                  <input type="date" className="form-control" />
                </div>
                <div className="btn_box">
                  <button>Book Now</button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 fadeInRight" data-wow-delay="0.1s">
            <div className="map_container">
              <iframe
                src="https://www.google.com/maps/embed?pb=..."
                width="600"
                height="450"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map showing India"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
