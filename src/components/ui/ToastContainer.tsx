import React from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast: React.FC = () => {
  return (
    <div className="App">
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick={true}
        closeButton={false}
        draggable={false}
        pauseOnHover={true}
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default Toast;