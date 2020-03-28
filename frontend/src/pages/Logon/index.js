import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';
import heroesImg from '../../assets/heroes.png';

export default function Logon(){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const ong = JSON.parse(localStorage.getItem('ong'));

    if (ong != null){
        history.push("/profile");
    }

    async function handleLogin(e){
        e.preventDefault();
        try {
            const response = await api.post('session', {email, password});
            const ongstr = JSON.stringify(response.data)
            localStorage.setItem('ong', ongstr);
            history.push('/profile');
        } catch (err) {
            if (email === '' || password === ''){
                alert("Preencha os dados de login!")
            }else if (err.response.status === 404){   
                alert("Nenhuma ong cadastrada com esse e-mail!")
            }else if (err.response.status === 400){
                alert("Senha incorreta!")
            }
        }
    }

    return (
        <div className="logon-container">
            <section className="form">
                <img src={logoImg} alt="Be the hero"/>
                <form onSubmit={handleLogin}>
                    <h1>Faça seu logon</h1>
                    <input type="text" placeholder="Seu email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        />
                    <input type="password" placeholder="Sua senha" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        />
                    <button type="submit" className="button">Entrar</button>
                    <Link to="/register" className="back-link">
                        <FiLogIn size={16} color="#e02041"></FiLogIn>
                        Criar cadastro
                    </Link>
                </form>
            </section>
            <img src={heroesImg} alt="Heroes"/>
        </div>
    );
}