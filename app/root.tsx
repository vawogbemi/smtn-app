// root.tsx
import React, { useContext, useEffect, useState } from 'react'
import { withEmotionCache } from '@emotion/react'
import { extendTheme, ChakraProvider, Flex, Box } from '@chakra-ui/react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from '@remix-run/react'
import { MetaFunction, LinksFunction, LoaderFunctionArgs, json, Session } from '@remix-run/node' // Depends on the runtime you choose
import { ServerStyleContext, ClientStyleContext } from './context'
import Navbar from './components/navbar'
import Footer from './components/footer'
import { SupabaseClient, createBrowserClient, createServerClient } from '@supabase/auth-helpers-remix'
import { Database } from 'database.types'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa, supabase } from '@supabase/auth-ui-shared'
import { groupBy } from './utils/utils'


export const meta: MetaFunction = () => {
  return [
    { title: "SMTN International" },
    {
      property: "og:title",
      content: "Official Web App",
    },
    {
      name: "description",
      content: "Naija Naija",
    },
  ];
};

export let links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
    },
  ]
}

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}


const theme = extendTheme({
  colors: colors,
  styles: {
    global: () => ({
      body: {
        bg: "#4299E1",
        color: "white",
      }
    })
  },
})

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  }

  const response = new Response()

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    request,
    response,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: users } = await supabase.from("users").select()
  
  return json(
    {
      env,
      session,
      users,
    },
    {
      headers: response.headers,
    }
  )
}

export default function App() {
  const { env, session, users } = useLoaderData<typeof loader>()
  const { revalidate } = useRevalidator()
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  )
  const groupedUsers = users ? groupBy(users!, ["id"]) : {}
  //Auto Refresh Access Token
  const serverAccessToken = session?.access_token
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION' && session?.access_token !== serverAccessToken) {
        // server and client are out of sync.
        revalidate()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [serverAccessToken, supabase, revalidate])

  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Flex m={"1vh"} h={"97vh"} wrap={"wrap"}>
          <Navbar supabase={supabase} session={session} users={groupedUsers}/>
          <Box my={"auto"} mx={"auto"}>
            <Outlet context={{supabase, session, users, groupedUsers}} />
          </Box>
          <Footer />
        </Flex>
      </ChakraProvider>
    </Document>
  )
}