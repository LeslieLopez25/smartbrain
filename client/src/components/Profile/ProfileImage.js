import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProfileImage({
  toggleModal,
  user,
  direction = "down",
  ...args
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout, user: auth0User } = useAuth0();

  // Toggles the dropdown menu open/closed
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div className="pa3 tc">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={direction}>
        <DropdownToggle data-toggle="dropdown" tag="span">
          <img
            src={
              user?.profile_image
                ? `${user.profile_image}?t=${new Date().getTime()}`
                : auth0User?.picture
            }
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
          <DropdownItem
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
