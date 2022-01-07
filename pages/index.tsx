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
	useColorMode,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import {
	DotsHorizontalIcon,
	LogoutIcon,
	MoonIcon,
	SunIcon,
} from '@heroicons/react/outline'
import { Spinner } from 'components/spinner'
import { useAuth } from 'context/auth.context'
import { createList } from 'db/tasks/create-list'
import { createTask } from 'db/tasks/create-task'
import { deleteList } from 'db/tasks/delete-list'
import { deleteTask } from 'db/tasks/delete-task'
import { List, Task } from 'db/tasks/task'
import { updateList } from 'db/tasks/update-list'
import { updateTask } from 'db/tasks/update-task'
import { AppUser } from 'db/users/users'
import { db } from 'firebase.config'
import { collection, doc, limit, query } from 'firebase/firestore'
import { useSignOut } from 'hooks/auth/signout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
	createContext,
	FC,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import {
	useCollectionData,
	useDocumentData,
} from 'react-firebase-hooks/firestore'
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types'
import { useForm } from 'react-hook-form'

const Home = () => {
	const { state } = useAuth()
	const loading = state.status === 'Loading'
	const router = useRouter()
	const { colorMode, toggleColorMode } = useColorMode()
	useEffect(() => {
		if (state.status === 'NotLoggedIn') router.push('/login')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.status])

	return (
		<>
			<Head>
				<title>Task App</title>
			</Head>
			{loading && (
				<Grid placeItems='center' h='100vh'>
					<Spinner w='32px' color='red' h='32px' />
				</Grid>
			)}
			{state.status === 'LoggedIn' && (
				<Flex flexDir='column' w='100vw' h='100vh' overflow='hidden'>
					<Box
						flexShrink='0'
						h='16'
						borderBottom='1px solid'
						borderColor={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
					>
						<Flex
							px='4'
							w='full'
							h='full'
							alignItems='center'
							justifyContent='space-between'
						>
							<Text fontWeight='bold'>Task App</Text>
							<HStack spacing='4'>
								<ColorModeToggler />
								<UserBox />
							</HStack>
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
						<TaskTabProvider>
							<TaskListBox />
							<TasksBox />
						</TaskTabProvider>
					</Flex>
				</Flex>
			)}
		</>
	)
}

const ColorModeToggler = () => {
	const { colorMode, toggleColorMode } = useColorMode()
	return (
		<IconButton
			icon={
				colorMode === 'dark' ? (
					<MoonIcon width='20px' height='20px' />
				) : (
					<SunIcon width='20px' height='20px' />
				)
			}
			onClick={toggleColorMode}
			aria-label='toggle color mode'
		/>
	)
}

interface TaskTab {
	lists: Data<List, '', ''>[] | undefined
	selectedList: Data<List, '', ''> | undefined
	selectList: (list: List | null) => void
}

const TaskTabCtx = createContext<TaskTab | null>(null)

const TaskTabProvider: FC = (props) => {
	const auth = useAuth()
	const [lists, loadingLists, errorLists] = useCollectionData<List>(
		query(collection(db, 'users', auth.state.user?.uid!, 'lists'), limit(99)),
		{
			idField: 'id',
		}
	)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const selectedList = lists?.find((list) => selectedId === list.id)
	const selectList: TaskTab['selectList'] = (list) =>
		setSelectedId(list ? list.id : null)
	return (
		<TaskTabCtx.Provider value={{ selectedList, selectList, lists }}>
			{props.children}
		</TaskTabCtx.Provider>
	)
}

const useTaskTab = () => {
	const ctx = useContext(TaskTabCtx)
	if (!ctx) throw new Error('no ctx provided')
	return ctx
}

const AppBox = chakra((props) => {
	const { colorMode, toggleColorMode } = useColorMode()
	return (
		<Box
			rounded='md'
			border='1px solid'
			borderColor={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
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
	const { colorMode, toggleColorMode } = useColorMode()

	return (
		<>
			<Flex
				p='2'
				rounded='md'
				border='1px solid'
				borderColor={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
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
					borderColor={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
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
	const auth = useAuth()
	const onCreateList = async () => {
		const value = inputRef.current?.value
		if (value && value.length > 0) {
			createList(auth.state.user?.uid!, { title: value })
			setIsCreating(false)
		}
	}

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [isCreating])

	const { selectList, lists, selectedList } = useTaskTab()

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
				{lists?.map((list) => (
					<TaskListItem
						active={selectedList?.id === list.id}
						onClick={() => selectList(list)}
						key={list.id}
					>
						{list.title}
					</TaskListItem>
				))}
			</VStack>
		</AppBox>
	)
}

const EditListForm = (props: { list: List; onClose: () => void }) => {
	type Schema = {
		title: string
	}

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<Schema>({
		defaultValues: { title: props.list.title },
	})

	const [state, setState] = useState<
		| {
				status: 'loading'
				error: null
		  }
		| {
				status: 'error'
				error: string
		  }
		| { status: 'idle'; error: null }
		| { status: 'success'; error: null }
	>({ status: 'idle', error: null })

	const auth = useAuth()

	const onSubmit = async (data: Schema) => {
		try {
			setState({ status: 'loading', error: null })
			await updateList(auth.state.user?.uid!, props.list.id, data)
			props.onClose()
		} catch (error) {
			setState({ status: 'error', error: 'something went wrong' })
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid gap='4'>
				<FormControl>
					<FormLabel htmlFor='name'>Task Label</FormLabel>
					<Input
						{...register('title', {
							required: { message: 'Title is required', value: true },
						})}
					/>
					<FormErrorMessage>{errors.title?.message}</FormErrorMessage>
				</FormControl>
				<HStack spacing='4' justifyContent='flex-end'>
					<Button size='sm'>Edit</Button>
					<Button size='sm' type='button' onClick={props.onClose}>
						Cancel
					</Button>
				</HStack>
			</Grid>
		</form>
	)
}

const TasksBox = () => {
	const { colorMode, toggleColorMode } = useColorMode()
	const [isCreating, setIsCreating] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const onNewTaskClick = () => {
		setIsCreating(true)
	}
	const auth = useAuth()
	const { selectedList, selectList } = useTaskTab()
	const onCreateTask = () => {
		const value = inputRef.current?.value
		if (value && value.length > 0) {
			createTask(auth.state.user?.uid!, selectedList?.id!, { text: value })
			setIsCreating(false)
		}
	}

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [isCreating])

	const deleteAlert = useDisclosure()
	const editDrawer = useDisclosure()
	const cancelRef = useRef<HTMLButtonElement | null>(null)

	const onDeleteList = async () => {
		try {
			await deleteList(auth.state.user?.uid!, selectedList?.id!)
			selectList(null)
			deleteAlert.onClose()
		} catch (error) {}
	}

	if (!selectedList)
		return (
			<AppBox
				d='flex'
				flexDir='column'
				p='4'
				flex={{ base: '1', md: '2' }}
				h={{ base: 'calc(100% - 25vh - 16px)', md: 'full' }}
			>
				<Text>Please select a list!</Text>
			</AppBox>
		)

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
						<EditListForm onClose={editDrawer.onClose} list={selectedList} />
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
							<Button colorScheme='red' onClick={onDeleteList} ml={3}>
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
					<Text fontWeight='bold'>{selectedList.title}</Text>
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
					divider={
						<StackDivider
							borderColor={colorMode === 'dark' ? 'gray.900' : 'gray.100'}
						/>
					}
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
								py={0}
								h='34px'
								_focus={{
									borderColor: colorMode === 'dark' ? 'gray.900' : 'gray.100',
								}}
							/>
						</Flex>
					)}
					<TaskItems list={selectedList} />
				</VStack>
			</AppBox>
		</>
	)
}

const TaskItems = (props: { list: List }) => {
	const auth = useAuth()
	const [tasks, loadingTasks, errorTasks] = useCollectionData<Task>(
		query(
			collection(
				db,
				'users',
				auth.state.user?.uid!,
				'lists',
				props.list.id,
				'tasks'
			),
			limit(99)
		),
		{
			idField: 'id',
		}
	)
	return (
		<>
			{tasks?.map((task) => (
				<TaskItem task={task} key={task.id} />
			))}
		</>
	)
}

const EditTaskForm = (props: { task: Task; onClose: () => void }) => {
	type Schema = {
		text: string
	}

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<Schema>({
		defaultValues: { text: props.task.text },
	})

	const [state, setState] = useState<
		| {
				status: 'loading'
				error: null
		  }
		| {
				status: 'error'
				error: string
		  }
		| { status: 'idle'; error: null }
		| { status: 'success'; error: null }
	>({ status: 'idle', error: null })

	const auth = useAuth()

	const { selectedList } = useTaskTab()

	const onSubmit = async (data: Schema) => {
		try {
			setState({ status: 'loading', error: null })
			await updateTask(
				auth.state.user?.uid!,
				selectedList!.id,
				props.task.id,
				data
			)
			props.onClose()
		} catch (error) {
			setState({ status: 'error', error: 'something went wrong' })
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid gap='4'>
				<FormControl>
					<FormLabel htmlFor='name'>Task Label</FormLabel>
					<Input
						{...register('text', {
							required: { message: 'Label is required', value: true },
						})}
					/>
					<FormErrorMessage>{errors.text?.message}</FormErrorMessage>
				</FormControl>
				<HStack spacing='4' justifyContent='flex-end'>
					<Button type='submit' size='sm'>
						Edit
					</Button>
					<Button size='sm' type='button' onClick={props.onClose}>
						Cancel
					</Button>
				</HStack>
			</Grid>
		</form>
	)
}

const TaskItem = (props: { task: Task }) => {
	const auth = useAuth()
	const { selectedList } = useTaskTab()
	const editDrawer = useDisclosure()
	const { colorMode, toggleColorMode } = useColorMode()
	const deleteAlert = useDisclosure()
	const cancelRef = useRef<HTMLButtonElement | null>(null)
	const onDelete = async () => {
		await deleteTask(auth.state.user?.uid!, selectedList!.id, props.task.id)
	}
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
						<EditTaskForm task={props.task} onClose={editDrawer.onClose} />
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
							<Button colorScheme='red' onClick={onDelete} ml={3}>
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
				_hover={{ bg: colorMode === 'dark' ? 'gray.800' : 'gray.50' }}
			>
				<Checkbox
					colorScheme='blackAlpha'
					mr='4'
					pos='absolute'
					left='2'
					zIndex={10}
					defaultChecked={props.task.completed}
					onChange={(e) => {
						updateTask(auth.state.user?.uid!, selectedList!.id, props.task.id, {
							completed: !props.task.completed,
						})
					}}
				/>
				<Text
					fontSize='xs'
					pl='8'
					py='2'
					textDecoration={props.task.completed ? 'line-through' : undefined}
					color={props.task.completed ? 'gray.500' : undefined}
				>
					{props.task.text}
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

const TaskListItem: FC<{ active?: boolean; onClick?: () => void }> = (
	props
) => {
	const { colorMode, toggleColorMode } = useColorMode()
	return (
		<Box
			onClick={props.onClick}
			cursor='pointer'
			rounded='md'
			p='2'
			bg={
				props.active
					? colorMode === 'dark'
						? 'gray.800'
						: 'black'
					: colorMode === 'dark'
					? 'black'
					: 'gray.50'
			}
			color={props.active ? 'white' : undefined}
		>
			{props.children}
		</Box>
	)
}

export default Home
