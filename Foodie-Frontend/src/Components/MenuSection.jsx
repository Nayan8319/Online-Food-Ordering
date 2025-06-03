import React, { useEffect, useRef, useState } from 'react';
import MenuCard from '../Components/MenuCard';
import axios from 'axios';
import { Link } from 'react-router-dom';  // <-- Import Link here
import './MenuSection.css'; // Ensure correct path

const MenuSection = () => {
  const gridItems = useRef(null);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState(null); // No default "All"
  const [isCardVisible, setIsCardVisible] = useState(false); // Show limited by default
  const [displayedMenus, setDisplayedMenus] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);

  useEffect(() => {
    filterMenus();
  }, [menus, filter, isCardVisible]);

  const fetchMenus = async () => {
    try {
      const response = await axios.get('http://localhost:5110/api/UserMenuCategory/allActiveMenus');
      setMenus(response.data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5110/api/UserMenuCategory/activeCategories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const filterMenus = () => {
    const filtered = filter
      ? menus.filter(menu => menu.categoryId === filter)
      : menus;
    setDisplayedMenus(isCardVisible ? filtered : filtered.slice(0, 6));
  };

  const handleViewMore = () => {
    setIsCardVisible(prev => !prev);
  };

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return '';
    return imageUrl.startsWith('/CategoryImages')
      ? `http://localhost:5110${imageUrl}`
      : `http://localhost:5110/CategoryImages/${imageUrl}`;
  };

  return (
    <section className="food_section layout_padding-bottom">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Our Menu</h2>
          <p className="explore-menu-text">
            Choose from a diverse menu featuring a delectable array of dishes.
          </p>
        </div>

        {/* Category Filter */}
        <div className="explore-menu-list mb-4">
          {categories.map((category) => (
            <div
              key={category.categoryId}
              onClick={() =>
                setFilter((prev) =>
                  prev === category.categoryId ? null : category.categoryId
                )
              }
              className="explore-menu-list-item"
            >
              <img
                className={filter === category.categoryId ? 'active' : ''}
                src={getImageSrc(category.imageUrl)}
                alt={category.name}
              />
              <p>{category.name}</p>
            </div>
          ))}
        </div>
        <hr />

        {/* Menu Cards */}
        <div className="row grid" ref={gridItems}>
          {displayedMenus.map((menu) => (
            <div
              key={menu.menuId}
              className="col-sm-6 col-lg-4 wow fadeInUp"
              data-filter={menu.categoryId}
            >
              {/* Wrap MenuCard inside Link for navigation */}
              <Link to={`/menu/${menu.menuId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuCard
                  menuId={menu.menuId}
                  imgsrc={menu.imageUrl ? `http://localhost:5110${menu.imageUrl}` : ''}
                  heading={menu.name}
                  description={menu.description}
                  price={menu.price}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* View More / View Less Button */}
        {(
          filter
            ? menus.filter(menu => menu.categoryId === filter).length
            : menus.length
        ) > 6 && (
          <div className="btn-box mt-4">
            <a onClick={handleViewMore} style={{ cursor: 'pointer' }}>
              {isCardVisible ? 'View Less' : 'View More'}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
