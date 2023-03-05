import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarLayout from "./components/Navbar";
import { FirestoreContextProvider } from "./context/FirestoreContext";
import { RapydContextProvider } from "./context/RapydContext";
import Portfolio from "./components/portfolio/Portfolio";
import { useState } from "react";
import MyAccount from "./components/MyAccount";
import MyWallet from "./components/wallet/MyWallet";
import Equity from "./components/wallet/Equity";
import { FantomContextProvider } from "./context/FantomContext";
import Earnings from "./components/wallet/Earnings";

function App() {
  const [user, setUser] = useState({
    RapydAcc: { ewallet_id: "" },
    FantomAcc: { wallet_address: "", wallet_privatekey: "" },
  });
  const [portfolio, setPortfolio] = useState([]);
  const [ftmBalance, setFtmBalance] = useState("0");
  const [loan, setLoan] = useState([]);
  return (
    <UserAuthContextProvider>
      <FirestoreContextProvider>
        <RapydContextProvider>
          <FantomContextProvider>
            <NavbarLayout
              user={user}
              setUser={setUser}
              setPortfolio={setPortfolio}
              ftmBalance={ftmBalance}
              setFtmBalance={setFtmBalance}
              loan={loan}
              setLoan={setLoan}
            />
            <Container fluid>
              <Routes>
                <Route
                  path="/myaccount"
                  element={
                    <ProtectedRoute>
                      <MyAccount user={user} setUser={setUser} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mywallet"
                  element={
                    <ProtectedRoute>
                      <MyWallet
                        user={user}
                        ftmBalance={ftmBalance}
                        setFtmBalance={setFtmBalance}
                        portfolio={portfolio}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/companywallet"
                  element={
                    <ProtectedRoute>
                      <MyWallet
                        user={user}
                        setUser={setUser}
                        ftmBalance={ftmBalance}
                        setFtmBalance={setFtmBalance}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/companyearnings"
                  element={
                    <ProtectedRoute>
                      <Earnings
                        user={user}
                        setUser={setUser}
                        loan={loan}
                        portfolio={portfolio}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <Login
                      user={user}
                      setUser={setUser}
                      portfolio={portfolio}
                      setPortfolio={setPortfolio}
                      setFtmBalance={setFtmBalance}
                    />
                  }
                />
                <Route
                  path="/signup"
                  element={<Signup user={user} setUser={setUser} />}
                />
                <Route
                  path="/myportfolio"
                  element={
                    <ProtectedRoute>
                      <Portfolio
                        user={user}
                        portfolio={portfolio}
                        setPortfolio={setPortfolio}
                        ftmBalance={ftmBalance}
                        setFtmBalance={setFtmBalance}
                        loan={loan}
                      />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Container>
          </FantomContextProvider>
        </RapydContextProvider>
      </FirestoreContextProvider>
    </UserAuthContextProvider>
  );
}

export default App;
