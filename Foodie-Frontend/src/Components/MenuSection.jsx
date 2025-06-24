import React, { useEffect, useState } from 'react';
import MenuCard from '../Components/MenuCard';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MenuSection.css';

const MenuSection = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);

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

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return '';
    return imageUrl.startsWith('/CategoryImages')
      ? `http://localhost:5110${imageUrl}`
      : `http://localhost:5110/CategoryImages/${imageUrl}`;
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (categoryId) => {
    setFilterCategory((prev) => (prev === categoryId ? null : categoryId));
    setCurrentPage(1); // Reset page to 1 on filter
  };

  const sortMenus = (menuList) => {
    switch (sortOption) {
      case 'name':
        return [...menuList].sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return [...menuList].sort((a, b) => a.price - b.price);
      case 'quantity':
        return [...menuList].sort((a, b) => a.quantity - b.quantity);
      default:
        return menuList;
    }
  };

  const filteredMenus = filterCategory !== null
    ? menus.filter((menu) => Number(menu.categoryId) === Number(filterCategory))
    : menus;

  const sortedMenus = sortMenus(filteredMenus);
  const totalPages = Math.ceil(sortedMenus.length / itemsPerPage);
  const paginatedMenus = sortedMenus.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <div className="explore-menu-list mb-3">
          {/* All Category */}
        
          {categories.map((category) => (
            <div
              key={category.categoryId}
              onClick={() => handleCategoryClick(category.categoryId)}
              className={`explore-menu-list-item ${filterCategory === category.categoryId ? 'active' : ''}`}
            >
              <img
                className={filterCategory === category.categoryId ? 'active' : ''}
                src={getImageSrc(category.imageUrl)}
                alt={category.name}
              />
              <p>{category.name}</p>
            </div>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="d-flex justify-content-end mb-4">
          <select onChange={handleSortChange} value={sortOption} className="form-select w-auto">
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>

        <hr />

        {/* Menu Cards */}
        <div className="row grid">
          {paginatedMenus.length > 0 ? (
            paginatedMenus.map((menu) => (
              <div
                key={menu.menuId}
                className="col-sm-6 col-lg-4 wow fadeInUp"
                data-filter={menu.categoryId}
              >
                <Link
                  to={`/menu/${menu.menuId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <MenuCard
                    menuId={menu.menuId}
                    imgsrc={menu.imageUrl ? `http://localhost:5110${menu.imageUrl}` : ''}
                    heading={menu.name}
                    description={menu.description}
                    price={menu.price}
                    quantity={menu.quantity}
                  />
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center mt-4 mb-5">
              <h5>There are no menu items available in this category. We’ll update it soon!</h5>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(page)}>
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
