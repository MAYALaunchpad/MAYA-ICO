import indexRouter from "./router/indexRouter";
import { useRoutes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const element = useRoutes(indexRouter);

  return (
    <div className="App">
      <div className="ParentComponent">
        <div className="AtexHeader">
          <Header />
        </div>
        <div className="AtexDemoe">{element}</div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
