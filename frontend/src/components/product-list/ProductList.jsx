import { useState, useEffect } from "react";
import ProductCard from "../product-card/ProductCard";
import axios from "axios";
import "./ProductList.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    try {
      const URL = `http://localhost:3000/api/products`;
      const response = await axios.get(URL);
      const { products: productos } = response.data;
      setProducts(productos);
      setIsLoading(false);
      console.log("Productos obtenidos:", productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h2 className="product-list-title">LISTA DE PRODUCTOS</h2>

      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="product-card-container">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
