import { useState, useContext, createContext, useEffect } from "react";
import Swal from 'sweetalert2';

const OrderContext = createContext();

const ORDER = {
  user:"",
  products:[],
  total: 0
}

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  // Estado inicial de la orden
  const [order, setOrder] = useState(JSON.parse(localStorage.getItem("order")) || ORDER);
  const [sidebarToggle, setSidebarToggle] = useState(false); // Estado del sidebar
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0); // Nuevo estado para el contador del carrito

  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(order));
    calculateTotal(order.products);
    CartCount();
   
  }, [order]);

  // Función para agregar un producto a la orden
  function addOrderItem(producto) {
    const product = order.products.find(prod => prod.product === producto._id);

    if (product) {
      handleChangeQuantity(product.product, product.quantity + 1);
    } else {
    

      const newOrderProduct = {
        product: producto._id,
        quantity:1,
        price:producto.price,
        image:producto.image,
        name: producto.name

      }
      
    const products = [...order.products, newOrderProduct

     ];
     const total = calculateTotal(products)

      setOrder({...order,
                    products, 
                    total
        });


    }
  }

  // Calcular el total de la orden
 // Calcular el total de la orden
function calculateTotal(ARRAY_CONTAR = []) {
  let totalCount = 0;
  ARRAY_CONTAR.forEach((prod) => {
    totalCount += prod.price * prod.quantity;
  });
  return totalCount;
}

useEffect(() => {
  localStorage.setItem("order", JSON.stringify(order));
  calculateTotal(order.products); // Pasa el arreglo de productos
  CartCount();
}, [order]);

  // Calcular la cantidad total de productos en el carrito
  function CartCount() {
    let count = 0;
    order.products.forEach((prod) => {
      count += prod.quantity;
    });
    setCartCount(count);
  }

  // Manejar cambios en la cantidad de un producto
  function handleChangeQuantity(id, quantity) {
    const updProducts = order.products.map((item) => {
      if (item.product === id) {
        item.quantity = +quantity;

       }
       return item;
      
      
    });

    const total = calculateTotal(updProducts)
    setOrder({...order, products:updProducts, total});
   
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
        const products = order.products.filter((prod) => prod.product !== id);
        const total = calculateTotal(products);
        setOrder({...order, products, total});
        
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
    <OrderContext.Provider value={{ 
      order, 
      total, 
      cartCount, 
      addOrderItem, 
      handleChangeQuantity, 
      removeItem, 
      sidebarToggle,
       toggleSidebarOrder,
        closeSidebar }}>
      {children}
    </OrderContext.Provider>
  );
};
