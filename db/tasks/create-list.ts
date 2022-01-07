import { db } from 'firebase.config'
import { addDoc, collection } from 'firebase/firestore'
import { List, Task } from './task'

export const createList = async (
	userId: string,
	data: Omit<List, 'id'>
): Promise<void> => {
	try {
		await addDoc(collection(db, 'users', userId, 'lists'), data)
	} catch (error) {
		throw error
	}
}
