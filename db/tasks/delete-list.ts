import { db } from 'firebase.config'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { List } from './task'

export const deleteList = async (
	userId: string,
	listId: string
): Promise<void> => {
	try {
		await deleteDoc(doc(db, 'users', userId, 'lists', listId))
	} catch (error) {
		throw error
	}
}
