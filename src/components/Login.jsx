import React from 'react'
import {auth, db} from '../firebase'
import {withRouter} from 'react-router-dom'

const Login = (props) => {

    const [email, setEmail] = React.useState('')
    const [pass, setPass] = React.useState('')
    const [error, setError] = React.useState(null)
    const [esRegistro, setEsRegistro] = React.useState(false)

    const procesarDatos = e => {
        e.preventDefault()
        if (!email.trim()){
            setError('Ingrese email')
            return
        }if (!pass.trim()){
            setError('Ingrese password')
            return
        }if (pass.length < 6){
            setError('Password menor a 6 caracteres');
            return
        }
        setError(null)

        if(esRegistro){
            registrar()
        }else{
            login()
        }
    }

    const login = React.useCallback(async () => {
        try{
           await auth.signInWithEmailAndPassword(email, pass)
           setEmail('')
           setPass('')
           setError(null)
           props.history.push('/admin')
        }catch(error){
            console.log(error);
            if(error.code === 'auth/invalid-email'){
                setError('Email no valido')
            }
            if (error.code === 'auth/user-not-found'){
                setError('Email no valido')
            }
            if (error.code === 'auth/wrong-password'){
                setError('Contraseña incorrecta')
            }
        }
    }, [email, pass, props.history])


    const registrar = React.useCallback(async()=>{

        try {
           const res = await auth.createUserWithEmailAndPassword(email, pass)
           await db.collection('usuarios').doc(res.user.email).set({
               email: res.user.email,
               uid: res.user.uid
           })
           await db.collection(res.user.uid).add({
               name: 'Tarea de ejemplo',
               fecha: Date.now()
           })
           setEmail('')
           setPass('')
           setError(null)
           props.history.push('/admin')
            
        }catch(error){
            console.log(error);
            if(error.code === 'auth/invalid-email'){
                setError('Email no valido')
            }
            if(error.code === 'auth/email-already-in-use'){
                setError('El email ya se encuentra en uso')
            }
        }

    }, [email, pass, props.history])

    const switching = () =>{
        setEsRegistro(!esRegistro)
       if (esRegistro) {
           setError(null) 
       }
    }

    return (
        <div className="mt-5">
        <h3 className="text-center">
            {
                esRegistro ? 'Registro de usuarios' : 'Login de acceso'
            }
        </h3>
            <hr/>
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    <form onSubmit={procesarDatos}>
                        {
                            error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )
                        }
                        <input 
                        type="email" 
                        className="form-control mb-2"
                        placeholder="Ingrese un email"
                        onChange= {e => setEmail(e.target.value)} 
                        value={email}
                        />
                        <input 
                        type="password" 
                        className="form-control mb-2"
                        placeholder="Ingrese un password"
                        onChange= {e => setPass(e.target.value)}
                        value={pass}
                        />
                        <button 
                        className="btn btn-dark btn-lg btn-block"
                        type="submit"
                        >
                            {
                                esRegistro ? 'Registrarse' : 'Acceder'
                            }
                        </button>
                        <button 
                        className="btn btn-info btn-sm btn-block"
                        onClick= {() => switching()}
                        type="button"
                        >
                        {
                            esRegistro ? '¿Ya estas registrado?' : '¿No tienes cuenta?'
                        } 
                        </button>
                        {
                            !esRegistro ? (
                                <button 
                                    className="btn btn-lg btn-sm btn-danger mt-2"
                                    type="button"
                                    onClick={() => props.history.push('/reset')}
                                >
                                    Recuperar Contraseña
                                </button>
                            ) : null
                        }
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)
