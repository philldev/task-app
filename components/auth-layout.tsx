import { Box, Link, Grid, Heading, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { FC, ReactNode } from 'react'

export const AuthLayout: FC<{ title?: string }> = (props) => {
	return (
		<Box
			w='100vw'
			minH='100vh'
			d='flex'
			alignItems='center'
			justifyContent='center'
		>
			<Grid gap='4' maxW='320px' w='full'>
				<Heading fontWeight='bold' fontSize='2xl' textAlign='center'>
					{props.title}
				</Heading>
				{props.children}
			</Grid>
		</Box>
	)
}
