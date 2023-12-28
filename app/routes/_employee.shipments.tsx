import { Box, Button, Flex, Heading, ListItem, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Text, UnorderedList } from "@chakra-ui/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { Link, useOutletContext } from "@remix-run/react";
import { getShipmentStatus, parseDestinationAndMethod, shipmentIdToDate } from "~/utils/utils";

export const action = async ({ request, }: ActionFunctionArgs) => {

}

const steps = [
    { title: 'Created', description: 'Contact Info' },
    { title: 'In Transit', description: 'Date & Time' },
    { title: 'Received', description: 'Select Rooms' },
    { title: 'Picked Up', description: 'Select Rooms' },
]

export default function Shipments() {
    const { session, user, users, shipments, cargo } = useOutletContext<any>()

    return (
        <Box overflow={"auto"}>
            {shipments.map(
                (shipment: { id: number, destination: string, method: string }) => <Link to={`/shipment/${shipment.id}/${shipment.destination}/${shipment.method}`}>
                    <Flex borderColor={"gray.200"} borderWidth={2} p={20} my={10} _hover={{ "bg": "#F7FAFC", "borderColor": "blackAlpha.800" }}>
                        <Text fontSize={"2xl"}>{`${shipmentIdToDate(shipment.id.toString())} ${parseDestinationAndMethod(shipment.destination, shipment.method)}`}</Text>
                        <Stepper index={getShipmentStatus(shipments, shipment.id, shipment.destination, shipment.method)} flexWrap={"wrap"} ml={"auto"}>
                                    {steps.map((step, index) => (
                                        <Step key={index}>
                                            <StepIndicator>
                                                <StepStatus
                                                    complete={<StepIcon />}
                                                    incomplete={<StepNumber />}
                                                    active={<StepNumber />}
                                                />
                                            </StepIndicator>

                                            <Box >
                                                <StepTitle>{step.title}</StepTitle>
                                                <StepDescription>{step.description}</StepDescription>
                                            </Box>

                                            <StepSeparator />
                                        </Step>
                                    ))}
                                </Stepper> 
                    </Flex>
                </Link>
            )}
        </Box>
    )
}
