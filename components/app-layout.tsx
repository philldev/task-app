import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	HStack,
	Link,
	Text,
	VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
import { InboxIcon, CalendarIcon } from '@heroicons/react/outline'

export const AppLayout: FC<{ title?: string; toolbar?: ReactNode }> = (
	props
) => {
	return (
		<Flex bg='white' w='100vw' minH='100vh' flexDir={'column'}>
			<Flex
				h='16'
				alignItems='center'
				// borderBottom='1px solid'
				// borderBottomColor='gray.200'
				shadow={'sm'}
			>
				<Box maxW='250px' w='100%' px='4'>
					<Text fontSize='xl' fontWeight='bold'>
						TASKAPP
					</Text>
				</Box>
				<Flex
					justifyContent={{ base: 'flex-end' }}
					alignItems='center'
					px='4'
					flex='1'
				>
					<NextLink href='/settings/account' passHref>
						<HStack
							as='a'
							spacing={{ base: 0, sm: 4 }}
							p='2'
							border='1px solid transparent'
							rounded='md'
							cursor={'pointer'}
							_hover={{
								bg: 'gray.100',
							}}
						>
							<Text
								d={{ base: 'none', sm: 'block' }}
								fontSize='sm'
								color='gray.500'
							>
								Deddy Wolley
							</Text>
							<Avatar name='Deddy Wolley' size='sm' />
						</HStack>
					</NextLink>
				</Flex>
			</Flex>
			<Flex flex='1'>
				<Flex as='nav' w='250px' d={{ base: 'none', sm: 'block' }}>
					<VStack p='4' w='100%'>
						<NavButton href='/'>
							<Box mr='2'>
								<InboxIcon color='current' width={24} height={24} />
							</Box>
							Inbox
						</NavButton>
						<NavButton href='/today'>
							<Box mr='2'>
								<CalendarIcon color='current' width={24} height={24} />
							</Box>
							Today
						</NavButton>
						<NavButton href='/scheduled'>
							<Box mr='2'>
								<CalendarIcon color='current' width={24} height={24} />
							</Box>
							Scheduled
						</NavButton>
					</VStack>
					<Box px='4'>
						<Divider />
					</Box>
					<VStack p='4' w='100%'></VStack>
				</Flex>
				<Flex as='main' flex='1' w='100%' flexDir={'column'}>
					<Flex p='4' alignItems='center' justifyContent='space-between'>
						<Text fontSize='xl' fontWeight='bold'>
							{props.title}
						</Text>
						<Box>{props.toolbar}</Box>
					</Flex>
					<Box px='4'>
						<Divider />
					</Box>
					{props.children}
				</Flex>
			</Flex>
		</Flex>
	)
}

const NavButton: FC<{ href: string }> = (props) => {
	const router = useRouter()
	const isActive = router.pathname === props.href
	return (
		<NextLink href={props.href} passHref>
			<Flex
				fontWeight={'semibold'}
				cursor={'pointer'}
				px='2'
				h='10'
				bg={isActive ? 'gray.200' : 'transparent'}
				justifyContent='flex-start'
				size='sm'
				w='100%'
				rounded='md'
				alignItems='center'
				lineHeight='14px'
				fontSize='sm'
			>
				{props.children}
			</Flex>
		</NextLink>
	)
}
