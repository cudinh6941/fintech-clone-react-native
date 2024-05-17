import Dropdown from '@/components/custom/Dropdown'
import RoundBtn from '@/components/custom/RoundButton'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useBalanceStore } from '@/store/balanceStore'
import {View, Text, StyleSheet, ScrollView, Button} from 'react-native'
const Home = () => {
    const { balance, runTransaction, transaction, clearTransactions } = useBalanceStore();
    const onAddMoney = () => {
        runTransaction({
            id: Math.random().toString(),
            amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
            date: new Date(),
            title: 'Added money'
        })
    }
    return (
        <ScrollView style={{backgroundColor: Colors.background}}>
            <View style={styles.account}>
                <View style={styles.row}>
                    <Text style={styles.balance}>{balance()}</Text>
                    <Text style={styles.currency}>€</Text>
                </View>
            </View>

            <View style={styles.actionRow}>
                <RoundBtn icon={'add'} text={'Add money'} onPress={onAddMoney}/>
                <RoundBtn icon={'refresh'} text={'Exchange'} />
                <RoundBtn icon={'list'} text={'Details'} />
                <Dropdown/>
            </View>

            <Text style={defaultStyles.sectionHeader}>Transactions</Text>
            <View style={styles.transaction}>
                {transaction.length === 0 && (
                    <Text>No transactions yet</Text>
                )}
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    account: {
        margin: 80,
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 10
    },
    balance: {
        fontSize: 50,
        fontWeight: 'bold'
    },
    currency: {
        fontSize: 20,
        fontWeight: '500',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    transaction: {
        marginHorizontal: 20
    }
})
export default Home