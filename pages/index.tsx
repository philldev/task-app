import {
	Avatar,
	Box,
	Button,
	chakra,
	Checkbox,
	Divider,
	Flex,
	HStack,
	Input,
	StackDivider,
	Text,
	VStack,
} from '@chakra-ui/react'
import { FC, useEffect, useRef, useState } from 'react'

const Home = () => {
	return (
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
					<Avatar size='sm' name='Deddy Wolley' />
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
	return (
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
					<Button variant='outline' size='xs' justifyContent='flex-start'>
						Delete
					</Button>
					<Button variant='outline' size='xs' justifyContent='flex-start'>
						Edit Label
					</Button>
				</HStack>
			</Flex>
			<Divider mt='2' mb='4' />
			<VStack
				flex='1'
				divider={<StackDivider borderColor='gray.50' />}
				spacing='0'
				alignItems='stretch'
				overflowY='auto'
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
	)
}

const TaskItem = (props: { label: string; completed?: boolean }) => {
	return (
		<Flex rounded='md' pos='relative' alignItems='center'>
			<Checkbox
				colorScheme='blackAlpha'
				mr='4'
				pos='absolute'
				left='2'
				zIndex={10}
			/>
			<Input
				defaultValue={props.label}
				bg='transparent'
				border='transparent'
				fontSize='xs'
				pl='8'
				_focus={{ borderColor: 'gray.300' }}
			/>
		</Flex>
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
