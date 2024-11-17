import { useEffect, useState } from "react";


export default function LoadMoreData() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProducts() {
    try {

      const response = await fetch(
        `https://dummyjson.com/products?limit=20&skip=${count * 20}`
      );

      const result = await response.json();

      if (result && result.products && result.products.length) {
        setProducts(result.products); 
      } else {
        setError("No more products available");
      }
    } catch (e) {
      setError("Failed to load products. Please try again.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [count]);

  useEffect(() => {
    if (products.length === 100) {
      setDisableButton(true); 
    }
  }, [products]);

  if (loading) {
    return <div>Loading data! Please wait...</div>;
  }

  return (
    <div className="load-more-container">
        <h1>"New Arrivals – Just for You!"</h1>
      <div className="product-container">
        {error && <div className="error-message">{error}</div>}
        {products && products.length
          ? products.map((item) => (
              <div className="product" key={item.id}>
                <img src={item.thumbnail} alt={item.title} />
                <p>{item.title}</p>
              </div>
            ))
          : null}
      </div>
      <div className="button-container">
        <button className="btn"
          disabled={disableButton || loading}
          onClick={() => setCount(count + 1)} // Increment count to load next batch
        >
          Load More Products
        </button>
        {disableButton && <p>You have reached 100 products</p>}
      </div>
    </div>
  );
}
