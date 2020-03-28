import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function NewIncident(){

    const history = useHistory();
    const ong = JSON.parse(localStorage.getItem('ong'));
    
    if (ong == null){
        history.push("/");
    }

    const [title, setTitle] = new useState('');
    const [description, setDescription] = new useState('');
    const [value, setValue] = new useState('');
    
    async function handleSubmit(e){
        e.preventDefault();
        const incident = {title, description, value};
        try {
            await api.post('incidents', incident, {
                headers:{
                    Authorization: ong.id
                }
            });
            history.push('/profile');
        } catch (err) {
            alert('Não foi possível Cadastrar novo caso, tente novamente');
        }
    }

    return (
        <div className="new-incident-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Be de hero"/>
                    <h1>Cadastrar novo caso</h1>
                    <p>Descreva o caso detalhadamente para encontrar um herói para resolver isso.</p>
                    <Link to="/" className="back-link">
                        <FiArrowLeft size={16} color="#e02041"></FiArrowLeft>
                        Voltar
                    </Link>
                </section>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Título do caso"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea placeholder="Descrição" 
                        onChange={e=>setDescription(e.target.value)}
                        value={description}
                        >
                    </textarea>
                    <input placeholder="Valor em reais" 
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        />
                    <button className="button" type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}