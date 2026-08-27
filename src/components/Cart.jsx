import { useEffect, useState } from "react";

import { useAuth } from "../auth/AuthContext";
import "./cart.css";

const BASE = import.meta.env.VITE_API;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatPrice(price) {
  const value = Number(price);
  return Number.isNaN(value) ? price : currencyFormatter.format(value);
}

function Cart() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCart() {
      setStatus("loading");
      try {
        const response = await fetch(`${BASE}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const result = await response.json();
        setItems(result);
        setStatus("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load cart:", error);
          setStatus("error");
        }
      }
    }

    loadCart();
    return () => controller.abort();
  }, [token]);

  const updateQuantity = async (itemId, quantity) => {
    setPendingId(itemId);
    try {
      const response = await fetch(`${BASE}/cart/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error(await response.text());
      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        ),
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setPendingId(null);
    }
  };

  const removeItem = async (itemId) => {
    setPendingId(itemId);
    try {
      const response = await fetch(`${BASE}/cart/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(await response.text());
      setItems((current) => current.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setPendingId(null);
    }
  };

  const decrement = (item) => {
    if (item.quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const increment = (item) => updateQuantity(item.id, item.quantity + 1);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  if (status === "loading") {
    return <p className="status-message">Loading your cart...</p>;
  }

  if (status === "error") {
    return (
      <p className="status-message status-error">
        Sorry, we couldn&apos;t load your cart right now.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <h1>Your cart is empty...</h1>
        <p className="status-message">Grab some delicious baked goods.</p>

        <div className="cart-box">
          <p className="status-message">Cart items go here...</p>
        </div>

        <button type="button" className="checkout-button">
          Checkout
        </button>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h1>Your Cart</h1>

      <ul className="cart-items">
        {items.map((item) => (
          <li className="cart-item" key={item.id}>
            <img
              className="cart-item-image"
              src={item.image_url}
              alt={item.name}
            />
            <div className="cart-item-info">
              <p className="cart-item-name">{item.name}</p>
              <p className="cart-item-price">{formatPrice(item.price)}</p>
            </div>
            <div className="cart-item-quantity">
              <button
                type="button"
                onClick={() => decrement(item)}
                disabled={pendingId === item.id}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                onClick={() => increment(item)}
                disabled={pendingId === item.id}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="cart-item-remove"
              onClick={() => removeItem(item.id)}
              disabled={pendingId === item.id}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <p className="cart-total">Total: {formatPrice(total)}</p>

      <button type="button" className="checkout-button">
        Checkout
      </button>
    </section>
  );
}

export default Cart;
