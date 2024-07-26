import { useState, useEffect } from "react";
import ProductCard from "../product-card/ProductCard";
import axios from "axios";
import "./ProductList.css";


export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalItems, setTotalItems] = useState(0);
  const pageItems = 5; // Número de ítems por página

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  async function getProducts(page) {
    try {
      const URL = `http://localhost:3000/api/products?page=${page}&limit=${pageItems}`;
      const response = await axios.get(URL);
      const { products: productos, total } = response.data;
      setProducts(productos);
      setTotalItems(total);
      setIsLoading(false);
      console.log("Productos obtenidos:", productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setIsLoading(false);
    }
  }

  // Función para calcular el número total de páginas
  const totalPages = Math.ceil(totalItems / pageItems);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2 className="product-list-title">LISTA DE PRODUCTOS</h2>

      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="product-card-container">
          {products.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      )}

     
    </div>
  );
}
