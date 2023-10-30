import { Badge, Box, Flex, Stat, StatHelpText, StatLabel, StatNumber, Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useSteps } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { SupabaseClient, createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "database.types";
import { calculateAmountOwed, calculateTotalWeight, calculateUnpaidWeight, calculateVolumeWeight, groupBy, parseDestination, shipmentIdToDate } from "~/utils/utils";



export const loader = async ({ request }: LoaderFunctionArgs) => {

    const response = new Response()

    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        request,
        response,
    })

    const user = await supabase.auth.getUser()

    const { data: packages, error } = await supabase.from("packages").select("*").eq("sender_id", user.data.user?.id)


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
}


const steps = [
    { title: 'Created', description: 'Contact Info' },
    { title: 'In Transit', description: 'Date & Time' },
    { title: 'Received', description: 'Select Rooms' },
    { title: 'Picked Up', description: 'Select Rooms' },
]

export default function MyPackages() {
    const { packages } = useLoaderData<typeof loader>()

    const shipments = packages ? (groupBy(packages!, ["shipment_id", "destination"])) : null

    const { activeStep } = useSteps({
        index: 3,
        count: steps.length,
    })

    //console.log(Object.entries(shipments).map(([key, shipmentPackages]) => groupBy(shipmentPackages as Array<any>, "destination")))
    //console.log(groupBy(shipments, "destination"))
    //groupBy(packages, 'shipment_id')
    //console.log(shipments)
    //ADD status to Stepper index
    return (
        <Box maxH={"70vh"}>
            {
                Object.entries(shipments!).map(([shipmentId, shipmentCountries]) =>
                    Object.entries(shipmentCountries as Object).map(([country, shipmentPackages]) => 
                        <Box key={shipmentId + country} border={"2px"} borderColor={"#4299E1"} borderRadius={10} mb={10}>
                            <Flex p={5} borderTopRadius={5} bg={"#4299E1"} color={"white"} fontSize={"4xl"} flexWrap={"wrap"}>
                                <Box>{shipmentIdToDate(shipmentId)}</Box>
                                <Box ml={"auto"}>{parseDestination(country)}</Box>
                            </Flex>
                            <Stepper index={0} p={10} flexWrap={"wrap"}> 
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
                                        <StatNumber>{(shipmentPackages as Array<any>).at(0).reciever_email}</StatNumber>
                                    </Stat>
                                </Box>
                                <Box mr={"auto"}>
                                    <Stat>
                                        <StatLabel>Total Weight</StatLabel>
                                        <StatNumber>{calculateTotalWeight((shipmentPackages as Array<any>))}</StatNumber>
                                    </Stat>
                                </Box>
                                <Box>
                                    <Stat>
                                        <StatLabel>Total Amount Owed <Badge colorScheme={calculateUnpaidWeight((shipmentPackages as Array<any>)) ? "red" : "green"}>{calculateUnpaidWeight((shipmentPackages as Array<any>)) ? "not paid" : "paid"}</Badge></StatLabel>
                                        <StatNumber>{calculateAmountOwed(calculateUnpaidWeight((shipmentPackages as Array<any>)), country)}</StatNumber>
                                    </Stat>
                                </Box>
                            </Flex>
                            <Tabs p={10}>
                                <TabList>
                                    {
                                        Object.entries(shipmentPackages as Object).map(([key, _]) => (<Tab key={key}>{key + 1}</Tab>))
                                    }
                                </TabList>
                                <TabPanels>
                                    {
                                        Object.entries(shipmentPackages as Object).map(([key, props]) => (
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
                                                    <Stat>
                                                         <Badge colorScheme={props.paid ? "green" : "red"}>{props.paid ? "paid" : "not paid"}</Badge> 
                                                    </Stat>
                                                </Flex>
                                                <Box mt={5}>
                                                    <Stat>
                                                        <StatNumber>Description</StatNumber>
                                                        <StatLabel>{props.description}</StatLabel>
                                                    </Stat>
                                                </Box>
                                            </TabPanel>
                                        ))
                                    }
                                </TabPanels>
                            </Tabs>
                        </Box>
                    ))
            }
            <Box h={1} />
        </Box>
    )
}