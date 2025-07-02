import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || null);
  const [food_list, setFoodList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const url = import.meta.env.VITE_API_URL;

  const validateToken = async (token) => {
    if (!token) return false;
    try {
      const response = await axios.post(
        `${url}/api/validate-token`,
        {},
        { headers: { token } }
      );
      return response.data.valid;
    } catch (error) {
      return false;
    }
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // Combined initial data loading effect
  useEffect(() => {
    async function loadData() {
      try {
        const savedToken = sessionStorage.getItem("token");
        if (savedToken) {
          const isValid = await validateToken(savedToken);
          if (!isValid) {
            sessionStorage.removeItem("token");
            setToken(null);
            setCartItems({});
          } else {
            setToken(savedToken);
            await loadCartData(savedToken);
          }
        }
        await fetchFoodList();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []);

  // Token effect handler
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    }
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    isLoading
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;