import { db } from 'firebase.config'
import { addDoc, collection } from 'firebase/firestore'
import { Task } from './task'

export const createTask = async (
	userId: string,
	listId: string,
	data: Omit<Task, 'id' | 'completed'>
): Promise<void> => {
	try {
		await addDoc(
			collection(db, 'users', userId, 'lists', listId, 'tasks'),
			data
		)
	} catch (error) {
		throw error
	}
}
