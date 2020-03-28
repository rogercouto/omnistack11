import React, {useEffect, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi'
import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function Profile(){

    const history = useHistory();
    const ong = JSON.parse(localStorage.getItem('ong'));

    if (ong == null){
        history.push("/");
    }

    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [incidents, setIncidents] = useState([]);

    async function loadIncidents(){
        if (!loading && (total === 0 || incidents.length < total)){
            setLoading(true);
            const bearerToken = 'Bearer '+ong.token;
            console.log(bearerToken);
            const response = await api
                .get('profile',{
                    headers:{Authorization: bearerToken},
                    params:{ page }
                });
            if (total === 0){
                setTotal(response.headers['x-total-count']);
            }
            setIncidents([... incidents,...response.data ]);
            setPage(page+1);
            setLoading(false);
        }
    }

    useEffect(()=>{
        loadIncidents();
    },[]);

    async function handleDeleteIncident(id){
        try {
            const bearerToken = 'Bearer '+ong.token;
            await api.delete(`incidents/${id}`, {
                headers:{
                    Authorization: bearerToken,
                }
            });
            setIncidents(incidents.filter(incident => incident.id !== id)); 
            setTotal(total-1);
        } catch (err) {
            alert('Erro ao deletar caso, tente novamente.');
        }
    }

    function handleLogout(){
        localStorage.clear();
        history.push("/");
    }

    function handleIncPage(e){
        e.preventDefault();
        loadIncidents();
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt=""/>
                <span>bem vinda, {ong != null ? ong.name : ''}</span>
                <Link className="button" to="/incidents/new">Novo caso</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#e02041"></FiPower>
                </button>
            </header>
            <h1>Casos cadastrados</h1>
            <ul>
                {incidents.map(incident=>(
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}</p>
                        <button onClick={()=> handleDeleteIncident(incident.id)} type="button">
                            <FiTrash2 size="20" color="#a8a8b3"></FiTrash2>
                        </button>
                    </li>
                ))}                
            </ul>
            {
                (total > 0 && incidents.length < total) &&
                    <div className="load-more"><a onClick={handleIncPage}>Carregar mais</a></div>
            }
            {
                (total == 0) &&
                <div className="no-more"><span>Nenhum caso</span></div>
            }
        </div>
    );
}