import { auth } from 'firebase.config'
import { onAuthStateChanged, User } from 'firebase/auth'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

type States =
	| {
			user: User
			status: 'LoggedIn'
	  }
	| {
			user: null
			status: 'NotLoggedIn'
	  }
	| {
			user: null
			status: 'Loading'
	  }
	| {
			user: null
			status: 'Error'
	  }

interface AuthContextValue {
	state: States
}

const AuthCtx = createContext<AuthContextValue | null>(null)

const AuthProvider = (props: { children: ReactNode }) => {
	const [state, setState] = useState<States>({ status: 'Loading', user: null })

	useEffect(() => {
		let unsub = onAuthStateChanged(
			auth,
			(user) => {
				if (user) {
					setState({ status: 'LoggedIn', user })
				} else {
					setState({ status: 'NotLoggedIn', user: null })
				}
			},
			(err) => {
				console.log(err)
				setState({ status: 'Error', user: null })
			}
		)

		return () => {
			unsub()
		}
	}, [])

	return <AuthCtx.Provider value={{ state }}>{props.children}</AuthCtx.Provider>
}

const useAuth = () => {
	const ctx = useContext(AuthCtx)
	if (!ctx) throw new Error('Context Not Provided: Auth')
	return ctx
}

export { useAuth, AuthProvider }
