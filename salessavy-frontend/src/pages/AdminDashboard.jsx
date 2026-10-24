import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import Logo from "../components/Logo";
import "../assets/styles.css";
import CustomModal from "../components/CustomModal";
import { apiFetch } from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [modalType, setModalType] = useState(null);
  const [response, setResponse] = useState(null);

  const cardData = [
    {
      title: "Add Product",
      description:
        "Create and manage new product listings with validation",
      team: "Product Management",
      modalType: "addProduct",
    },
    {
      title: "Delete Product",
      description:
        "Remove products from inventory system",
      team: "Product Management",
      modalType: "deleteProduct",
    },
    {
      title: "Modify User",
      description:
        "Update user details and manage roles",
      team: "User Management",
      modalType: "modifyUser",
    },
    {
      title: "View User Details",
      description:
        "Fetch and display details of a specific user",
      team: "User Management",
      modalType: "viewUser",
    },
    {
      title: "Monthly Business",
      description:
        "View revenue metrics for specific months",
      team: "Analytics",
      modalType: "monthlyBusiness",
    },
    {
      title: "Day Business",
      description:
        "Track daily revenue and transactions",
      team: "Analytics",
      modalType: "dailyBusiness",
    },
    {
      title: "Yearly Business",
      description:
        "Analyze annual revenue performance",
      team: "Analytics",
      modalType: "yearlyBusiness",
    },
    {
      title: "Overall Business",
      description:
        "View total revenue since inception",
      team: "Analytics",
      modalType: "overallBusiness",
    },
  ];

  // Logout
  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      navigate("/admin");
    }
  };

  // Add Product
  const handleAddProductSubmit = async (
    productData
  ) => {
    try {
      const response = await apiFetch(
        "/admin/products/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setResponse({
          error:
            data?.error ||
            data?.message ||
            data ||
            "Failed to add product.",
        });

        return;
      }

      setResponse({
        product: {
          product: data,
          imageUrl: productData.imageUrl,
        },
      });

      setModalType("addProduct");
    } catch (error) {
      console.error(
        "Error adding product:",
        error
      );

      setResponse({
        error:
          "Unable to connect to the server.",
      });
    }
  };

  // Delete Product
  const handleDeleteProductSubmit = async ({
    productId,
  }) => {
    try {
      const response = await apiFetch(
        "/admin/products/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: parseInt(
              productId,
              10
            ),
          }),
        }
      );

      const text = await response.text();

      if (response.ok) {
        setResponse({
          success: true,
          message:
            text ||
            "Product deleted successfully.",
        });
      } else {
        setResponse({
          success: false,
          message:
            text ||
            "Failed to delete product.",
        });
      }
    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );

      setResponse({
        success: false,
        message:
          "Unable to connect to the server.",
      });
    }
  };

  // View User
  const handleViewUserSubmit = async ({
    userId,
  }) => {
    try {
      const response = await apiFetch(
        "/admin/user/getbyid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        setResponse({
          error:
            data?.message ||
            data ||
            "User not found.",
        });

        setModalType("response");
        return;
      }

      setResponse({
        user: data,
      });

      setModalType("response");
    } catch (error) {
      console.error(
        "Error fetching user details:",
        error
      );

      setResponse({
        error:
          "Unable to connect to the server.",
      });

      setModalType("response");
    }
  };

  // Modify User
  const handleModifyUserSubmit = async ({
    userId,
    username,
    email,
    role,
  }) => {
    try {
      const response = await apiFetch(
        "/admin/user/modify",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(
              userId,
              10
            ),
            username,
            email,
            role,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setResponse({
          error:
            data?.message ||
            data ||
            "Failed to modify user.",
        });

        return;
      }

      setResponse({
        user: data,
      });
    } catch (error) {
      console.error(
        "Error modifying user:",
        error
      );

      setResponse({
        error:
          "Unable to connect to the server.",
      });
    }
  };

  // Monthly Business
  const handleMonthlyBusiness = async (
    data
  ) => {
    try {
      const response = await apiFetch(
        `/admin/business/monthly?month=${data?.month}&year=${data?.year}`
      );

      if (response.ok) {
        const result =
          await response.json();

        setResponse({
          monthlyBusiness: result,
        });

        setModalType(
          "monthlyBusiness"
        );
      } else {
        const errorMessage =
          await response.text();

        setResponse({
          message: `Error: ${errorMessage}`,
        });

        setModalType(
          "monthlyBusiness"
        );
      }
    } catch (error) {
      console.error(
        "Error fetching monthly business:",
        error
      );

      setResponse({
        message:
          "Error: Something went wrong",
      });

      setModalType(
        "monthlyBusiness"
      );
    }
  };

  // Daily Business
  const handleDailyBusiness = async (
    data
  ) => {
    try {
      const response = await apiFetch(
        `/admin/business/daily?date=${data?.date}`
      );

      if (response.ok) {
        const result =
          await response.json();

        setResponse({
          dailyBusiness: result,
        });

        setModalType(
          "dailyBusiness"
        );
      } else {
        const errorMessage =
          await response.text();

        setResponse({
          message: `Error: ${errorMessage}`,
        });

        setModalType(
          "dailyBusiness"
        );
      }
    } catch (error) {
      console.error(
        "Error fetching daily business:",
        error
      );

      setResponse({
        message:
          "Error: Something went wrong",
      });

      setModalType(
        "dailyBusiness"
      );
    }
  };

  // Yearly Business
  const handleYearlyBusiness = async (
    data
  ) => {
    try {
      const response = await apiFetch(
        `/admin/business/yearly?year=${data?.year}`
      );

      if (response.ok) {
        const result =
          await response.json();

        setResponse({
          yearlyBusiness: result,
        });

        setModalType(
          "yearlyBusiness"
        );
      } else {
        const errorMessage =
          await response.text();

        setResponse({
          message: `Error: ${errorMessage}`,
        });

        setModalType(
          "yearlyBusiness"
        );
      }
    } catch (error) {
      console.error(
        "Error fetching yearly business:",
        error
      );

      setResponse({
        message:
          "Error: Something went wrong",
      });

      setModalType(
        "yearlyBusiness"
      );
    }
  };

  // Overall Business
  const handleOverallBusiness = async () => {
    try {
      const response = await apiFetch(
        "/admin/business/overall"
      );

      if (response.ok) {
        const result =
          await response.json();

        setResponse({
          overallBusiness: result,
        });

        setModalType(
          "overallBusiness"
        );
      } else {
        const errorMessage =
          await response.text();

        setResponse({
          message: `Error: ${errorMessage}`,
        });

        setModalType(
          "overallBusiness"
        );
      }
    } catch (error) {
      console.error(
        "Error fetching overall business:",
        error
      );

      setResponse({
        message:
          "Error: Something went wrong",
      });

      setModalType(
        "overallBusiness"
      );
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <Logo to="/admindashboard" />

        <div className="user-info">
          <span className="username">
            Admin
          </span>

          <div className="dropdown">
            <button
              type="button"
              className="dropdown-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="cards-grid">
          {cardData.map(
            (card, index) => (
              <div
                key={index}
                className="card"
                onClick={() => {
                  setModalType(
                    card.modalType
                  );
                  setResponse(null);
                }}
              >
                <div className="card-content">
                  <h3 className="card-title">
                    {card.title}
                  </h3>

                  <p className="card-description">
                    {card.description}
                  </p>

                  <span className="card-team">
                    Team: {card.team}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      {modalType && (
        <CustomModal
          modalType={modalType}
          onClose={() => {
            setModalType(null);
            setResponse(null);
          }}
          onSubmit={(data) => {
            switch (modalType) {
              case "addProduct":
                handleAddProductSubmit(
                  data
                );
                break;

              case "deleteProduct":
                handleDeleteProductSubmit(
                  data
                );
                break;

              case "viewUser":
                handleViewUserSubmit(
                  data
                );
                break;

              case "modifyUser":
                handleModifyUserSubmit(
                  data
                );
                break;

              case "monthlyBusiness":
                handleMonthlyBusiness(
                  data
                );
                break;

              case "dailyBusiness":
                handleDailyBusiness(
                  data
                );
                break;

              case "yearlyBusiness":
                handleYearlyBusiness(
                  data
                );
                break;

              case "overallBusiness":
                handleOverallBusiness();
                break;

              default:
                break;
            }
          }}
          response={response}
        />
      )}
    </div>
  );
};

export default AdminDashboard;