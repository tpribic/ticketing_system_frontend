import React, { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown, Icon } from 'rsuite';
import AuthService from '../../Services/AuthService';
import { Link, useHistory } from "react-router-dom";
import jwt_decode from 'jwt-decode';


const NavBarInstance = ({ onSelect, activeKey, ...props }) => {

    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [username, setUsername] = useState(undefined)

    const history = useHistory();


    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
            // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            const decodedUser = jwt_decode(currentUser.token);
            setUsername(decodedUser.username);
        }
    }, [currentUser])

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
                        null
                    }

                </Nav>

                <Nav pullRight>
                    {currentUser === undefined ?
                        null
                        :
                        <Dropdown title={username} icon={<Icon icon="user" />}>
                            <Dropdown.Item eventKey="4" icon={<Icon icon="cog" />}>Profile settings</Dropdown.Item>
                            <Dropdown.Item eventKey="5" icon={<Icon icon="sign-out" />} onClick={logOut}>Logout</Dropdown.Item>
                        </Dropdown>
                    }
                    {/* <Nav.Item icon={<Icon icon="user" />}></Nav.Item>
                    <Nav.Item icon={<Icon icon="cog" />}>Profile settings</Nav.Item> */}
                </Nav>
            </Navbar.Body>
        </Navbar>
    );
};

export default NavBarInstance;