import ReactDOM from "react-dom/client";
import store from "./store/index";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
