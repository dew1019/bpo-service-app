import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Import your App.js here
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App /> {/* Use App component here */}
    </React.StrictMode>
);

reportWebVitals();
