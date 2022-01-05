import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Avatar,
	Box,
	Button,
	chakra,
	Checkbox,
	Divider,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	HStack,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	StackDivider,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { DotsHorizontalIcon, LogoutIcon } from '@heroicons/react/outline'
import { Spinner } from 'components/spinner'
import { useAuth } from 'context/auth.context'
import { AppUser } from 'db/users/users'
import { db } from 'firebase.config'
import { doc } from 'firebase/firestore'
import { useSignOut } from 'hooks/auth/signout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'

const Home = () => {
	const { state } = useAuth()
	const loading = state.status === 'Loading'
	const router = useRouter()

	useEffect(() => {
		if (state.status === 'NotLoggedIn') router.push('/login')
	}, [state.status])

	return (
		<>
			<Head>
				<title>Task App</title>
			</Head>
			{loading ? (
				<Grid placeItems='center' h='100vh'>
					<Spinner w='32px' color='red' h='32px' />
				</Grid>
			) : (
				<Flex flexDir='column' w='100vw' h='100vh' overflow='hidden'>
					<Box
						flexShrink='0'
						h='16'
						borderBottom='1px solid'
						borderColor='gray.100'
					>
						<Flex
							px='4'
							w='full'
							h='full'
							alignItems='center'
							justifyContent='space-between'
						>
							<Text fontWeight='bold'>Task App</Text>
							<UserBox />
						</Flex>
					</Box>
					<Flex
						flexDir={{ base: 'column', md: 'row' }}
						fontSize='sm'
						p='4'
						flex='1'
						gap='4'
						overflowY={{ base: 'hidden', md: 'auto' }}
					>
						<TaskListBox />
						<TasksBox />
					</Flex>
				</Flex>
			)}
		</>
	)
}

const AppBox = chakra((props) => {
	return (
		<Box
			rounded='md'
			border='1px solid'
			borderColor='gray.100'
			shadow='sm'
			{...props}
		></Box>
	)
})

const UserBox = () => {
	const auth = useAuth()
	const signout = useSignOut()

	const onLogout = async () => {
		signout()
	}

	const [value, loading, error] = useDocumentData<AppUser>(
		auth.state.user && doc(db, 'users', auth.state.user?.uid!),
		{
			idField: 'id',
		}
	)

	return (
		<>
			<Flex
				p='2'
				rounded='md'
				border='1px solid'
				borderColor='gray.100'
				display={{ base: 'none', md: 'flex' }}
				alignItems='center'
			>
				<Text mr='2' fontSize='xs'>
					{value?.username}
				</Text>
				<Avatar size='xs' src={value?.photoURL} name={value?.username} />
				<Divider orientation='vertical' h='6' mx='4' />
				<Button
					variant='ghost'
					leftIcon={<LogoutIcon width='14px' height='14px' />}
					size='sm'
					onClick={onLogout}
				>
					Logout
				</Button>
			</Flex>
			<Menu>
				<MenuButton
					p='2'
					rounded='md'
					border='1px solid'
					borderColor='gray.100'
					display={{ base: 'flex', md: 'none' }}
				>
					<Flex alignItems='center'>
						<Text
							mr='2'
							fontSize='xs'
							visibility={{ base: 'hidden', md: 'visible' }}
							display={{ base: 'none', md: 'block' }}
						>
							{value?.username}
						</Text>
						<Avatar size='xs' name={value?.username} src={value?.photoURL} />
					</Flex>
				</MenuButton>
				<MenuList>
					<Text
						py='2'
						px='4'
						visibility={{ md: 'hidden', base: 'visible' }}
						display={{ md: 'none', base: 'block' }}
					>
						{value?.username}
					</Text>
					<Divider />
					<MenuItem
						onClick={onLogout}
						icon={<LogoutIcon width='20px' height='20px' />}
					>
						Logout
					</MenuItem>
				</MenuList>
			</Menu>
		</>
	)
}

