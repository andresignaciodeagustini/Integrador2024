import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useOrder } from '../../context/OrderContext';
import './OrderSidebar.css';

export default function OrderSidebar() {
  const { order, total, handleChangeQuantity, removeItem, sidebarToggle, closeSidebar } = useOrder();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`order-wrapper ${sidebarToggle ? 'active' : ''} ${isMobileView ? 'mobile-view' : ''}`}>
      <div className="close-icon" onClick={closeSidebar}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
      <div className="list-container">
        <h2>Orden actual:</h2>
        <ul className="order-list">
          {order?.products?.map((product) => (
            <li className="order-item" key={product.product}>
              <img
                className="order-image"
                src={
                   product.image ? `${import.meta.env.VITE_IMAGES_URL}/products/${product.image}` 
                   : "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"}
                alt=""
              />
              <div className="order-item-name" title={product.name}>
                {product.name}
              </div>
              <div className="order-quantity">
                <input
                  type="number"
                  className="order-quantity-input"
                  value={product.quantity}
                  onChange={(evt) => handleChangeQuantity(product.product, evt.target.valueAsNumber)}
                />
              </div>
              <div className="order-price">$ {product.price}</div>
              
              <div className="order-actions">
                <FontAwesomeIcon
                  icon={faTrash}
                  title="Eliminar producto"
                  onClick={() => removeItem(product.product)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="order-finish">
        <div className="total">
          <div className="total-count">Items: {order?.reduce((acc, item) => acc + item.quantity, 0)}</div>
          <div className="total-price">
            Total $ <span>{order.total}</span>
          </div>
        </div>
        <div className="order-purchase">
          {/* Aquí podrías agregar botones o acciones relacionadas con la compra */}
        </div>
      </div>
    </div>
  );
}
