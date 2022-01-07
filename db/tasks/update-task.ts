import { db } from 'firebase.config'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { Task } from './task'

export const updateTask = async (
	userId: string,
	listId: string,
	taskId: string,
	data: Partial<Task>
): Promise<void> => {
	try {
		await setDoc(
			doc(db, 'users', userId, 'lists', listId, 'tasks', taskId),
			data,
			{ merge: true }
		)
	} catch (error) {
		throw error
	}
}
