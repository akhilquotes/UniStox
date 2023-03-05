import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useUserAuth } from "../context/UserAuthContext";
import { useFantom } from "../context/FantomContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useFirestore } from "../context/FirestoreContext";
import { NavDropdown, Badge, Button } from "react-bootstrap";

const NavbarLayout = ({
  user,
  setUser,
  setPortfolio,
  ftmBalance,
  setFtmBalance,
  loan,
  setLoan,
}) => {
  const navigate = useNavigate();
  const { getDocument, getDocuments } = useFirestore();
  const { getBalance } = useFantom();

  const handleLogout = async () => {
    try {
      await logOut();
      setFtmBalance("0");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  const { logOut, userLogged } = useUserAuth();
  const linkStyle = {
    color: "#ffffff8c",
    textDecoration: "none",
  };
  const ddStyle = {
    color: "black",
    textDecoration: "none",
  };
  useEffect(() => {
    if (userLogged === null || userLogged === undefined) {
    } else {
      if (Object.keys(userLogged).length > 0) {
        if (Object.keys(user).includes("Email") === false) {
          getDocument(userLogged.email, "Users", "Email").then((x) => {
            getBalance(x.data().FantomAcc.wallet_address).then((bal) => {
              setFtmBalance(parseFloat(bal.replace('"', "")).toFixed(2));
              console.log("ftmBalance", x.data());
              setUser(x.data());
            });
          });
          if (userLogged.email == "johndoe@gmail.com") {
            getDocuments("", "UserPortfolio", "CO2E").then((x) => {
              x.length > 0 && setPortfolio(x);
            });
          } else {
            getDocuments(userLogged.email, "UserPortfolio", "Email").then(
              (x) => {
                x.length > 0 && setPortfolio(x);
              }
            );
          }

          if (userLogged.email == "johndoe@gmail.com") {
            getDocuments("FTM", "UserLoanTransactions", "Currency").then(
              (x) => {
                x.length > 0 && setLoan(x);
              }
            );
          } else {
            getDocuments(
              userLogged.email,
              "UserLoanTransactions",
              "Email"
            ).then((x) => {
              x.length > 0 && setLoan(x);
            });
          }
        }
      }
    }
  });
  return (
    <>
      <Navbar bg="info" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              <img
                src="logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              UniStox
            </Link>
          </Navbar.Brand>
          <Nav>
            {userLogged === null || Object.keys(userLogged).length === 0 ? (
              <>
                <Nav.Link>
                  <Link to="/signup" style={linkStyle}>
                    SignUp
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/" style={linkStyle}>
                    Login
                  </Link>
                </Nav.Link>
              </>
            ) : (
              <>
                <Button
                  className="badge position-relative"
                  variant="warning"
                  onClick={() => {
                    window.location.href = "/mywallet";
                  }}
                >
                  FTM Balance : {ftmBalance}
                  {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {ftmBalance}
                  </span> */}
                </Button>
                <NavDropdown
                  title={
                    user.FirstName + " " + user.LastName === "John Doe"
                      ? "Admin"
                      : user.FirstName + " " + user.LastName
                  }
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item>
                    <Link to="/myaccount" style={ddStyle}>
                      Account
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    {user.Email === "johndoe@gmail.com" ? (
                      <Link to="/mywallet" style={ddStyle}>
                        Company Wallet
                      </Link>
                    ) : (
                      <Link to="/mywallet" style={ddStyle}>
                        Wallet
                      </Link>
                    )}
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    {user.Email === "johndoe@gmail.com" && (
                      <Link to="/companyearnings" style={ddStyle}>
                        Company Earnings
                      </Link>
                    )}
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    {user.Email !== "johndoe@gmail.com" && (
                      <Link to="/myportfolio" style={ddStyle}>
                        Portfolio
                      </Link>
                    )}
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to="" style={ddStyle} onClick={handleLogout}>
                      Logout
                    </Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarLayout;
