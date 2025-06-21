import { useEffect, useState, useRef } from "react";
// internal
import { Search } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";
import AuthUser from "@/auth/authuser";
import Link from "next/link";
import { useRouter } from "next/router";

const HeaderSearchForm = () => {
  const { http } = AuthUser();
  const { setSearchText, setCategory, handleSubmit, searchText } = useSearchFormSubmit();
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();
  // Fetch categories on mount
  useEffect(() => {
    const getCategoryList = async () => {
      try {
        const res = await http.get("/category/list");
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    getCategoryList();
  }, []);

  // Fetch search suggestions when searchText changes
  const fetchSuggestions = async () => {
  
      try {
        const res = await http.get(`/products/search-suggestions?query=${searchText}`);
        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      } 
  };
  useEffect(() => { 
      fetchSuggestions(); 
      console.log("Fetching suggestions for:", searchText);
      
  }, [searchText]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options = [
    { value: "", text: "Select Category" },
    ...categories.map((item) => ({
      value: item.category_id,
      text: item.category_name,
    })),
  ];

  const selectCategoryHandle = (opt) => {
    setCategory(opt.value);
  };

  const handleSuggestionClick = (product) => {
    setSearchText(product.product_english_name);
    setShowSuggestions(false);
    router.push({
      pathname: '/product-show',
      query: { id: product.product_id }
    });
    // Optionally submit the form or navigate directly to product
    // handleSubmit(); or router.push(`/product/${product.product_id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="position-relative" ref={searchRef}>
      <div className="tp-header-search-wrapper d-flex align-items-center">
        <div className="tp-header-search-box position-relative">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            type="text"
            placeholder="Search for Products..."
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              {suggestions.map((product) => (
                <div
                  key={product.product_id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  {product.product_english_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="tp-header-search-category">
          <NiceSelect
            options={options}
            defaultCurrent={0}
            onChange={selectCategoryHandle}
            name="category"
          />
        </div>
        <div className="tp-header-search-btn">
          <button type="submit">
            <Search />
          </button>
        </div>
      </div>

      <style jsx>{`
        .search-suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .suggestion-item {
          padding: 8px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .suggestion-item:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </form>
  );
};

export default HeaderSearchForm;