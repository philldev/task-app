import { DocumentData } from 'firebase/firestore'

export interface AppUser extends DocumentData {
	username: string
	email: string
	photoURL: string
}
