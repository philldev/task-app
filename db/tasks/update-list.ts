import { db } from 'firebase.config'
import { doc, setDoc } from 'firebase/firestore'
import { List } from './task'

export const updateList = async (
	userId: string,
	listId: string,
	data: Omit<List, 'id'>
): Promise<void> => {
	try {
		await setDoc(doc(db, 'users', userId, 'lists', listId), data, {
			merge: true,
		})
	} catch (error) {
		throw error
	}
}
