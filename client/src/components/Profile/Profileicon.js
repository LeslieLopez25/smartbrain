import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export default function ProfileIcon({
  onRouteChange,
  toggleModal,
  direction = "down",
  ...args
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div className="pa3 tc">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={direction}>
        <DropdownToggle data-toggle="dropdown" tag="span">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="br-100 pa1 ba b--black-10 h3 w3"
            alt="avatar"
          />
        </DropdownToggle>
        <DropdownMenu
          right
          {...args}
          className="b--transparent shadow-5"
          style={{
            marginTop: "20px",
            backgroundColor: "rgba(255,255,255, 0.5)",
          }}
        >
          <DropdownItem onClick={toggleModal}>View Profile</DropdownItem>
          <DropdownItem onClick={() => onRouteChange("signout")}>
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
