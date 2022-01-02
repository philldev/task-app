import {
	Avatar,
	Box,
	Divider,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	HStack,
	IconButton,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import {
	CalendarIcon,
	InboxIcon,
	MenuIcon,
	UserIcon,
} from '@heroicons/react/outline'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { FC, ReactElement, ReactNode } from 'react'

export const AppLayout: FC<{ title?: string; toolbar?: ReactNode }> = (
	props
) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	return (
		<Flex w='100vw' h='100vh' overflow='hidden'>
			<Drawer placement='left' onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<Sidebar />
				</DrawerContent>
			</Drawer>
			<SidebarWrapper>
				<Sidebar />
			</SidebarWrapper>
			<Main>
				<Flex p='4' justifyContent='space-between' alignItems='center'>
					<Text fontSize='2xl'>{props.title}</Text>
					<IconButton
						display={{ base: 'flex', md: 'none' }}
						onClick={onOpen}
						icon={<MenuIcon width='24px' height='24px' />}
						aria-label='menu button'
					/>
					{props.toolbar}
				</Flex>
				{props.children}
			</Main>
		</Flex>
	)
}

const Sidebar = () => {
	return (
		<Box p='4' minH='100%' w='100%'>
			<Box>
				<Text fontSize='2xl' fontWeight='bold'>
					Task App
				</Text>
			</Box>
			<Divider my='4' />
			<NavButton icon={<InboxIcon width='24px' height='24px' />} href='/'>
				Home
			</NavButton>
			<NavButton
				icon={<UserIcon width='24px' height='24px' />}
				href='/settings/account'
			>
				Account
			</NavButton>
		</Box>
	)
}

const SidebarWrapper: FC = (props) => {
	return (
		<Flex
			display={{ base: 'none', md: 'flex' }}
			borderRight='1px solid'
			borderColor='gray.200'
			w='250px'
			h='100vh'
		>
			{props.children}
		</Flex>
	)
}

const Main: FC = (props) => {
	return (
		<Flex flex='1' overflowY='hidden' h='100vh' flexDir='column'>
			{props.children}
		</Flex>
	)
}

const NavButton: FC<{ href: string; icon: ReactElement }> = (props) => {
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
				{props.icon && <Box mr='2'>{props.icon}</Box>}
				{props.children}
			</Flex>
		</NextLink>
	)
}
