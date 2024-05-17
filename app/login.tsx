import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert} from 'react-native'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
enum SignInType {
    Phone,
    Email,
    Google,
    Apple
}
const Page = () => {
    const [countryCode, setCountryCode] = useState('+15');
    const [phoneNumber, setPhoneNumber] = useState('');
    const keyboardVerticalOffset = Platform.OS == 'ios' ? 90 : 0
    const router = useRouter()
    const {signIn, setActive} = useSignIn()

    const onSignIn = async (type: SignInType) => {
        if (type === SignInType.Phone) {
            try {
                const fullPhoneNumber = `${countryCode}${phoneNumber}`
                const { supportedFirstFactors } = await signIn!.create({
                    identifier: fullPhoneNumber
                });
                const firstPhoneFactor: any = supportedFirstFactors.find((factor: any) => {
                    return factor.strategy == 'phone_code'
                });
                const {phoneNumberId} = firstPhoneFactor
                await signIn!.prepareFirstFactor({
                    strategy: 'phone_code',
                    phoneNumberId
                })
                 router.push({pathname: '/verify/phone', params: {phone: fullPhoneNumber, signin: 'true'}})
            } catch (error) {
                console.log('error', JSON.stringify(error, null, 2))
                if (isClerkAPIResponseError(error)) {
                    if (error.errors[0].code === 'form_identifier_not_found') {
                        Alert.alert('Error', error.errors[0].message)
                    }
                }
            }
        }
    };
    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={defaultStyles.container}>
                <Text style={defaultStyles.header}>Welcome back</Text>
                <Text style={defaultStyles.descriptionText}>
                    Enter your phone number. We will send you a confirmation code there
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                    style={styles.input}
                    placeholder="Country code"
                    placeholderTextColor={Colors.gray}
                    value={countryCode}
                    />
                    <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Mobile number"
                    placeholderTextColor={Colors.gray}
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    />
                </View>
                
                <TouchableOpacity
                 style={[defaultStyles.pillButton,
                    phoneNumber !== '' ? styles.enable : styles.disable, {marginBottom: 20}]} onPress={() => onSignIn(SignInType.Phone)}>
                    <Text style={defaultStyles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                    <View style={{flex: 1, height:StyleSheet.hairlineWidth, backgroundColor: Colors.gray}} />
                    <Text style={{color: Colors.gray, fontSize: 20}}>or</Text>
                    <View style={{flex: 1, height:StyleSheet.hairlineWidth, backgroundColor: Colors.gray}} />
                </View>
                <TouchableOpacity style={[defaultStyles.pillButton,{flexDirection: 'row', gap: 16, marginTop: 20, backgroundColor: '#fff'}]}
                onPress={() => onSignIn(SignInType.Email)}
                >
                    <Ionicons name='mail' size={24} color={'#000'}/>
                    <Text style={[defaultStyles.buttonText, {color: '#000'}]}>Continue with email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[defaultStyles.pillButton,{flexDirection: 'row', gap: 16, marginTop: 20, backgroundColor: '#fff'}]}
                onPress={() => onSignIn(SignInType.Google)}
                >
                    <Ionicons name='logo-google' size={24} color={'#000'}/>
                    <Text style={[defaultStyles.buttonText, {color: '#000'}]}>Continue with email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[defaultStyles.pillButton,{flexDirection: 'row', gap: 16, marginTop: 20, backgroundColor: '#fff'}]}
                onPress={() => onSignIn(SignInType.Apple)}
                >
                    <Ionicons name='logo-apple' size={24} color={'#000'}/>
                    <Text style={[defaultStyles.buttonText, {color: '#000'}]}>Continue with email</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
       
    )
}
const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 40,
        flexDirection: 'row',
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 20,
        width: 100,
        borderRadius: 16,
        fontSize: 20,
        marginHorizontal: 10,
    },
    enable: {
        backgroundColor: Colors.primary
    }, 
    disable: {
        backgroundColor: Colors.primaryMuted
    }
})
export default Page;