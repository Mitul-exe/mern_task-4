import { CSVLink } from "react-csv";
import "./List.css";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Loading from "../../components/Loading/Loading";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log(response.data);

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching the list");
      }
    } catch (error) {
      toast.error("Error fetching the list");
    } finally {
      setLoading(false); // End loading
    }
  }, [url]);

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      await fetchList();

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Error removing food");
    }
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Prepare CSV data
  const csvData = list.map(item => ({
    Image: item.image,
    Name: item.name,
    Day: item.description,
    Category: item.category,
    Price: item.price,
  }));

  const headers = [
    { label: "Image", key: "Image" },
    { label: "Name", key: "Name" },
    { label: "Day", key: "Day" },
    { label: "Category", key: "Category" },
    { label: "Price", key: "Price" },
  ];

  return (
    <div className="list add flex-col">
      {loading ? (
        <div className="loader-overlay">
          <Loading />
        </div>
      ) : (
        <>
          <div className="list-title">
            <p>All Foods List</p>
            <CSVLink data={csvData} headers={headers} filename={"foods_list.csv"}>
              <button className="export-btn">Export to CSV</button>
            </CSVLink>
          </div>

          <div className="list-table">
            <div className="list-table-format title">
              <b>Image</b>
              <b>Name</b>
              <b>Day</b>
              <b>Category</b>
              <b>Price</b>
              <b>Action</b>
            </div>

            {list.map((item, index) => (
              <div key={index} className="list-table-format">
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.description}</p>
                <p>{item.category}</p>
                <p>Rs. {item.price}</p>
                <p onClick={() => removeFood(item._id)} className="action-btn">
                  Remove
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

List.propTypes = {
  url: PropTypes.string.isRequired,
};

export default List;
