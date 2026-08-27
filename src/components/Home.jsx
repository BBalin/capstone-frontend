import { Carousel } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "./home.css";

const BASE = import.meta.env.VITE_API;

function Home() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const carouselRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setStatus("loading");
      try {
        const response = await fetch(`${BASE}/products`, {
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

  useEffect(() => {
    if (!carouselRef.current || products.length === 0) return;
    const carousel = new Carousel(carouselRef.current, { ride: "carousel" });
    return () => carousel.dispose();
  }, [products]);

  return (
    <section className="home">
      <div className="logo">
        <img src="/images/3heartskitchen.jpg" alt="logo" />
      </div>

      {status === "loading" && (
        <p className="status-message">Loading our selection...</p>
      )}

      {status === "error" && (
        <p className="status-message status-error">
          Sorry, we couldn&apos;t load our products right now.
        </p>
      )}

      {status === "ready" && products.length > 0 && (
        <div
          id="homeCarousel"
          className="carousel slide home-carousel"
          ref={carouselRef}
        >
          <div className="carousel-indicators">
            {products.map((product, index) => (
              <button
                key={product.id}
                type="button"
                data-bs-target="#homeCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {products.map((product, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={product.id}
              >
                <img
                  src={product.image_url}
                  className="d-block w-100"
                  alt={product.name}
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>{product.name}</h5>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      )}

      <Link className="cta-button" to="/products">
        Get Started
      </Link>
    </section>
  );
}

export default Home;
