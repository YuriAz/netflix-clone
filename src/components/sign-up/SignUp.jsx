import { useRef } from 'react'
import { auth } from '../../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import './SignUp.css'

export default function SignUp() {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const register = e => {
    e.preventDefault()

    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then()
      .catch(error => console.log(error))
  }

  const signIn = e => {
    e.preventDefault()

    signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then()
      .catch(error => console.log(error))
  }

  return (
    <div className="signup">
      <form>
        <h1>Sign In</h1>
        <input ref={emailRef} type="email" placeholder="Email" />
        <input ref={passwordRef} type="password" placeholder="Password" />
        <button type="submit" onClick={signIn}>
          Sign In
        </button>

        <h4>
          <span className="signup__gray">New to Netflix?</span>
          <span className="signup__link" onClick={register}>
            Sign Up now.
          </span>
        </h4>
      </form>
    </div>
  )
}
