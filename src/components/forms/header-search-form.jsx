import { useEffect, useState } from "react";
// internal
import { Search } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";
import AuthUser from "@/auth/authuser";
import Link from "next/link";
const HeaderSearchForm = () => {
  const {http} = AuthUser();
  const { setSearchText, setCategory, handleSubmit, searchText } = useSearchFormSubmit();

  // Local state for the list of categories
  const [categories, setCategories] = useState([]);

  // Fetch categories once on mount
  useEffect(() => {
    const getCategoryList = async () => {
      try {
        const res = await http.get("/category/list");
        // print(res.data);
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    getCategoryList();
  }, []);

  // Build the options array that NiceSelect expects
  const options = [
    { value: "", text: "Select Category" },
    ...categories.map((item) => ({
      value: item.category_id,
      text: item.category_name,
    })),
  ];

  // When the user picks one, push it into your search-hook’s state
  const selectCategoryHandle = (opt) => {
    setCategory(opt.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="tp-header-search-wrapper d-flex align-items-center">
        <div className="tp-header-search-box">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            type="text"
            placeholder="Search for Products..."
          />
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
    </form>
  );
};

export default HeaderSearchForm;
