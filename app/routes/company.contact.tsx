import { Box, Button, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react";

export default function Contact() {
    return (
        <Box bg={"white"} color={"#4299E1"} borderRadius={10} p={10} minW={"100%"}>
            <Heading mx={"auto"} mb={5} width={"-webkit-fit-content"}>National Identification Number</Heading>
            <Text>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." </Text>
            <br />
            <Text as={"b"} fontSize={"2xl"}>Requirements</Text>
            <UnorderedList>
                <ListItem>1</ListItem>
                <ListItem>2</ListItem>
            </UnorderedList>
            <Box mx={"auto"} width={"-webkit-fit-content"}><Button mx={"auto"}> Book Appointment </Button></Box>
        </Box>
    )
}
