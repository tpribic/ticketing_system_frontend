import React, { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown, Icon, Container, Sidenav, IconButton, Drawer, ButtonToolbar, Button } from 'rsuite';
import AuthService from '../../Services/AuthService';
import { Link, useHistory } from "react-router-dom";
import useWindowDimensions from '../../Hooks/windowDimensionHook';
import jwt_decode from 'jwt-decode';


const NavigationInstance = ({ onSelect, activeKey, ...props }) => {

    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [username, setUsername] = useState(undefined);
    const [toggleSideNav, setToggleSideNav] = useState(false);

    const history = useHistory();
    const { width } = useWindowDimensions();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            // setShowEmployeeBoard(user.roles.includes("ROLE_EMPLOYEE"));
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
        <>
            <Navbar {...props}>
                <Navbar.Body>
                    <Nav onSelect={onSelect} activeKey={activeKey}>
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
                                {/* <Dropdown.Item eventKey="4" icon={<Icon icon="cog" />}>Profile settings</Dropdown.Item> */}
                                <Dropdown.Item eventKey="5" icon={<Icon icon="sign-out" />} onClick={logOut}>Logout</Dropdown.Item>
                            </Dropdown>
                        }
                    </Nav>

                    <Nav>
                        {
                            width < 768 && currentUser ?
                                <Nav.Item icon={<Icon icon="align-justify" />} onClick={() => setToggleSideNav(!toggleSideNav)}></Nav.Item>
                                :
                                null
                        }
                    </Nav>
                </Navbar.Body>
            </Navbar>
            {currentUser && width > 767 ?
                <Container style={{ width: 250 }}>
                    <Sidenav onSelect={onSelect} activeKey={activeKey} style={{ height: 'calc(100vh - 56px)' }}>
                        <Sidenav.Body>
                            <Nav>
                                <Nav.Item eventKey="1" componentClass={Link} to="/dashboard" icon={<Icon icon="dashboard" />}>
                                    Dashboard
                                </Nav.Item>
                                <Nav.Item eventKey="2" componentClass={Link} to="/tickets" icon={<Icon icon="ticket" />}>
                                    Tickets
                                </Nav.Item>
                                <Nav.Item eventKey="3" componentClass={Link} to="/products" icon={<Icon icon="cubes" />}>
                                    Products
                                </Nav.Item>
                            </Nav>
                        </Sidenav.Body>
                    </Sidenav>
                </Container>
                :
                <Container style={{ width: 250 }}>
                    <Drawer
                        placement={'left'}
                        show={toggleSideNav}
                        onHide={() => setToggleSideNav(false)}
                        style={{ width: 250 }}
                    >
                        <Drawer.Header>
                            <Drawer.Title>Menu</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body >
                            <Nav vertical onSelect={onSelect} activeKey={activeKey} appearance='subtle'>
                                <Nav.Item eventKey="1" componentClass={Link} to="/dashboard" icon={<Icon icon="dashboard" />}>
                                    Dashboard
                                </Nav.Item>
                                <Nav.Item eventKey="2" componentClass={Link} to="/tickets" icon={<Icon icon="ticket" />}>
                                    Tickets
                                </Nav.Item>
                                <Nav.Item eventKey="3" componentClass={Link} to="/products" icon={<Icon icon="cubes" />}>
                                    Products
                                </Nav.Item>
                            </Nav>
                        </Drawer.Body>
                    </Drawer>
                </Container>
            }
        </>
    );
};

export default NavigationInstance;