import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationToast = ({ message, type, duration = 3000 }) => {
  const showNotification = () => {
    switch (type) {
      case "success":
        toast.success(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        break;
      case "warning":
        toast.warning(message, {
          position: "top-center",
          autoClose: duration,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        break;
      case "error":
        toast.error(message, {
          position: "top-center",
          autoClose: duration,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        break;
      default:
        break;
    }
  };

  showNotification();

  return null;
};

export default NotificationToast;
