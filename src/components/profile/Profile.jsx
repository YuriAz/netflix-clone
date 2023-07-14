import { useSelector } from 'react-redux'
import NavBar from '../nav/NavBar'
import { selectUser } from '../../userSlice'
import { auth } from '../../firebase'
import './Profile.css'
import Plans from '../plans/Plans'

export default function Profile() {
  const user = useSelector(selectUser)
  return (
    <div className="profile">
      <NavBar />
      <div className="profile__body">
        <h1>Edit Profile</h1>

        <div className="profile__info">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            alt=""
          />

          <div className="profile__details">
            <h2>{user.email}</h2>

            <div className="profile__plans">
              <h3>Plans</h3>

              <Plans />

              <button
                onClick={() => auth.signOut()}
                className="profile__signOut"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
