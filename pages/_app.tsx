import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from 'context/auth.context'
import type { AppProps } from 'next/app'
import 'styles/index.css'

const theme = extendTheme({
	shadows: { outline: 'none' },
})

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<AuthProvider>
				<Component {...pageProps} />
			</AuthProvider>
		</ChakraProvider>
	)
}

export default MyApp