const TaskListBox = () => {
	const [isCreating, setIsCreating] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const onNewListClick = () => {
		setIsCreating(true)
	}
	const onCreateList = () => {
		const value = inputRef.current?.value
		setIsCreating(false)
		console.log(value)
	}

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [isCreating])

	return (
		<AppBox
			maxH={{ base: '25vh', md: 'full' }}
			flex='1'
			p='4'
			d='flex'
			flexDir='column'
		>
			<Flex flexShrink='0' justifyContent='space-between'>
				<Text fontWeight='bold'>Task List</Text>
				<Button
					disabled={isCreating}
					onClick={onNewListClick}
					colorScheme='blue'
					size='xs'
					justifyContent='flex-start'
				>
					+ List
				</Button>
			</Flex>
			<Divider mt='2' mb='4' />
			<VStack flex='1' overflowY='auto' alignItems='stretch'>
				{isCreating && (
					<form
						onSubmit={(e) => {
							e.preventDefault()
							onCreateList()
						}}
					>
						<Input
							onBlur={() => {
								setIsCreating(false)
							}}
							px='2'
							placeholder='new task list'
							bg='transparent'
							border='none'
							_hover={{
								border: 'none',
							}}
							_focus={{
								border: 'none',
							}}
							ref={inputRef}
						/>
					</form>
				)}
				<TaskListItem active>Lorem, ipsum.</TaskListItem>
				<TaskListItem>Lorem, ipsum.</TaskListItem>
				<TaskListItem>Lorem, ipsum.</TaskListItem>
				<TaskListItem>Lorem, ipsum.</TaskListItem>
				<TaskListItem>Lorem, ipsum.</TaskListItem>
			</VStack>
		</AppBox>
	)
}

const TasksBox = () => {
	const [isCreating, setIsCreating] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const onNewTaskClick = () => {
		setIsCreating(true)
	}
	const onCreateTask = () => {
		const value = inputRef.current?.value
		setIsCreating(false)
		console.log(value)
	}

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [isCreating])

	const deleteAlert = useDisclosure()
	const editDrawer = useDisclosure()
	const cancelRef = useRef<HTMLButtonElement | null>(null)

	return (
		<>
			<Drawer
				placement={'bottom'}
				onClose={editDrawer.onClose}
				isOpen={editDrawer.isOpen}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth='1px'>Edit Task</DrawerHeader>
					<DrawerBody pb='8'>
						<form
							onSubmit={(e) => {
								e.preventDefault()
							}}
						>
							<Grid gap='4'>
								<FormControl>
									<FormLabel htmlFor='name'>Task Label</FormLabel>
									<Input
										id='email'
										type='email'
										defaultValue={'Lorem ipsum dolor'}
									/>
									<FormErrorMessage></FormErrorMessage>
								</FormControl>
								<HStack spacing='4' justifyContent='flex-end'>
									<Button size='sm'>Edit</Button>
									<Button size='sm' onClick={editDrawer.onClose}>
										Cancel
									</Button>
								</HStack>
							</Grid>
						</form>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			<AlertDialog
				size='xs'
				isCentered
				isOpen={deleteAlert.isOpen}
				leastDestructiveRef={cancelRef}
				onClose={deleteAlert.onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Delete List?
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure? You can{`'`}t undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={deleteAlert.onClose}>
								Cancel
							</Button>
							<Button colorScheme='red' onClick={deleteAlert.onClose} ml={3}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
			<AppBox
				d='flex'
				flexDir='column'
				p='4'
				flex={{ base: '1', md: '2' }}
				h={{ base: 'calc(100% - 25vh - 16px)', md: 'full' }}
			>
				<Flex flexShrink='0' justifyContent='space-between'>
					<Text fontWeight='bold'>Lorem, ipsum.</Text>
					<HStack spacing='2'>
						<Button
							disabled={isCreating}
							onClick={onNewTaskClick}
							colorScheme='blue'
							size='xs'
							justifyContent='flex-start'
						>
							+ Task
						</Button>
						<Button
							d={{ base: 'none', md: 'flex' }}
							variant='outline'
							size='xs'
							justifyContent='flex-start'
							onClick={deleteAlert.onOpen}
						>
							Delete
						</Button>
						<Button
							onClick={editDrawer.onOpen}
							d={{ base: 'none', md: 'flex' }}
							variant='outline'
							size='xs'
							justifyContent='flex-start'
						>
							Edit Label
						</Button>
						<Menu>
							<MenuButton
								as={IconButton}
								aria-label='Options'
								icon={<DotsHorizontalIcon width={14} height={14} />}
								variant='outline'
								size='xs'
							/>
							<MenuList>
								<MenuItem onClick={deleteAlert.onOpen} icon={<DeleteIcon />}>
									Delete List
								</MenuItem>
								<MenuItem onClick={editDrawer.onOpen} icon={<EditIcon />}>
									Edit Label
								</MenuItem>
							</MenuList>
						</Menu>
					</HStack>
				</Flex>
				<Divider mt='2' mb='4' />
				<VStack
					flex='1'
					divider={<StackDivider borderColor='gray.50' />}
					spacing='0'
					alignItems='stretch'
					overflowY='auto'
					overflowX='hidden'
				>
					{isCreating && (
						<Flex
							as='form'
							onSubmit={(e) => {
								e.preventDefault()
								onCreateTask()
							}}
							rounded='md'
							pos='relative'
							alignItems='center'
						>
							<Checkbox
								colorScheme='blackAlpha'
								mr='4'
								pos='absolute'
								left='2'
								zIndex={10}
							/>
							<Input
								onBlur={() => {
									setIsCreating(false)
								}}
								ref={inputRef}
								bg='transparent'
								border='transparent'
								fontSize='xs'
								pl='8'
								_focus={{ borderColor: 'gray.300' }}
							/>
						</Flex>
					)}
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
					<TaskItem label='Todo for today' />
				</VStack>
			</AppBox>
		</>
	)
}

