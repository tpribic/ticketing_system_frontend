import React, { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown, Icon } from 'rsuite';
import AuthService from '../../Services/AuthService';
import { Link, useHistory } from "react-router-dom";


const NavBarInstance = ({ onSelect, activeKey, ...props }) => {

    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);

    const history = useHistory();


    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
            // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
            // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        history.push("/login");
    };

    return (
        <Navbar {...props}>
            {/* <Navbar.Header>
                <Nav>
                    <Nav.Item>
                        STS
                    </Nav.Item>
                </Nav>
            </Navbar.Header> */}
            <Navbar.Body>
                <Nav onSelect={onSelect} activeKey={activeKey}>
                    {/* <Nav.Item eventKey="1" icon={<Icon icon="home" />}>
                        Home
                    </Nav.Item> */}
                    {currentUser === undefined ?
                        <>
                            <Nav.Item eventKey="2" componentClass={Link} to="/login">Login</Nav.Item>
                            <Nav.Item eventKey="3" componentClass={Link} to="/register">Register</Nav.Item>
                        </>
                        :
                        <Nav.Item eventKey="15" onClick={logOut}>Log Out</Nav.Item>
                    }
                    {/* <Dropdown title="About">
                        <Dropdown.Item eventKey="4">Company</Dropdown.Item>
                        <Dropdown.Item eventKey="5">Team</Dropdown.Item>
                        <Dropdown.Item eventKey="6">Contact</Dropdown.Item>
                    </Dropdown> */}
                </Nav>

                <Nav pullRight>
                    <Nav.Item icon={<Icon icon="cog" />}>Profile settings</Nav.Item>
                </Nav>
                {console.log(currentUser)}
            </Navbar.Body>
        </Navbar>
    );
};

export default NavBarInstance;