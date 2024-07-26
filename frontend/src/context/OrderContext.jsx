import { useState, useContext, createContext, useEffect } from "react";
import Swal from 'sweetalert2';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  // Estado inicial de la orden
  const [order, setOrder] = useState(JSON.parse(localStorage.getItem("order")) || []);
  const [sidebarToggle, setSidebarToggle] = useState(false); // Estado del sidebar
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0); // Nuevo estado para el contador del carrito

  useEffect(() => {
    calculateTotal();
    calculateCartCount();
    localStorage.setItem("order", JSON.stringify(order))
  }, [order]);

  // Función para agregar un producto a la orden
  function addOrderItem(producto) {
    const existingProduct = order.find(prod => prod.id === producto.id);

    if (existingProduct) {
      handleChangeQuantity(existingProduct.id, existingProduct.quantity + 1);
    } else {
      producto.quantity = 1;
      setOrder([...order, producto]);
      // calculateTotal();
      // calculateCartCount();
    }
  }

  // Calcular el total de la orden
  function calculateTotal() {
    let totalCount = 0;
    order.forEach((prod) => {
      totalCount += prod.price * prod.quantity;
    });
    setTotal(totalCount);
  }

  // Calcular la cantidad total de productos en el carrito
  function calculateCartCount() {
    let count = 0;
    order.forEach((prod) => {
      count += prod.quantity;
    });
    setCartCount(count);
  }

  // Manejar cambios en la cantidad de un producto
  function handleChangeQuantity(id, quantity) {
    const updateOrder = order.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Number(quantity) };
      }
      return item;
    });
    setOrder(updateOrder);
    calculateTotal();
    calculateCartCount();
  }

  // Eliminar un producto de la orden
  function removeItem(id) {
    Swal.fire({
      title: "Borrar producto",
      text: "¿Realmente desea quitar este producto?",
      icon: "error",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Borrar",
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        const updatedOrder = order.filter(prod => prod.id !== id);
        setOrder(updatedOrder);
        calculateTotal();
        calculateCartCount();
      }
    });
  }

  // Función para alternar la visibilidad del sidebar de la orden
  function toggleSidebarOrder() {
    setSidebarToggle(prev => !prev);
  }

  // Función para cerrar el sidebar
  function closeSidebar() {
    setSidebarToggle(false);
  }

  return (
    <OrderContext.Provider value={{ order, total, cartCount, addOrderItem, handleChangeQuantity, removeItem, sidebarToggle, toggleSidebarOrder, closeSidebar }}>
      {children}
    </OrderContext.Provider>
  );
};
