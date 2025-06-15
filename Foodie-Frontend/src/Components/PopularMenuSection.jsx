import React, { useEffect, useState } from "react";
import MenuCard from "../Components/MenuCard";
import axios from "axios";
import Swal from "sweetalert2";
import './MenuSection.css';

const PopularMenuSection = () => {
  const [popularMenus, setPopularMenus] = useState([]);

  useEffect(() => {
    fetchPopularMenus();
  }, []);

  const fetchPopularMenus = async () => {
    try {
      const response = await axios.get("http://localhost:5110/api/UserMenuCategory/allActiveMenus");
      setPopularMenus(response.data.slice(0, 6));
    } catch (error) {
      console.error("Failed to fetch menus:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load popular menu items.',
      });
    }
  };

  return (
    <section className="food_section layout_padding-bottom">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Popular Dishes</h2>
          <p className="explore-menu-text">Enjoy our most loved meals by foodies</p>
        </div>

        <div className="row grid">
          {popularMenus.map((menu) => (
            <div
              key={menu.menuId}
              className="col-sm-6 col-lg-4 wow fadeInUp"
              data-filter={menu.categoryId}
            >
              <MenuCard
                menuId={menu.menuId}
                imgsrc={menu.imageUrl ? `http://localhost:5110${menu.imageUrl}` : ''}
                heading={menu.name}
                description={menu.description}
                price={menu.price}
                quantity={menu.quantity}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularMenuSection;
