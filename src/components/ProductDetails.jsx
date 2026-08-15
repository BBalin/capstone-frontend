import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { useAuth } from "../auth/AuthContext";
import "./product-details.css";

const BASE = import.meta.env.VITE_API;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatPrice(price) {
  const value = Number(price);
  return Number.isNaN(value) ? price : currencyFormatter.format(value);
}

function ProductDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "error" | "ready"
  const [quantity, setQuantity] = useState(1);
  const [cartStatus, setCartStatus] = useState("idle"); // "idle" | "adding" | "added" | "error"
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setStatus("loading");
      try {
        const response = await fetch(`${BASE}/products/${id}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const result = await response.json();
        setProduct(result);
        setStatus("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load product:", error);
          setStatus("error");
        }
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [id]);

  const decrement = () => setQuantity((current) => Math.max(1, current - 1));
  const increment = () => setQuantity((current) => current + 1);

  const addToCart = async () => {
    setCartStatus("adding");
    setCartError(null);
    try {
      const response = await fetch(`${BASE}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });
      const result = await response.text();
      if (!response.ok) throw new Error(result);
      setCartStatus("added");
    } catch (error) {
      setCartError(error.message);
      setCartStatus("error");
    }
  };

  if (status === "loading") {
    return <p className="status-message">Loading product...</p>;
  }

  if (status === "error") {
    return (
      <p className="status-message status-error">
        Sorry, we couldn&apos;t load this product.{" "}
        <Link to="/products">Back</Link>
      </p>
    );
  }

  return (
    <section className="product-details">
      <Link className="back-link" to="/products">
        &larr; Back
      </Link>

      <div className="product-details-card">
        <img
          className="product-details-image"
          src={product.image_url}
          alt={product.name}
        />
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <p className="product-details-description">{product.description}</p>
          <p className="product-details-price">{formatPrice(product.price)}</p>

          <div className="quantity-selector">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              type="button"
              onClick={increment}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="add-to-cart-button"
            onClick={addToCart}
            disabled={cartStatus === "adding"}
          >
            {cartStatus === "adding" ? "Adding..." : "Add to Cart"}
          </button>

          {cartStatus === "added" && (
            <p className="cart-feedback cart-success">Added to your cart!</p>
          )}
          {cartStatus === "error" && (
            <p className="cart-feedback status-error">{cartError}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
