import { db } from 'firebase.config'
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { Task } from './task'

export const deleteTask = async (
	userId: string,
	listId: string,
	taskId: string
): Promise<void> => {
	try {
		await deleteDoc(doc(db, 'users', userId, 'lists', listId, 'tasks', taskId))
	} catch (error) {
		throw error
	}
}
