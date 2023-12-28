import { Avatar, Box, Button, Card, CardHeader, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { isEmployee } from "~/utils/utils";
import logo from "../../public/images/CARGO-LOGO 1.png";


export default function Navbar(props: any) {
    //console.log(props.session.user.user_metadata.avatar_url)

    const handleLogout = async () => {
        await props.supabase.auth.signOut()
        return redirect("/")
    }


    return (
        <Flex flexWrap={"wrap"} w={"100%"} h={["fit-content", "fit-content"]} bg={"smtn"} p={5}>
            <Box w={["100vw", "auto"]}><Link to={"/"} onClick={() => {props.setSignUp(false);props.setLogin(false)}}> <Image src={logo} height={59} mx={["auto", 0]}></Image> </Link></Box>
            <Wrap ml={["auto"]} height={["auto", "auto", 50]}>
                <WrapItem>
                    <Menu>
                        <MenuButton borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["100vw", 0]} _hover={{ "bg": "white", "color": "#4299E1" }}>
                            <Text fontSize={["4xl", "4xl", "4xl", "2xl"]}>Company</Text>
                        </MenuButton>
                        <MenuList color={"#4299E1"}>
                            <Link to={"/company/about"} onClick={() => {props.setSignUp(false);props.setLogin(false)}}><MenuItem fontSize={["6xl", "4xl", "4xl", "2xl"]}>About Us</MenuItem></Link>
                            <Link to={"/company/pricing"} onClick={() => {props.setSignUp(false);props.setLogin(false)}}><MenuItem fontSize={["6xl", "4xl", "4xl", "2xl"]}>Pricing</MenuItem></Link>
                            <Link to={"/company/faq"} onClick={() => {props.setSignUp(false);props.setLogin(false)}}><MenuItem fontSize={["6xl", "4xl", "4xl", "2xl"]}>Frequently Asked Questions</MenuItem></Link>
                            <Link to={"/company/bvn"} onClick={() => {props.setSignUp(false);props.setLogin(false)}}><MenuItem fontSize={["6xl", "4xl", "4xl", "2xl"]}>Banking Verification Number</MenuItem></Link>
                            <Link to={"/company/nin"} onClick={() => {props.setSignUp(false);props.setLogin(false)}}><MenuItem fontSize={["6xl", "4xl", "4xl", "2xl"]}>National Identification Number</MenuItem></Link>
                            <Link to={"/company/nin"} onClick={() => {props.setSignUp(false);props.setLogin(false)}}><MenuItem fontSize={["6xl", "4xl", "4xl", "2xl"]}>Drivers</MenuItem></Link>
                        </MenuList>
                    </Menu>
                </WrapItem>
                {props.session ?
                    <WrapItem>
                        <Menu>
                            <MenuButton borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["100vw", 0]} _hover={{ "bg": "white", "color": "#4299E1" }}>
                                <Text fontSize={["4xl", "4xl", "4xl", "2xl"]}>Cargo</Text>
                            </MenuButton>
                            <MenuList color={"#4299E1"}>
                                <Link to={"/cargo/my-cargo"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>My Cargo</MenuItem></Link>
                                <Link to={"/cargo/add"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Add Cargo</MenuItem></Link>
                            </MenuList>
                        </Menu>
                    </WrapItem> :
                    <></>}
                {props.session && isEmployee(props.session.user.id) ?
                    <WrapItem>
                        <Menu>
                            <MenuButton borderRadius={5} px={2.5} py={12.5} my={"auto"} minW={["100vw", 0]} _hover={{ "bg": "white", "color": "#4299E1" }}>
                                <Text fontSize={["4xl", "4xl", "4xl", "2xl"]}>Employee</Text>
                            </MenuButton>
                            <MenuList color={"#4299E1"}>
                                <Link to={"/boxes"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Boxes</MenuItem></Link>
                                <Link to={"/shipments"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Shipments</MenuItem></Link>
                                <Link to={"/company/bvn"}><MenuItem fontSize={["4xl", "4xl", "4xl", "2xl"]}>Customers</MenuItem></Link>
                            </MenuList>
                        </Menu>
                    </WrapItem> :
                    <></>}
                <WrapItem minW={["100vw", 0]}>
                    {
                        props.session ?
                            <Menu>
                                <MenuButton as={Avatar} name={props.user.name} borderRadius={5} px={5} py={25} my={"auto"} minW={["20vw", 0]} mx={["auto", 0]} border={""} _hover={{ "border": "2px", "borderColor": "white", "color": "#4299E1" }} />
                                <MenuList color={"#4299E1"}>
                                    <Flex p={3} bg={"#4299E1"}><Text color={"white"}>{props.user.name}</Text></Flex>
                                    <Link to={"/account"}><MenuItem>Account</MenuItem></Link>
                                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                                </MenuList>
                            </Menu> :
                            <Box mx={["auto", 0]} py={[5,5,5,2]}>
                                <Button px={10} bg={"blackAlpha.800"} color={"white"} _hover={{ bg: "white", color: "blackAlpha.800" }} onClick={() => {props.setLogin(!props.login);props.setSignUp(false)}}>Login</Button>
                                <Button ml={3} px={10} bg={"blackAlpha.800"} color={"white"} _hover={{ bg: "white", color: "blackAlpha.800" }} onClick={() => {props.setSignUp(!props.signUp);props.setLogin(false)}}>Sign Up</Button>
                            </Box>
                    }
                </WrapItem>
            </Wrap>
        </Flex>
    )
}

/*

<Auth
                                    supabaseClient={props.supabase}
                                    onlyThirdPartyProviders={true}
                                    appearance={{ theme: ThemeSupa }}
                                    theme="dark"
                                    showLinks={false}
                                    providers={['google']}
                                    redirectTo={process.env.NODE_ENV == "development" ? "http://localhost:3000/auth/callback" : "https://smtn-app.fly.dev/auth/callback"}
                                />
*/