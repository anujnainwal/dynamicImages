import { useState } from "react";

const useBase64 = (file, onLoadCallback) => {
  const [base64String, setBase64String] = useState(null);
  const getBase64 = () => {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        setBase64String(reader.result);
        console.log(reader.result);
        onLoadCallback && onLoadCallback(reader.result);
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  return [getBase64, base64String];
};

export default useBase64;
