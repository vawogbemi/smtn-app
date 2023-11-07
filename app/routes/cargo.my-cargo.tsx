import { Badge, Box, Flex, Stat, StatHelpText, StatLabel, StatNumber, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Tab, TabList, TabPanel, TabPanels, Tabs, Text, filter, useSteps } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { SupabaseClient, createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { calculateAmountOwed, calculateTotalWeight, calculateUnpaidWeight, calculateVolumeWeight, getCargoBoxes, getShipmentStatus, groupBy, parseDestinationAndMethod, shipmentIdToDate } from "~/utils/utils";



/*export const loader = async ({ request }: LoaderFunctionArgs) => {

    const response = new Response()

    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        request,
        response,
    })

    const user = (await supabase.auth.getUser()).data.user!

    const { data: packages, error } = await supabase.from("packages").select("*").eq("sender_id", user.id)


    if (error) {
        console.log(error)
    }

    return json(
        {
            packages,
        },
        {
            headers: response.headers,
        }
    )
}*/


const steps = [
    { title: 'Created', description: 'Contact Info' },
    { title: 'In Transit', description: 'Date & Time' },
    { title: 'Received', description: 'Select Rooms' },
    { title: 'Picked Up', description: 'Select Rooms' },
]

export default function MyPackages() {
    //const { packages } = useLoaderData<typeof loader>()

    const { session, user, shipments, cargo, boxes } = useOutletContext<any>()

    const filteredCargo = cargo!.filter((cargo: { sender: any, employee: any; }) => cargo.sender == "user.id")
    //console.log(getCargoBoxes(boxes, "231103", , destination, method))
    return (
        <Box maxH={"70vh"}>
            {filteredCargo.length ?
                Object.entries(groupBy(filteredCargo, ["shipment", "destination", "method"])).reverse().map(([shipment, destinations]) =>
                    Object.entries((destinations as Object)).map(([destination, methods]) =>
                        Object.entries(methods as Object).map(([method, [details]]) =>
                            <Box key={shipment + destination + method} border={"2px"} borderColor={"smtn"} borderRadius={10} mb={10}>
                                <Flex p={5} borderTopRadius={5} bg={"smtn"} color={"white"} fontSize={"4xl"} flexWrap={"wrap"}>
                                    <Box>{shipmentIdToDate(shipment)}</Box>
                                    <Box ml={"auto"}>{parseDestinationAndMethod(destination, method)}</Box>
                                </Flex>
                                <Stepper index={getShipmentStatus(shipments, shipment, destination, method)} p={10} flexWrap={"wrap"}>
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
                                <Flex p={10} flexWrap={"wrap"}>
                                    <Box mr={"auto"}>
                                        <Stat>
                                            <StatLabel>Receiver</StatLabel>
                                            <StatNumber>{details.receiver}</StatNumber>
                                        </Stat>
                                    </Box>
                                    <Box mr={"auto"}>
                                        <Stat>
                                            <StatLabel>Total Weight</StatLabel>
                                            <StatNumber>{calculateTotalWeight(getCargoBoxes(boxes, shipment, details.id, destination, method))}</StatNumber>
                                        </Stat>
                                    </Box>
                                    <Box>
                                        <Stat>
                                            <StatLabel>Cost<Badge colorScheme={details.paid ? "green" : "red"} ml={2}>{details.paid ? "paid" : "not paid"}</Badge></StatLabel>
                                            <StatNumber>{calculateAmountOwed(calculateTotalWeight(getCargoBoxes(boxes, shipment, details.id, destination, method)), destination, method)}</StatNumber>
                                        </Stat>
                                    </Box>
                                </Flex>
                                <Box p={10}>
                                    <Stat>
                                        <StatLabel>Description</StatLabel>
                                        <Text>{details.description}</Text>
                                    </Stat>
                                </Box>
                                <Tabs p={10}>
                                    <TabList>
                                        {
                                            Object.entries(getCargoBoxes(boxes, shipment, details.id, destination, method)).map(([key, _]) => (<Tab key={key}>{parseInt(key) + 1}</Tab>))
                                        }
                                    </TabList>
                                    <TabPanels>
                                        {
                                            Object.entries(getCargoBoxes(boxes, shipment, details.id, destination, method)).map(([key, props]) => (
                                                <TabPanel key={key}>
                                                    <Flex flexWrap={"wrap"}>
                                                        <Stat>
                                                            <StatLabel>Length</StatLabel>
                                                            <StatNumber>{props.length}</StatNumber>
                                                        </Stat>
                                                        <Stat>
                                                            <StatLabel>Width</StatLabel>
                                                            <StatNumber>{props.width}</StatNumber>
                                                        </Stat>
                                                        <Stat>
                                                            <StatLabel>Height</StatLabel>
                                                            <StatNumber>{props.height}</StatNumber>
                                                        </Stat>
                                                        <Stat>
                                                            <StatLabel>Weight</StatLabel>
                                                            <StatNumber>{(calculateVolumeWeight(props.length, props.width, props.height) > props.weight) ? calculateVolumeWeight(props.length, props.width, props.height) : props.weight}</StatNumber>
                                                            {(calculateVolumeWeight(props.length, props.width, props.height) > props.weight) ? <StatHelpText> *Volume weight - original weight was {props.weight} </StatHelpText> : <></>}
                                                        </Stat>
                                                    </Flex>
                                                </TabPanel>
                                            ))
                                        }
                                    </TabPanels>
                                </Tabs>
                            </Box>
                        )))
                : <Text color={"smtn"}>You have no cargo to track</Text>}
            <Box h={1} />
        </Box>
    )
}