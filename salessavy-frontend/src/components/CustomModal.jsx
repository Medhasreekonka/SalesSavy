import React, {
  useState,
} from "react";

import "../assets/modalStyles.css";
import { apiFetch } from "../services/api";

const CustomModal = ({
  modalType,
  onClose,
  onSubmit,
  response,
}) => {
  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      imageUrl: "",
      month: "",
      year: "",
      date: "",
    });

  const [inputValue, setInputValue] =
    useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGeneralInputChange = (
    e
  ) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    switch (modalType) {
      case "addProduct": {
        if (
          !formData.name.trim() ||
          !formData.description.trim() ||
          !formData.price ||
          !formData.stock ||
          !formData.categoryId ||
          !formData.imageUrl.trim()
        ) {
          alert(
            "Please fill all product fields."
          );
          return;
        }

        if (
          parseFloat(formData.price) <=
          0
        ) {
          alert(
            "Price must be greater than 0."
          );
          return;
        }

        if (
          parseInt(
            formData.stock,
            10
          ) < 0
        ) {
          alert(
            "Stock cannot be negative."
          );
          return;
        }

        const processedData = {
          ...formData,
          price: parseFloat(
            formData.price
          ),
          stock: parseInt(
            formData.stock,
            10
          ),
          categoryId: parseInt(
            formData.categoryId,
            10
          ),
        };

        onSubmit(processedData);
        break;
      }

      case "deleteProduct": {
        const productId = parseInt(
          inputValue,
          10
        );

        if (
          !productId ||
          productId <= 0
        ) {
          alert(
            "Please enter a valid Product ID."
          );
          return;
        }

        onSubmit({
          productId,
        });

        break;
      }

      case "viewUser": {
        const userId = parseInt(
          inputValue,
          10
        );

        if (
          !userId ||
          userId <= 0
        ) {
          alert(
            "Please enter a valid User ID."
          );
          return;
        }

        onSubmit({
          userId,
        });

        break;
      }

      case "modifyUser": {
        const form = e.target;

        const username =
          form.elements.username
            ?.value || "";

        const email =
          form.elements.email
            ?.value || "";

        const role =
          form.elements.role
            ?.value || "";

        const userId = parseInt(
          inputValue,
          10
        );

        if (
          !userId ||
          userId <= 0
        ) {
          alert(
            "Please enter a valid User ID."
          );
          return;
        }

        onSubmit({
          userId,
          username,
          email,
          role,
        });

        break;
      }

      case "monthlyBusiness": {
        const month =
          formData.month;

        const year =
          formData.year;

        if (!month || !year) {
          alert(
            "Please enter month and year."
          );
          return;
        }

        onSubmit({
          month,
          year,
        });

        break;
      }

      case "dailyBusiness": {
        const date =
          formData.date;

        if (!date) {
          alert(
            "Please enter a date."
          );
          return;
        }

        onSubmit({
          date,
        });

        break;
      }

      case "yearlyBusiness": {
        const year =
          formData.year;

        if (!year) {
          alert(
            "Please enter a year."
          );
          return;
        }

        onSubmit({
          year,
        });

        break;
      }

      case "overallBusiness": {
        onSubmit();
        break;
      }

      default:
        break;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        {/* ADD PRODUCT */}
        {modalType ===
          "addProduct" &&
          (!response ? (
            <>
              <h2>Add Product</h2>

              <form
                className="modal-form"
                onSubmit={handleSubmit}
              >
                <div className="modal-form-item">
                  <label htmlFor="name">
                    Name:
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="modal-form-item">
                  <label htmlFor="price">
                    Price:
                  </label>

                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Price"
                    value={
                      formData.price
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <div className="modal-form-item">
                  <label htmlFor="stock">
                    Stock:
                  </label>

                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="Stock"
                    value={
                      formData.stock
                    }
                    onChange={
                      handleInputChange
                    }
                    min="0"
                    required
                  />
                </div>

                <div className="modal-form-item">
                  <label htmlFor="categoryId">
                    Category ID:
                  </label>

                  <input
                    type="number"
                    id="categoryId"
                    name="categoryId"
                    placeholder="Category ID"
                    value={
                      formData.categoryId
                    }
                    onChange={
                      handleInputChange
                    }
                    min="1"
                    required
                  />
                </div>

                <div className="modal-form-item">
                  <label htmlFor="imageUrl">
                    Image URL:
                  </label>

                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={
                      formData.imageUrl
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="modal-form-item">
                  <label htmlFor="description">
                    Description:
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="submit"
                  >
                    Submit
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2>
                Product Details
              </h2>

              <div className="full-products">
                <div className="product-details img">
                  <img
                    src={
                      response?.product
                        ?.imageUrl
                    }
                    alt="Product"
                  />
                </div>

                <div className="product-details-info">

                  <div className="product-details">
                    <div>Name :</div>
                    <div>
                      {
                        response
                          ?.product
                          ?.product
                          ?.name
                      }
                    </div>
                  </div>

                  <div className="product-details">
                    <div>
                      Description :
                    </div>
                    <div>
                      {
                        response
                          ?.product
                          ?.product
                          ?.description
                      }
                    </div>
                  </div>

                  <div className="product-details">
                    <div>Price :</div>
                    <div>
                      {
                        response
                          ?.product
                          ?.product
                          ?.price
                      }
                    </div>
                  </div>

                  <div className="product-details">
                    <div>Stock :</div>
                    <div>
                      {
                        response
                          ?.product
                          ?.product
                          ?.stock
                      }
                    </div>
                  </div>

                  <div className="product-details">
                    <div>Category :</div>
                    <div>
                      {
                        response
                          ?.product
                          ?.product
                          ?.category
                          ?.categoryName
                      }
                    </div>
                  </div>

                </div>
              </div>

              <div className="product-details">
                <button
                  type="button"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </>
          ))}

        {/* DELETE PRODUCT */}
        {modalType ===
          "deleteProduct" &&
          (!response ? (
            <>
              <h2>
                Delete Product
              </h2>

              <form
                onSubmit={handleSubmit}
              >
                <input
                  type="number"
                  placeholder="Enter Product ID"
                  value={inputValue}
                  onChange={
                    handleGeneralInputChange
                  }
                  min="1"
                  required
                />

                <button
                  type="submit"
                >
                  Delete
                </button>
              </form>

              <button
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </>
          ) : (
            <div>
              {response.success ? (
                <>
                  <h2>
                    Product Deleted
                    Successfully
                  </h2>

                  <p>
                    {response.message}
                  </p>
                </>
              ) : (
                <>
                  <h2>
                    Delete Failed
                  </h2>

                  <p>
                    {response.message}
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ))}

        {/* VIEW USER */}
        {modalType ===
          "viewUser" && (
          <>
            <h2>
              View User Details
            </h2>

            <form
              onSubmit={handleSubmit}
            >
              <input
                type="number"
                placeholder="Enter User ID"
                value={inputValue}
                onChange={
                  handleGeneralInputChange
                }
                min="1"
                required
              />

              <button
                type="submit"
              >
                Submit
              </button>
            </form>

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        )}

        {/* RESPONSE */}
        {modalType ===
          "response" &&
          response && (
            <>
              {response.user ? (
                <>
                  <h2>
                    User Details
                  </h2>

                  <div className="user-details">
                    <p>
                      <strong>
                        User ID:
                      </strong>{" "}
                      {
                        response.user
                          .userId
                      }
                    </p>

                    <p>
                      <strong>
                        Username:
                      </strong>{" "}
                      {
                        response.user
                          .username
                      }
                    </p>

                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {
                        response.user
                          .email
                      }
                    </p>

                    <p>
                      <strong>
                        Role:
                      </strong>{" "}
                      {
                        response.user
                          .role
                      }
                    </p>

                    {response.user
                      .createdAt && (
                      <p>
                        <strong>
                          Created At:
                        </strong>{" "}
                        {new Date(
                          response.user
                            .createdAt
                        ).toLocaleString()}
                      </p>
                    )}

                    {response.user
                      .updatedAt && (
                      <p>
                        <strong>
                          Updated At:
                        </strong>{" "}
                        {new Date(
                          response.user
                            .updatedAt
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2>Error</h2>

                  <p>
                    {response.error ||
                      response.message ||
                      "Something went wrong."}
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
              >
                Back to Dashboard
              </button>
            </>
          )}

        {/* MONTHLY BUSINESS */}
        {modalType ===
          "monthlyBusiness" && (
          <>
            <form
              className="modal-form"
              onSubmit={handleSubmit}
            >
              {!response && (
                <>
                  <div className="modal-form-item">
                    <label htmlFor="month">
                      Month:
                    </label>

                    <input
                      type="number"
                      id="month"
                      name="month"
                      placeholder="10"
                      min="1"
                      max="12"
                      value={
                        formData.month
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />
                  </div>

                  <div className="modal-form-item">
                    <label htmlFor="year">
                      Year:
                    </label>

                    <input
                      type="number"
                      id="year"
                      name="year"
                      placeholder="2026"
                      value={
                        formData.year
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                  >
                    Submit
                  </button>
                </>
              )}

              {response && (
                <div>
                  <div className="business-response-item">
                    <div>
                      Total Business: ₹
                    </div>

                    <div>
                      {Number(
                        response
                          ?.monthlyBusiness
                          ?.totalBusiness ||
                          0
                      ).toFixed(2)}
                    </div>
                  </div>

                  <div className="business-response-item">
                    <h5>
                      Category Sales
                    </h5>
                  </div>

                  {Object.keys(
                    response
                      ?.monthlyBusiness
                      ?.categorySales ||
                      {}
                  ).map((key) => (
                    <div
                      key={key}
                      className="business-response-item"
                    >
                      <div>{key}</div>

                      <div>
                        {
                          response
                            ?.monthlyBusiness
                            ?.categorySales[
                            key
                          ]
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {/* DAILY BUSINESS */}
        {modalType ===
          "dailyBusiness" && (
          <>
            <form
              className="modal-form"
              onSubmit={handleSubmit}
            >
              {!response && (
                <>
                  <div className="modal-form-item">
                    <label htmlFor="date">
                      Date:
                    </label>

                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={
                        formData.date
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                  >
                    Submit
                  </button>
                </>
              )}

              {response && (
                <div>
                  <div className="business-response-item">
                    <div>
                      Total Business: ₹
                    </div>

                    <div>
                      {Number(
                        response
                          ?.dailyBusiness
                          ?.totalBusiness ||
                          0
                      ).toFixed(2)}
                    </div>
                  </div>

                  <div className="business-response-item">
                    <h5>
                      Category Sales
                    </h5>
                  </div>

                  {Object.keys(
                    response
                      ?.dailyBusiness
                      ?.categorySales ||
                      {}
                  ).map((key) => (
                    <div
                      key={key}
                      className="business-response-item"
                    >
                      <div>{key}</div>

                      <div>
                        {
                          response
                            ?.dailyBusiness
                            ?.categorySales[
                            key
                          ]
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {/* YEARLY BUSINESS */}
        {modalType ===
          "yearlyBusiness" && (
          <>
            <form
              className="modal-form"
              onSubmit={handleSubmit}
            >
              {!response && (
                <>
                  <div className="modal-form-item">
                    <label htmlFor="year">
                      Year:
                    </label>

                    <input
                      type="number"
                      id="year"
                      name="year"
                      placeholder="2026"
                      value={
                        formData.year
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                  >
                    Submit
                  </button>
                </>
              )}

              {response && (
                <div>
                  <div className="business-response-item">
                    <div>
                      Total Business: ₹
                    </div>

                    <div>
                      {Number(
                        response
                          ?.yearlyBusiness
                          ?.totalBusiness ||
                          0
                      ).toFixed(2)}
                    </div>
                  </div>

                  <div className="business-response-item">
                    <h5>
                      Category Sales
                    </h5>
                  </div>

                  {Object.keys(
                    response
                      ?.yearlyBusiness
                      ?.categorySales ||
                      {}
                  ).map((key) => (
                    <div
                      key={key}
                      className="business-response-item"
                    >
                      <div>{key}</div>

                      <div>
                        {
                          response
                            ?.yearlyBusiness
                            ?.categorySales[
                            key
                          ]
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {/* OVERALL BUSINESS */}
        {modalType ===
          "overallBusiness" && (
          <>
            <form
              className="modal-form"
              onSubmit={handleSubmit}
            >
              {!response && (
                <button
                  type="submit"
                >
                  Get Overall Business
                </button>
              )}

              {response && (
                <div>
                  <div className="business-response-item">
                    <div>
                      Total Business: ₹
                    </div>

                    <div>
                      {Number(
                        response
                          ?.overallBusiness
                          ?.totalBusiness ||
                          0
                      ).toFixed(2)}
                    </div>
                  </div>

                  <div className="business-response-item">
                    <h5>
                      Category Sales
                    </h5>
                  </div>

                  {Object.keys(
                    response
                      ?.overallBusiness
                      ?.categorySales ||
                      {}
                  ).map((key) => (
                    <div
                      key={key}
                      className="business-response-item"
                    >
                      <div>{key}</div>

                      <div>
                        {
                          response
                            ?.overallBusiness
                            ?.categorySales[
                            key
                          ]
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {/* MODIFY USER */}
        {modalType ===
          "modifyUser" && (
          <ModifyUserFormComponent
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default CustomModal;


/* =========================================================
   MODIFY USER FORM
   ========================================================= */

const ModifyUserFormComponent = ({
  onClose,
}) => {
  const [userId, setUserId] =
    useState("");

  const [userDetails, setUserDetails] =
    useState(null);

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("CUSTOMER");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleFetchUser = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!userId) {
      setError(
        "Please enter a User ID."
      );
      return;
    }

    try {
      const response = await apiFetch(
        "/admin/user/getbyid",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(
              userId,
              10
            ),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data?.message ||
            data ||
            "User not found."
        );
        return;
      }

      setUserDetails(data);
      setUsername(
        data.username || ""
      );
      setEmail(
        data.email || ""
      );
      setRole(
        data.role || "CUSTOMER"
      );

      setMessage(
        "User details loaded successfully."
      );
    } catch (error) {
      console.error(
        "Error fetching user:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    }
  };

  const handleUpdateUser = async (
    e
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!userId) {
      setError(
        "Please enter a User ID."
      );
      return;
    }

    try {
      const response = await apiFetch(
        "/admin/user/modify",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(
              userId,
              10
            ),
            username:
              username.trim(),
            email:
              email.trim(),
            role,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data?.message ||
            data ||
            "Failed to update user."
        );
        return;
      }

      setUserDetails(data);

      setUsername(
        data.username || ""
      );

      setEmail(
        data.email || ""
      );

      setRole(
        data.role || "CUSTOMER"
      );

      setMessage(
        "User updated successfully."
      );
    } catch (error) {
      console.error(
        "Error updating user:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    }
  };

  return (
    <>
      <h2>
        Modify User
      </h2>

      {!userDetails && (
        <form
          onSubmit={handleFetchUser}
          className="modal-form"
        >
          <div className="modal-form-item">
            <label htmlFor="modify-user-id">
              User ID:
            </label>

            <input
              type="number"
              id="modify-user-id"
              value={userId}
              placeholder="Enter User ID"
              onChange={(e) =>
                setUserId(
                  e.target.value
                )
              }
              min="1"
              required
            />
          </div>

          <button type="submit">
            Get User
          </button>

          <button
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      )}

      {userDetails && (
        <form
          onSubmit={handleUpdateUser}
          className="modal-form"
        >
          <div className="modal-form-item">
            <label>
              User ID:
            </label>

            <input
              type="number"
              value={userId}
              readOnly
            />
          </div>

          <div className="modal-form-item">
            <label htmlFor="modify-username">
              Username:
            </label>

            <input
              type="text"
              id="modify-username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="modal-form-item">
            <label htmlFor="modify-email">
              Email:
            </label>

            <input
              type="email"
              id="modify-email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="modal-form-item">
            <label htmlFor="modify-role">
              Role:
            </label>

            <select
              id="modify-role"
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
            >
              <option value="CUSTOMER">
                CUSTOMER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>
            </select>
          </div>

          <button type="submit">
            Update User
          </button>

          <button
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      )}

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}
    </>
  );
};