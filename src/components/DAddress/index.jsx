import "./Address.css";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { TurnedIn } from "@mui/icons-material";
import data from "./data/api-response-address.json";

const DAddress = forwardRef((props, ref) => {
  //Example - <DAddress/>
  //Example with props - <DAddress addrapiUrl="https://api.example.com/address" id="2132"></DAddress>
  const { addrapiUrl, id, editCustomer } = props;
  const isDisabled = editCustomer ? false : true;

  //state value to display data, zip code, address, API
  const [uspsValue, setUspsValue] = useState(editCustomer ? false : true);
  const [isUpsDisplay, setIsUpsDisplay] = useState(editCustomer ? false : true);
  const [addrval, setAddral] = useState(data.address.addressline);
  const [zipCode, setZipCode] = useState(data.address.zipcode);
  const [showButton, setShowButton] = useState(editCustomer ? true : false);
  const [details, setDetails] = useState({});
  const [city, setCity] = useState(data.address.city);
  const [country, setCountry] = useState(data.address.country);
  const [state, setState] = useState(data.address.state);
  const [preDirections, setPreDirections] = useState(
    data.address.dialogpredirectionalcode
  );
  const [postDirections, setPostDirections] = useState(
    data.address.dialogpostdirectionalcode
  );
  const [streetSuffix, setStreetSuffix] = useState(
    data.address.dialogstreetnamesuffix
  );
  const [streetNum, setStreetNum] = useState(data.address.dialogstreetNumber);
  const [streetName, setStreetName] = useState(data.address.dialogstreetname);
  const [isClick, setIsClick] = useState(editCustomer ? false : true);
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    getData() {
      return {
        addressline: addrval,
        city: city,
        state: state,
        country: country,
        zipcode: zipCode,
        addressverify: isClick ? "Yes" : "No",
      };
    },
  }));

  //Open dialog after clicking on 'Modify Address' button
  const handleOpen = () => setOpen(true);

  //Handles closing dialog and get address field values
  const handleClose = (e) => {
    setOpen(false);
    const dialogData = `${streetNum} ${streetName} ${streetSuffix} ${postDirections}`;
    setAddral(dialogData);
    verifyAddress(dialogData);
  };

  //Handles verify button action
  const clickAddress = () => {
    setIsUpsDisplay(true);
    verifyAddress(addrval);
    setShowButton(false);
    setIsClick(true);
  };

  //Handle addressline field validation
  const verifyAddress = (address) => {
    if (address === data.address.correctaddress) {
      setUspsValue(true);
    } else {
      setUspsValue(false);
    }
  };

  //Handle Enter or Tab for submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      clickAddress(e);
      setIsUpsDisplay(true);
      setIsClick(true);
    }
  };

  //Handle address line text field change
  const handleAddrressChange = (e) => {
    const value = e.target.value;
    setAddral(value);
    if (value === "") {
      setIsUpsDisplay(false);
      return;
    }
    setShowButton(true);
  };

  //Fetching JSON API data
  useEffect(() => {
    fetch(`${addrapiUrl}/${id}`)
      .then((response) => response.json())
      .then((data) => setDetails(data))
      .catch((error) => console.log(error));
    //.then((data) => {setDetails(data.address); console.log(details.city)});
  }, [addrapiUrl, id]);

  //Handle zipcode validation only numerics, length max - 10
  const regex = /^[0-9\b]+$/;
  const handleZipCode = (event) => {
    const value = event.target.value;
    if (value === "") {
      setZipCode("");
      return;
    }
    if (regex.test(value) && value.length <= 9) {
      setZipCode(value);
    }
  };

  //Main function starts from here
  //Created two fieldsets with enclosed Box
  return (
    <React.Fragment>
      <div className="addr-box">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <fieldset className="addr-addrfield" style={{}}>
              <legend className="addr-legend">Address</legend>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    className="addr-fieldadrline"
                    fullWidth
                    id="address"
                    error={addrval ? false : true}
                    helperText={addrval.trim() === "" && "Please Enter Address"}
                    label="Address Line"
                    name="address"
                    onChange={handleAddrressChange}
                    onKeyDown={handleKeyDown}
                    value={addrval}
                    autoComplete="off"
                    disabled={isDisabled}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className="addr-fieldadrline"
                    autoComplete="off"
                    name="City"
                    fullWidth
                    id="City"
                    label="City"
                    error={city ? false : true}
                    helperText={city.trim() === "" && "Please Enter City"}
                    defaultValue={city}
                    onChange={(e) => setCity(e.target.value)}
                    InputProps={{
                      readOnly: isDisabled,
                      disabled: isDisabled,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className="addr-fieldadrline"
                    autoComplete="off"
                    fullWidth
                    id="State"
                    label="State"
                    name="State"
                    error={state ? false : true}
                    helperText={state.trim() === "" && "Please Enter State "}
                    defaultValue={state}
                    onChange={(e) => setState(e.target.value)}
                    InputProps={{
                      readOnly: isDisabled,
                      disabled: isDisabled,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="off"
                    name="Zip Code"
                    onChange={(e) => {
                      setShowButton(true);
                      handleZipCode(e);
                    }}
                    value={zipCode}
                    disabled={isDisabled}
                    fullWidth
                    id="ZipCode"
                    label="Zip Code"
                    className="addr-fieldadrline"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className="addr-fieldadrline"
                    fullWidth
                    id="Country"
                    label="Country"
                    error={country ? false : true}
                    helperText={
                      country.trim() === "" && "Please Enter Country "
                    }
                    onChange={(e) => setCountry(e.target.value)}
                    name="Country"
                    autoComplete="off"
                    defaultValue={country}
                    InputProps={{
                      readOnly: isDisabled,
                      disabled: isDisabled,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="AddressVerified"
                    fullWidth
                    value={isClick ? "Yes" : "No"}
                    id="AddressVerified"
                    label="Address Verified"
                    className="addr-fieldadrline"
                    autoComplete="off"
                    disabled={isDisabled}
                    InputLabelProps={{
                      shrink: true,
                      readOnly: isDisabled,
                      disabled: isDisabled,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="addr-verifybtn">
                  {showButton && (
                    <Link href="#" variant="body2" onClick={clickAddress}>
                      Verify Address
                    </Link>
                  )}
                </Grid>
              </Grid>
            </fieldset>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <fieldset className="addr-upsfield">
              <legend className="addr-legend">USPS Validated Address</legend>
              {isUpsDisplay ? ( // condition to display initally empty in USPS window
                //condition to display verified or Not Verified in USPS window
                uspsValue ? (
                  <Grid item>
                    <h6 className="ecode-phtext">{addrval}</h6>
                    <Stack direction={"row"} spacing={1}>
                      <h6 className="ecode-phtext">{city}</h6>
                      <h6 className="ecode-phtext">
                        {state === "DISTRICT OF COLUMBIA" ? "DC" : ""}
                      </h6>
                      <h6 className="ecode-phtext">{zipCode}</h6>
                    </Stack>
                    <Stack direction={"row"} spacing={2} className="addr-tick">
                      <CheckIcon />
                      {data.address.USPSMessage}
                    </Stack>
                  </Grid>
                ) : (
                  <Grid item>
                    <h6 className="ecode-phtext">{addrval}</h6>
                    <Stack direction={"row"} spacing={1}>
                      <h6 className="ecode-phtext">{city}</h6>
                      <h6 variant="h6" className="ecode-phtext">
                        {state === "DISTRICT OF COLUMBIA" ? "DC" : ""}
                      </h6>
                      <h6 variant="h6" className="ecode-phtext">
                        {zipCode}
                      </h6>
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={2}
                      className="addr-NotVerified"
                    >
                      <HighlightOffIcon />
                      {data.address.USPSMessageN}
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleOpen}
                      >
                        Modify Address
                      </Button>
                    </Stack>
                  </Grid>
                )
              ) : (
                <></>
              )}
            </fieldset>
          </Grid>
        </Grid>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth="lg"
        style={{ margin: "2rem" }}
      >
        <fieldset className="addr-addrfielddialog">
          <legend className="addrlegenddialog">Address Details</legend>
          <DialogContent>
            <Grid container spacing={2} style={{ backgroundColor: "white" }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="PreDirectionalCode">
                    Pre-Directional Code
                  </InputLabel>
                  <Select
                    labelId="PreDirectionalCode"
                    id="PreDirectionalCode"
                    value={preDirections}
                    label="Pre-Directional Code"
                    onChange={(e) => setPreDirections(e.target.value)}
                  >
                    <MenuItem value={"SE"}>SE</MenuItem>
                    <MenuItem value={"NE"}>NE</MenuItem>
                    <MenuItem value={"SE"}>SW</MenuItem>
                    <MenuItem value={"SE"}>SE</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="City"
                  label="City"
                  defaultValue={city}
                  InputProps={{
                    readOnly: isDisabled,
                    disabled: isDisabled,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="streetNumber"
                  label="Street Number"
                  value={streetNum}
                  onChange={(e) => setStreetNum(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="State"
                  label="State"
                  name="State"
                  defaultValue={state}
                  InputProps={{
                    readOnly: isDisabled,
                    disabled: isDisabled,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="StreetName"
                  label="Street Name"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="off"
                  name="Zip Code"
                  fullWidth
                  id="ZipCode"
                  label="Zip Code"
                  className="addr-fieldadrline"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="StreetNameSuffix">
                    Street Name Suffix
                  </InputLabel>
                  <Select
                    labelId="StreetNameSuffix"
                    id="StreetNameSuffix"
                    value={streetSuffix}
                    label="Street Name Suffix"
                    onChange={(e) => setStreetSuffix(e.target.value)}
                  >
                    <MenuItem value={"ST"}>ST</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="Country"
                  label="Country"
                  name="Country"
                  defaultValue={country}
                  InputProps={{
                    readOnly: isDisabled,
                    disabled: isDisabled,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="PreDirectionalCode">
                    Post-Directional Code
                  </InputLabel>
                  <Select
                    labelId="PostDirectionalCode"
                    id="PostDirectionalCode"
                    value={postDirections}
                    label="Post-Directional Code"
                    onChange={(e) => setPostDirections(e.target.value)}
                  >
                    <MenuItem value={"SE"}>SE</MenuItem>
                    <MenuItem value={"NE"}>NE</MenuItem>
                    <MenuItem value={"SE"}>SW</MenuItem>
                    <MenuItem value={"SE"}>SE</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} />
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="ApartmentNumber"
                  label="Apartment Number"
                  value={data.address.dialogapartmentnumber}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="outlined" onClick={handleClose}>
              Verify Address
            </Button>
          </DialogActions>
        </fieldset>
      </Dialog>
    </React.Fragment>
  );
});
export default DAddress;
