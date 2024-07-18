import { useState, useEffect } from "react";
import ProductCard from "../product-card/ProductCard";
import axios from "axios";
import "./ProductList.css";
import Pagination from "/src/components/pagination/Pagination"; 

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const pageItems = 5; // Número de productos por página

  useEffect(() => {
    getProducts();
  }, [currentPage]);

  async function getProducts() {
    try {
      const URL = `http://localhost:3000/api/products?page=${currentPage}&limit=${pageItems}`;
      const response = await axios.get(URL);
      const productos = response.data.products;
      setProducts(productos);
      setIsLoading(false);
      console.log("Productos obtenidos:", productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setIsLoading(false);
    }
  }

  const totalItems = products.length;

  // Función para calcular el número total de páginas
  const totalPages = Math.ceil(totalItems / pageItems);

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

      <Pagination
        totalItems={totalItems}
        pageItems={pageItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}