const TaskItem = (props: { label: string; completed?: boolean }) => {
	const editDrawer = useDisclosure()
	const deleteAlert = useDisclosure()
	const cancelRef = useRef<HTMLButtonElement | null>(null)

	return (
		<>
			<Drawer
				placement={'bottom'}
				onClose={editDrawer.onClose}
				isOpen={editDrawer.isOpen}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth='1px'>Edit Task</DrawerHeader>
					<DrawerBody pb='8'>
						<form
							onSubmit={(e) => {
								e.preventDefault()
							}}
						>
							<Grid gap='4'>
								<FormControl>
									<FormLabel htmlFor='name'>Task Label</FormLabel>
									<Input id='email' type='email' defaultValue={props.label} />
									<FormErrorMessage></FormErrorMessage>
								</FormControl>
								<HStack spacing='4' justifyContent='flex-end'>
									<Button size='sm'>Edit</Button>
									<Button size='sm' onClick={editDrawer.onClose}>
										Cancel
									</Button>
								</HStack>
							</Grid>
						</form>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			<AlertDialog
				size='xs'
				isCentered
				isOpen={deleteAlert.isOpen}
				leastDestructiveRef={cancelRef}
				onClose={deleteAlert.onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Delete Task?
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure? You can{`'`}t undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={deleteAlert.onClose}>
								Cancel
							</Button>
							<Button colorScheme='red' onClick={deleteAlert.onClose} ml={3}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
			<Flex
				rounded='md'
				pos='relative'
				alignItems='center'
				role='group'
				_hover={{ bg: 'gray.50' }}
			>
				<Checkbox
					colorScheme='blackAlpha'
					mr='4'
					pos='absolute'
					left='2'
					zIndex={10}
				/>
				<Text fontSize='xs' pl='8' py='2'>
					{props.label}
				</Text>
				<HStack
					spacing='2'
					pos='absolute'
					right='0'
					visibility='hidden'
					opacity={0}
					transition='ease-in-out .2s all'
					_groupHover={{ opacity: 1, visibility: 'visible' }}
				>
					<IconButton
						variant='ghost'
						size='xs'
						aria-label='delete'
						icon={<DeleteIcon />}
						onClick={deleteAlert.onOpen}
					/>
					<IconButton
						onClick={editDrawer.onOpen}
						size='xs'
						variant='ghost'
						aria-label='delete'
						icon={<EditIcon />}
					/>
				</HStack>
			</Flex>
		</>
	)
}

const TaskListItem: FC<{ active?: boolean }> = (props) => {
	return (
		<Box
			cursor='pointer'
			rounded='md'
			p='2'
			bg={props.active ? 'black' : 'gray.50'}
			color={props.active ? 'white' : undefined}
			_hover={{ bg: props.active ? undefined : 'gray.100' }}
		>
			{props.children}
		</Box>
	)
}

export default Home
