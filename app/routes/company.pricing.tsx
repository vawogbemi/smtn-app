import { Box, Button, Flex, Heading, ListItem, Select, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr, UnorderedList } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Pricing() {
    const [destination, setDestination] = useState("")
    const [method, setMethod] = useState("")
    const [prices, setPrices] = useState(["", "", ""])

    const pricing = {
        "": {
            "": ["", "", ""],
            "AIR": ["", "", ""],
            "SEA": ["", "", ""],
        },
        "NG": {
            "": ["", "", ""],
            "AIR": ["$20", "$15", "$12"],
            "SEA": ["$280", "$350", ""],
        },
        "CA": {
            "": ["", "", ""],
            "AIR": ["₦3500", "₦3200", "₦3100"],
            "SEA": ["", "", ""],
        }
    }

    useEffect(() => {
        setPrices((pricing as any)[destination][method])
    }, [destination, method])

    return (
        <Box>
            <Heading mx={"auto"} mb={5} width={"-webkit-fit-content"}>Pricing</Heading>
            <b><Text fontSize={"xl"}>Our pricing structure is tailored to provide you with the best value for your money. The heavier the items you send, the better the deal you get.</Text></b>
            <br />
            <b><Text fontSize={"xl"}>We may charge extra for volume. If the {"("}length x width x height{")"} / 366 is greater than the weight of the box we will charge for the volume weight instead. </Text></b>

            <br />

            <Flex>
                <Select placeholder='Destination' defaultValue={"DE"} onChange={(e) => setDestination(e.target.value)}>
                    <option value='NG'>Nigeria 🇳🇬</option>
                    <option value='CA'>Canada 🇨🇦</option>
                </Select>
                <Select placeholder='Method' defaultValue={"ME"} onChange={(e) => setMethod(e.target.value)} ml={10}>
                    <option value='AIR'>AIR ✈️</option>
                    <option value='SEA'>SEA 🚢</option>
                </Select>

            </Flex>

            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>{method == "AIR" ? "Weight" : "Size"}</Th>
                            <Th>Price {"(per/kg)"}</Th>
                            <Th>{destination == "CA" && method == "AIR" ? "Clearance Fee" : ""}</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>{method == "SEA" ? "small" : destination == "NG" ? "1-9kg" : "0-5kg" }</Td>
                            <Td>{prices.at(0)}</Td>
                            <Td>{destination == "CA" && method == "AIR" ? "$20.00 Flat Rate" : ""}</Td>
                        </Tr>
                        <Tr>
                            <Td>{method == "SEA" ? "large" : destination == "CA" ? "10-99kg" : "5-14kg" }</Td>
                            <Td>{prices.at(1)}</Td>
                            <Td>{destination == "CA" && method == "AIR" ? "$2.00 per kg" : ""}</Td>
                        </Tr>
                        <Tr>
                            <Td>{method == "SEA" ? "" : destination == "CA" ? "+100kg" : "+15kg" }</Td>
                            <Td>{prices.at(2)}</Td>
                            <Td>{destination == "CA" && method == "AIR" ? "$1.50 per kg" : ""}</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}
