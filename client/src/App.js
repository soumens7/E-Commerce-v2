import React from "react";
import Headers from "./components/headers/header";
import Pages from "./components/mainpages/pages";
import Footer from "./components/footer/footer";
import { BrowserRouter as Router } from "react-router-dom";
import { DataProvider } from "./GlobalState.js";
function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Headers />
          <Pages />
          <Footer/>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
