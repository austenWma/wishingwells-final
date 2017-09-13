import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, RefreshControl, Image, TouchableOpacity } from 'react-native'
import NavigationBar from 'react-native-navbar'
import * as firebase from 'firebase'
import moment from 'moment'
import { connect } from 'react-redux'
import { setSavings } from '../../Actions/Savings/SavingsAction'
import { setUserInfo } from '../../Actions/Profile/ProfileAction.js'
const db = firebase.database()
const mapStateToProps = (state) => {
  return {
    logs: state.SavingsReducer.entries,
    uid: state.ProfileReducer.uid,
    total: state.ProfileReducer.total,
  }
}
class WalletLogs extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    onSwipe: PropTypes.func.isRequired,
  };

  constructor() {
    super()
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    console.log('WALLET LOGS', this.props.logs)
    db.ref(`users/${this.props.uid}/logs`).on('value', (snapshot) => {
      (snapshot.val()) ? this.props.setSavings(Object.values(snapshot.val())) : null;
    })
    firebase.database().ref(`users/${this.props.uid}`).on('value', (data) => {
      this.props.setUserInfo({
        total: data.val().total
      })
    })
  }

  _onRefresh() {
    this.setState({refreshing: true});
    db.ref(`users/${this.props.uid}/logs`).on('value', (snapshot) => {
      (snapshot.val()) ? this.props.setSavings(Object.values(snapshot.val())) : null;
    })
    this.setState({refreshing: false});
  }

  render() {
    const { onSwipe } = this.props;
    return (
      <Image source={require('../../../assets/backgroundProfile.jpg')}  style={styles.backgroundImage}>
        
        <View style={styles.navbar}>
          <NavigationBar title={{title:'SAVINGS', tintColor:"white"}} tintColor='rgba(240, 240, 240, 0.1)'/>
        </View>

        <View style={styles.pageButtons}>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Wallet Logs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSwipe}>
            <Text style={styles.buttonText}>Well Logs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalWrap}>
          <View style={styles.total}>
            <Text style={styles.number}>${this.props.total}</Text>
            <Text style={styles.savings}>Current Wallet Savings</Text>
          </View>

        </View>

          <View style={styles.transactions}>
            <Text style={styles.transText}>SAVINGS LOG</Text>
          </View>

          <View style={styles.log}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
                />}
            removeClippedSubviews={false}
            data={this.props.logs.reverse()}
            renderItem={({item}) =>
              <View style={styles.list}>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.secondLine}>
                  <Text style={styles.date}>{item.date}</Text>
                  <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
                </View>
                <Text style={styles.amount}>${item.amount}</Text>
              </View>
            }
            style={{height:'100%'}}
          />
          </View>

    </Image>
    )
  }
}
const styles = StyleSheet.create({
  pageButtons: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    padding: 5,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
    paddingLeft:15,
    paddingRight:15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: 'rgba(242,242,242,0.3)',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  buttonText: {
    fontSize: 15,
    color: 'white'
  },
  nav:{
    color: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  transactions: {
    marginTop: 20,
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: 'white',
    paddingBottom: 0
  },
  transText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
  },
  list: {
    backgroundColor: 'rgba(242,242,242,0.3)',
    borderRadius: 15,
    marginBottom: 1,
    marginTop: 5,
    height: 110,
    marginLeft: 10,
    marginRight: 10,
  },
  description: {
    fontSize: 20,
    top: 5,
    marginLeft: 10,
    marginRight: 10,
    color: 'white'
  },
  time: {
    marginRight: 10,
    color: 'gray',
    top: 10,
  },
  secondLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 2
  },
  amount: {
    textAlign: 'right',
    alignSelf: 'stretch',
    fontSize: 30,
    marginRight: 10,
    marginTop: 4,
    color: 'white'
  },
  date: {
    marginLeft: 10,
    top: 5,
    color: 'gray',
  },
  log : {
    paddingBottom: '40%',
  },
  savings: {
    fontSize: 20,
    marginLeft: 7,
    color: 'white'
  },
  number: {
    fontSize: 40,
    textAlign: 'right',
    marginRight: 10,
    color: 'white',
    marginTop: 5
  },
  total: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 360,
    backgroundColor: 'rgba(242,242,242,0.3)',
    borderRadius: 15,
    marginTop: 10,
  },
  totalWrap:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop: '15%',
    marginBottom: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
});
export default connect(mapStateToProps, { setSavings, setUserInfo })(WalletLogs)
