import { Box, useToast } from "@chakra-ui/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";

export default function Packages() {
    const { session, user, shipments, cargo, boxes } = useOutletContext<any>()
    
    const navigate = useNavigate()
    const toast = useToast()

    useEffect(()=>{
        if (!session) {
            toast({
                title: "You're not logged in.",
                description: "Redirecting you to the home page.",
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
            navigate("/")
        }
        if (!user) {
            toast({
                title: "You haven't set up account details yet",
                description: "Redirecting you to the account page.",
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
            navigate("/account")
        }
    }, [])
    
    return (
        <Box bg={"white"} color={"blackAlpha.800"} borderRadius={10} p={10} w={"90vw"} overflowY={"scroll"}>
            <Outlet context={{ session, user, shipments, cargo, boxes }} />
        </Box>
    )
}