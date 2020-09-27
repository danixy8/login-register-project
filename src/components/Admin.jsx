import React from 'react'
import {auth} from '../firebase'
import {withRouter} from 'react-router-dom'
import Firestore from './Firestore'

const Admin = (props) => {

    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        if (auth.currentUser){
            setUser(auth.currentUser)
        }else{
            props.history.push('/login')
        }
    }, [props.history])

    return (
        <div>
            <h3 className="text-center">Ruta protegida</h3>
            {
                user && (
                    <Firestore user={user}/>
                )
            }
        </div>
    )
}

export default withRouter(Admin)
