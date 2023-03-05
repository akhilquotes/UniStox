import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import { Alert, Button, Row, Col } from "react-bootstrap";
import { useFirestore } from "../../context/FirestoreContext";
import { useUserAuth } from "../../context/UserAuthContext";
import { useRapyd } from "../../context/RapydContext";
import { useFantom } from "../../context/FantomContext";
import Swal from "sweetalert2";
import moment from "moment";

const Step3 = ({ user, setUser, currentStep, setCurrentStep, doSignUp }) => {
  const [error, setError] = useState("");
  const { addDocument } = useFirestore();
  const { signUp, deleteUser } = useUserAuth();
  const { createWallet, getListOfDocs, verifyIdentity, listContacts } =
    useRapyd();
  const { createEthereumWallet } = useFantom();
  const [verFields, serVerFields] = useState([]);
  const [docCount, setDocCount] = useState(-1);
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      try {
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      getListOfDocs(user.Country).then((res) => {
        let fields = res.body.data;
        serVerFields(fields);
      });
      isInitialMount.current = false;
    } else {
      console.log("Entered addDoc method");
      addDocument(user, "Users").then((res) => {
        setCurrentStep(currentStep + 1);
        console.log(user);
        Swal.close();
      });
    }
  }, [user.RapydAcc.ewallet_id]);

  const handleSkip = async () => {
    try {
      Swal.fire({
        title: "Creating account..please wait",
      });
      Swal.showLoading();
      await signUp(user.Email, user.Password);
      const fdata = await createEthereumWallet();
      const fantomAcc = {
        wallet_address: fdata.address,
        wallet_privatekey: fdata.privateKey,
      };
      console.log(user);
      console.log(user.DOB);

      let dobSplit = user.DOB.split("-");
      console.log(dobSplit);
      // let userCreated = {
      //   ...user,
      //   DOB: dobSplit[1] + "/" + dobSplit[2] + "/" + dobSplit[0],
      // };
      //console.log(userCreated);
      const data = await createWallet(user);
      const rapydAcc = {
        ewallet_id: data.body.data.id,
        ewallet_reference_id: data.body.data.ewallet_reference_id,
      };

      setUser({
        ...user,
        RapydAcc: rapydAcc,
        FantomAcc: fantomAcc,
      });
    } catch (e) {
      alert(e);
    }
  };
  const handleNext = async () => {
    try {
      if (doSignUp === "true") {
        Swal.fire({
          title: "Creating account..please wait",
        });
        Swal.showLoading();
        await signUp(user.Email, user.Password);
        const fdata = await createEthereumWallet();
        const fantomAcc = {
          wallet_address: fdata.address,
          wallet_privatekey: fdata.privateKey,
        };
        const data = await createWallet(user);
        const rapydAcc = {
          ewallet_id: data.body.data.id,
          ewallet_reference_id: data.body.data.ewallet_reference_id,
        };
        Swal.close();
        Swal.fire({
          title: "verifying documents..please wait",
        });
        Swal.showLoading();
        let doc = verFields[0];
        let file_front = document.getElementById("front_" + doc.type).files[0];
        let file_back = document.getElementById("back_" + doc.type).files[0];
        let file_front_str = "";
        let file_back_str = "";
        convertBase64(file_front).then(
          (file) => {
            console.log(file);
            file_front_str = file;
            convertBase64(file_back).then(
              (file) => {
                console.log(file);
                file_back_str = file;
                listContacts(data.body.data.id).then((contactRes) => {
                  if (contactRes.body.status.status === "ERROR") {
                    Swal.close();
                    Swal.fire(
                      "Error!",
                      contactRes.body.status.error_code,
                      "error"
                    );
                  } else {
                    verifyIdentity(
                      user.Country,
                      doc.type,
                      data.body.data.id,
                      file_front_str,
                      file_back_str,
                      contactRes.body.data[0].id
                    ).then((d) => {
                      if (d.body.status.status === "ERROR") {
                        Swal.close();
                        Swal.fire("Error!", d.body.status.error_code, "error");
                      } else {
                        Swal.close();
                        Swal.fire(
                          "Verification successful!",
                          "KYC Id:" + d.body.data.id,
                          "success"
                        );
                        setUser({
                          ...user,
                          RapydAcc: rapydAcc,
                          FantomAcc: fantomAcc,
                        });
                      }
                    });
                  }
                });
              },
              (e) => {
                console.log(e);
              }
            );
          },
          (e) => {
            console.log(e);
          }
        );
      } else {
        Swal.fire({
          title: "verifying documents..please wait",
        });
        Swal.showLoading();
        let doc = verFields[0];
        let file_front = document.getElementById("front_" + doc.type).files[0];
        let file_back = document.getElementById("back_" + doc.type).files[0];
        let file_front_str = "";
        let file_back_str = "";
        convertBase64(file_front).then(
          (file) => {
            console.log(file);
            file_front_str = file;
            convertBase64(file_back).then(
              (file) => {
                console.log(file);
                file_back_str = file;
                listContacts(user.RapydAcc.ewallet_id).then((contactRes) => {
                  if (contactRes.body.status.status === "ERROR") {
                    Swal.close();
                    Swal.fire(
                      "Error!",
                      contactRes.body.status.error_code,
                      "error"
                    );
                  } else {
                    verifyIdentity(
                      user.Country,
                      doc.type,
                      user.RapydAcc.ewallet_id,
                      file_front_str,
                      file_back_str,
                      contactRes.body.data[0].id
                    ).then((d) => {
                      if (d.body.status.status === "ERROR") {
                        Swal.close();
                        Swal.fire("Error!", d.body.status.error_code, "error");
                      } else {
                        Swal.close();
                        Swal.fire(
                          "Verification successful!",
                          "KYC Id:" + d.body.data.id,
                          "success"
                        );
                      }
                    });
                  }
                });
              },
              (e) => {
                console.log(e);
              }
            );
          },
          (e) => {
            console.log(e);
          }
        );
      }
    } catch (e) {
      Swal.close();
      Swal.fire("Error!", e, "error");
    }
    //     setDocCount(docCount + 1);
    //   }
    //   const rapydAcc = {
    //     ewallet_id: data.body.data.id,
    //     ewallet_reference_id: data.body.data.ewallet_reference_id,
    //   };
    //   setUser({ ...user, RapydAcc: rapydAcc });
    // } else {
    //   deleteUser();
    //
    // }
  };
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div style={{ marginTop: "2vh" }}>
        <div className="p-4 box">
          <h2 className="mb-3">User Verification</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            {verFields.map((field, i) => (
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Label>
                      {field.name} Front <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      isValid={docCount === i ? true : false}
                      Id={"front_" + field.type}
                    />
                  </Col>
                  <Col>
                    <Form.Label>
                      {field.name} Back{" "}
                      <span style={{ color: "red" }}>
                        {" "}
                        {field.is_back_required ? "*" : ""}
                      </span>
                    </Form.Label>
                    <Form.Control
                      Id={"back_" + field.type}
                      type="file"
                      multiple
                    />
                  </Col>
                </Row>
              </Form.Group>
            ))}

            <div class="d-flex align-items-end" style={{ height: "12.5vh" }}>
              {doSignUp === "true" ? (
                <>
                  <Button
                    className="me-auto"
                    variant="info"
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                  <Button
                    className="ms-auto"
                    variant="link"
                    onClick={handleSkip}
                  >
                    Skip
                  </Button>
                  <Button variant="info" onClick={handleNext}>
                    Verify
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="info"
                    className="ms-auto"
                    onClick={handleNext}
                  >
                    Verify
                  </Button>
                </>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Step3;
