import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";

const SingleMenuItem = () => {
  const { id } = useParams();

  const [menuItem, setMenuItem] = useState(null);
  const [similarMenus, setSimilarMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const fallbackImage = "/fallback-image.png";

  const fetchMenuDetails = async () => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5110/api/UserMenuCategory/menu/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch menu item with id ${id}`);
      const data = await res.json();
      setMenuItem(data);

      const catRes = await fetch(`http://localhost:5110/api/UserMenuCategory/activeCategories`);
      const categories = await catRes.json();
      const matched = categories.find(c => c.categoryId === data.categoryId);
      setCategoryName(matched?.name || "Category");

      setLoading(false);

      setLoadingSimilar(true);
      const similarRes = await fetch(`http://localhost:5110/api/UserMenuCategory/category/${data.categoryId}/menus`);
      const similarData = await similarRes.json();
      setSimilarMenus(similarData.filter(item => item.menuId !== data.menuId));
      setLoadingSimilar(false);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to load data", "error");
      setLoading(false);
      setLoadingSimilar(false);
    }
  };

  useEffect(() => {
    fetchMenuDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const addProductToCart = async (item) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          title: "Login Required",
          text: "Please login to add items to cart.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      const cartRes = await fetch("http://localhost:5110/api/CartOrder", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartJson = await cartRes.json();
      const cartItems = Array.isArray(cartJson) ? cartJson : cartJson.items || [];

      const existingItem = cartItems.find(ci => ci.menuId === item.menuId);
      const existingQty = existingItem ? existingItem.quantity : 0;
      const newTotalQty = existingQty + quantity;

      if (newTotalQty > 10) {
        Swal.fire({
          title: "Limit Exceeded",
          text: `You can't add more than 10 units of "${item.name}" to your cart.`,
          icon: "info",
        });
        return;
      }

      const response = await fetch("http://localhost:5110/api/CartOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menuId: item.menuId,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to add to cart");
      }

      Swal.fire({
        title: "Added!",
        text: `"${item.name}" has been added to your cart.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    }
  };

  const renderSkeleton = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3"><Skeleton height={400} /></div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={20} count={2} />
          <Skeleton height={40} width={100} />
          <Skeleton height={80} />
          <Skeleton height={40} width={120} inline />
        </div>
      </div>
    </div>
  );

  const renderSimilarSkeleton = () => (
    <div className="d-flex">
      {[1, 2, 3].map(i => (
        <div key={i} className="mx-4"><Skeleton height={300} width={220} /></div>
      ))}
    </div>
  );

  return (
    <div className="container pt-5 mt-4">
      <div className="row">
        {loading ? (
          renderSkeleton()
        ) : menuItem ? (
          <div className="row my-5 py-2">
            <div className="col-md-6 py-3">
              <img
                className="img-fluid"
                src={menuItem.imageUrl ? `http://localhost:5110${menuItem.imageUrl}` : fallbackImage}
                alt={menuItem.name || "Menu Item"}
                width="400"
                height="400"
                onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
              />
            </div>
            <div className="col-md-6 py-5">
              <h4 className="text-muted text-uppercase">{categoryName}</h4>
              <h1 className="display-5">{menuItem.name}</h1>
              <h3 className="display-6 my-3">₹{menuItem.price}</h3>
              <p className="lead">{menuItem.description}</p>
              <div className="d-flex align-items-center mb-3">
                <label className="me-2">Qty:</label>
                <select
                  className="form-select w-auto"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-outline-dark"
                onClick={() => addProductToCart(menuItem)}
              >
                Add to Cart
              </button>
              <Link to="/cart" className="btn btn-dark mx-3">Go to Cart</Link>
            </div>
          </div>
        ) : (
          <p className="my-5 text-center">Menu item not found.</p>
        )}
      </div>

      <div className="row my-5 py-5">
        <div className="d-none d-md-block">
          <h2 className="mb-4">You may also like</h2>
          <div className="marquee-fix">
            <Marquee pauseOnHover={true} speed={50}>
              {loadingSimilar ? (
                renderSimilarSkeleton()
              ) : (
                similarMenus.length > 0 ? similarMenus.map((item) => (
                  <div key={item.menuId} className="card mx-3 text-center" style={{ width: '220px' }}>
                    <img
                      className="card-img-top p-2"
                      src={item.imageUrl ? `http://localhost:5110${item.imageUrl}` : fallbackImage}
                      alt={item.name}
                      height="200"
                      onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                    />
                    <div className="card-body">
                      <h6 className="card-title">{item.name}</h6>
                      <p className="card-text">₹{item.price}</p>
                      <Link
                        to={`/menu/${item.menuId}`}
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      >
                        View
                      </Link>
                      <div style={{ height: "10px" }}></div>
                      <button
                        className="btn btn-sm btn-dark"
                        onClick={() => addProductToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )) : <p className="mx-3">No similar menu items found.</p>
              )}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMenuItem;
