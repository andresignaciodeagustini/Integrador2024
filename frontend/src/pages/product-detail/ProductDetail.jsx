import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useOrder } from "../../context/OrderContext";
import Header from "../../layout/header/Header";
import OrderSidebar from "../../layout/order-sidebar/OrderSidebar"; // Importa OrderSidebar
import "./ProductDetail.css";

const URL = "https://665e5e8e1e9017dc16efd098.mockapi.io";

const ProductDetail = () => {
  const { addOrderItem } = useOrder(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(true); 
  const [addedToBagMessage, setAddedToBagMessage] = useState(false); 
  const { id } = useParams();

  async function getProductById(id) {
    try {
      const response = await axios.get(`${URL}/products/${id}`);
      const formattedProduct = {
        ...response.data,
        createdAt: formatTimestampToInputDate(response.data.createdAt),
      };
      setProduct(formattedProduct);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getProductById(id);
  }, [id]);

  function formatTimestampToInputDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  const closeDetail = () => {
    setDetailVisible(false);
  };

  const handleAddToBag = () => {
    if (product) {
      addOrderItem(product);
      setAddedToBagMessage(true); 
      setTimeout(() => {
        setAddedToBagMessage(false); 
      }, 5000);
    }
  };

  if (loading) {
    return <h4>Cargando...</h4>;
  }

  if (!detailVisible) {
    return null; 
  }

  return (
    <>
      <Header isProductDetailPage={true} />

      <div>
        <section className="product-details">
          <div className="product-header">
            <div className="image-detail">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-action">
              <h2>{product.name}</h2>
              <h5>{`AR$ ${product.price}`}</h5>
              <h6>COLOR</h6>
              <div className="color-picker">
                <button className="color-circle" data-color="black"></button>
                <button className="color-circle" data-color="white"></button>
              </div>
              <div className="tallas-guide">
                <h6>TALLA</h6>
                <div className="tallas-buttons">
                  <button value="2">2</button>
                  <button value="4">4</button>
                  <button value="6">6</button>
                  <button value="16">8</button>
                </div>
              </div>
              <div className="bottom-detail">
                <button className="add-to-bag-button" onClick={handleAddToBag}>
                  AÑADIR 
                </button>
                {addedToBagMessage && (
                  <p className="added-to-bag-message">SE HA AÑADIDO EL PRODUCTO</p>
                )}
              </div>
            </div>
         
            <div className="product-header-icon">
              <Link to="/">
                <FontAwesomeIcon icon={faTimes} className="custom-icon" onClick={closeDetail} />
              </Link>
            </div>
          </div>

          <div className="product-text">
            <h4>{`Art. Nr. ${product.id}. Aranceles de importación incluidos`}</h4>
            <p>{product.description}</p>
            <p>{product.details}</p>
          </div>
        </section>
      </div>

      {/* Aquí integrar el componente OrderSidebar */}
      <OrderSidebar />
    </>
  );
};

export default ProductDetail;
