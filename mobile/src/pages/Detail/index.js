import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, View, TouchableOpacity, Image, Text, Linking } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

import logoImg from '../../../assets/logo.png';

import styles from './styles';

export default function Detail(){
    
    const navigation = useNavigation();
    const route = useRoute();

    const incident = route.params.incident;
    const fValue =  Intl.NumberFormat('pt-BR', 
                                {style: 'currency', currency: 'BRL'})
                                .format(incident.value);
    const message = `Olá APAD, estou entrando em contato pois gostaria de ajudar no caso `
        +`"${incident.title}" com o valor de ${fValue}`;

    function navigateBack(){
        navigation.goBack();
    }
    
    function sendWhatsMsg(){
        Linking.openURL(`whatsapp://send?phone=${incident.ong.phone}&text${message}`);
    }

    function sendEmail(){
        MailComposer.composeAsync({
            subject: 'Herói do caso: Caso teste',
            recipients: [incident.ong.email],
            body: message
        });
    }

    return (
        <SafeAreaView style={styles.droidSafeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={logoImg} />
                    <TouchableOpacity style={styles.actions} onPress={navigateBack}>
                        <Feather name="arrow-left" style={styles.arrowLeft} />
                    </TouchableOpacity>
                </View>
                <View style={styles.incident}>
                    <Text style={[styles.incidentProperty, {marginTop: 0}]}>ONG:</Text>
                    <Text style={styles.incidentValue}>{incident.ong.name}</Text>

                    <Text style={styles.incidentProperty}>CASO:</Text>
                    <Text style={styles.incidentValue}>{incident.title}</Text>

                    <Text style={styles.incidentProperty}>VALOR:</Text>
                    <Text style={styles.incidentValue}>{fValue}</Text>
                </View>
                <View style={styles.contactBox}>
                    <Text style={styles.heroTitle}>Salve o dia!</Text>
                    <Text style={styles.heroTitle}>Seja o herói desse caso.</Text>
                    <Text style={styles.heroDescription}>Entre em contato:</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.action} onPress={sendWhatsMsg}>
                            <Text style={styles.actionText}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.action} onPress={sendEmail}>
                            <Text style={styles.actionText}>E-mail</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};