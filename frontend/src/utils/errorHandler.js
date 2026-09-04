import { toast } from "react-toastify";

export const handleApiError = (error) => {

  if (error.response) {

    if (error.response.status === 401) {

      toast.error("Session expired. Please login again.");

      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

      return;
    }

    toast.error(
      error.response.data.detail ||
      "Something went wrong."
    );

  } else if (error.request) {

    toast.error("Cannot connect to server.");

  } else {

    toast.error("Unexpected error occurred.");

  }

  console.error(error);
};