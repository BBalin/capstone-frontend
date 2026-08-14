import { useEffect, useState } from "react";
import "./all-products.css";

const BASE = import.meta.env.VITE_API;
const RESOURCE = "/products";
const PRODUCTS_URL = BASE + RESOURCE;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatPrice(price) {
  const value = Number(price);
  return Number.isNaN(value) ? price : currencyFormatter.format(value);
}

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "ready"

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setStatus("loading");
      try {
        const response = await fetch(PRODUCTS_URL, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const result = await response.json();
        setProducts(result);
        setStatus("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load products:", error);
          setStatus("error");
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  return (
    <section className="all-products">
      <h1>Check out our Selection!</h1>

      {status === "loading" && <p className="status-message">Loading our fresh bakes...</p>}

      {status === "error" && (
        <p className="status-message status-error">
          Sorry, we couldn&apos;t load our products right now. Please try again later.
        </p>
      )}

      {status === "ready" && products.length === 0 && (
        <p className="status-message">No products found.</p>
      )}

      {status === "ready" && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <img
                className="product-image"
                src={product.image_url}
                alt={product.name}
              />
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{formatPrice(product.price)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AllProducts;
