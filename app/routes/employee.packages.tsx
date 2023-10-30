import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Stat, StatLabel, StatNumber, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useOutletContext, useSubmit } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { useForm } from "react-hook-form";
import { CheckboxSingleControl, InputControl } from "react-hook-form-chakra";
import { groupBy } from "~/utils/utils";
import { Database } from "database.types";

export const loader = async ({ request }: LoaderFunctionArgs) => {

    const response = new Response()

    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        request,
        response,
    })

    const user = await supabase.auth.getUser()

    const { data: packages, error } = await supabase.from("packages").select().is("employee_id", null)


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

export const action = async ({ request, }: ActionFunctionArgs) => {
    const body = await request.formData();

    let ids = (body.get("ids") as string).split(",") as Array<any>
    const paid  = JSON.parse(body.get("paid") as string) ? 1 : 0 

    const response = new Response()

    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        request,
        response,
    })

    const employee = await supabase.auth.getUser()

    //let packages = [{}] as Array<any>
    ids = ids.flatMap( id => Array(1).fill({ id: parseInt(id as string), shipmentId: parseInt(body.get("shipmentId") as string), employee_id: employee.data.user?.id, length: parseInt(body.get("length" + id) as string), width: parseInt(body.get("width" + id) as string), height: parseInt(body.get("height" + id) as string), weight: parseInt(body.get("weight" + id) as string), paid: paid, status: 1 }))
    console.log(ids)
    const { error } = await supabase.from("packages").upsert(ids)//.eq("id", 13)  

    if (error){
        console.log(error)
    }

    return true
}

export default function Packages() {

    const { supabase, session, groupedUsers } = useOutletContext<any>()

    const { packages } = useLoaderData<typeof loader>()

    const groupedPackages = packages ? groupBy(packages!, ["sender_id"]) as any : []
    console.log(groupedPackages)
    //console.log(groupedUsers)


    const { handleSubmit, control } = useForm({ mode: "onBlur" })
    const submit = useSubmit()

    return (
        <Accordion>
            {Object.entries(groupedUsers).map(
                ([userId, user]) =>
                    <AccordionItem key={userId}>
                        <h2>
                            <AccordionButton>
                                <Box as="span" flex='1' textAlign='left'>
                                    {(user as Array<any>).at(0).name}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Tabs>
                                <TabList>
                                    {
                                        Object.entries((groupedPackages[userId])).map(([key, packages]) =>
                                            <Tab key={(packages as any).id}>
                                                {parseInt(key) + 1}
                                            </Tab>
                                        )
                                    }
                                </TabList>
                                <Form method="post" onSubmit={handleSubmit((data) => submit({ ...data, ids: Object.values((groupedPackages[userId])).map(item => (item as any).id), shipmentId: groupedPackages ? groupedPackages[userId].at(0).shipment_id : []}, {
                                    action: "",
                                    method: "post",
                                }))}>
                                    <TabPanels>

                                        {
                                            Object.entries((groupedPackages[userId])).map(([_, packages]) =>
                                                <TabPanel key={(packages as any).id} >
                                                    <Flex flexWrap={"wrap"}>
                                                        <Stat p={2}>
                                                            <StatLabel>Package Id</StatLabel>
                                                            <StatNumber>{(packages as any).id}</StatNumber>
                                                        </Stat>
                                                        <Stat p={2}>
                                                            <StatLabel>Length</StatLabel>
                                                            <InputControl name={"length" + (packages as any).id} control={control} />
                                                        </Stat>
                                                        <Stat p={2}>
                                                            <StatLabel>Width</StatLabel>
                                                            <InputControl name={"width" + (packages as any).id} control={control} />
                                                        </Stat>
                                                        <Stat p={2}>
                                                            <StatLabel>Height</StatLabel>
                                                            <InputControl name={"height" + (packages as any).id} control={control} />
                                                        </Stat>
                                                        <Stat p={2}>
                                                            <StatLabel>Weight</StatLabel>
                                                            <InputControl name={"weight" + (packages as any).id} control={control} />
                                                        </Stat>
                                                    </Flex>
                                                </TabPanel>
                                            )
                                        }
                                    </TabPanels>
                                    <Flex mt={10}>
                                        <Stat p={5}>
                                            <StatLabel>Paid</StatLabel>
                                            <CheckboxSingleControl name="paid" control={control}/>
                                        </Stat>
                                        <Button bg={"green"} color={"white"} type="submit">Submit</Button>
                                    </Flex>
                                </Form>
                            </Tabs>

                        </AccordionPanel>
                    </AccordionItem>
            )
            }
        </Accordion >
    )
}