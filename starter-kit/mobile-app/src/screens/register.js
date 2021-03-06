import React, { Component }  from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PickerSelect from 'react-native-picker-select';
import { CheckedIcon, UncheckedIcon } from '../images/svg-icons';
import Geolocation from '@react-native-community/geolocation';

import { add, userID } from '../lib/utils'

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    padding: 22,
    backgroundColor: '#FFF'
  },
  splitView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  typeArea: {
    width: '40%'
  },
  label: {
    fontFamily: 'IBMPlexSans-Medium',
    color: '#000',
    fontSize: 14,
    paddingBottom: 5
  },
  selector: {
    fontFamily: 'IBMPlexSans-Medium',
    borderColor: '#D0E2FF',
    borderWidth: 2,
    padding: 16,
    marginBottom: 25
  },
  quantityArea: {
    width: '40%',
    height: '20%'
  },
  textInput: {
    fontFamily: 'IBMPlexSans-Medium',
    flex: 1,
    borderColor: '#D0E2FF',
    borderWidth: 2,
    padding: 14,
    elevation: 2,
    marginBottom: 25
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  checkboxLabel: {
    fontFamily: 'IBMPlexSans-Light',
    fontSize: 13
  },
  textInputDisabled: {
    fontFamily: 'IBMPlexSans-Medium',
    backgroundColor: '#f4f4f4',
    color: '#999',
    flex: 1,
    padding: 16,
    elevation: 2,
    marginBottom: 25
  },
  button: {
    backgroundColor: '#1062FE',
    color: '#FFFFFF',
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 16,
    overflow: 'hidden',
    padding: 12,
    textAlign:'center',
    marginTop: 15
  }
});

const Register = function ({ navigation }) {
  const clearItem = { userID: userID(), category: 'EatOuts', sub_category: '' , name: '', description: '', location: '', owner_id: '', contact_no: '', password: '', queue_capacity: '1' }
  const [item, setItem] = React.useState(clearItem);
  const [useLocation, setUseLocation] = React.useState(true);
  const [position, setPosition] = React.useState({})
  const category = [{ label: 'EatOuts', value: 'eatouts', items: [{label: 'Restaurant', value: 'restaurant'}, {label: 'Ice Cream Parlours', value: 'ice_cream'}] },
  { label: 'Stores', value: 'stores', items: [{label: 'Medical Stores', value: 'medical_stores'}, {label: 'General Stores', value: 'general_stores'}, {label: 'Liquor Stores', value: 'liquor_stores'}] },
  { label: 'Services', value: 'Services', items:[{label: 'Garage Service', value: 'garage_service'}, {label: 'Petrol Pump', value: 'petrol_pump'},{label: 'Pathology', value: 'pathology'}] }];
  const sub_category = [{label: 'Medical Stores', value: 'medical_stores'}, {label: 'General Stores', value: 'general_stores'}, {label: 'Liquor Stores', value: 'liquor_stores'},{label: 'Restaurant', value: 'restaurant'}, {label: 'Ice Cream Parlours', value: 'ice_cream'},
  {label: 'Garage Service', value: 'garage_service'}, {label: 'Petrol Pump', value: 'petrol_pump'},{label: 'Pathology', value: 'pathology'}];
  const itemSelected = {};
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      Geolocation.getCurrentPosition((pos) => {
        setPosition(pos)
        if (useLocation) {
          setItem({
            ...item,
            location: `${pos.coords.latitude},${pos.coords.longitude}`
          })
        }
      });
    })
  }, []);
  
  const toggleUseLocation = () => {
    if (!useLocation && position) {
      setItem({
        ...item,
        location: `${position.coords.latitude},${position.coords.longitude}`,
        itemSelected: item
      })
    }
    setUseLocation(!useLocation);
  };

  const sendItem = () => {
    const payload = {
      ...item,
      queue_capacity: isNaN(item.queue_capacity) ? 1 : parseInt(item.queue_capacity),
      contact_no: '1234567890'
    };

    add(payload)
      .then(res => {
        console.log(res, 'res');
        Alert.alert('Thank you!', 'Your Shop has been added.', [{text: 'OK', onPress: () => {navigation.navigate('Map', { item: res });}}]);
        setItem({ ...clearItem, location: payload.location });
      })
      .catch(err => {
        console.log(err, payload);
        Alert.alert('ERROR', 'Please try again. If the problem persists contact an administrator.', [{text: 'OK'}]);
      });
  };
  
  return (
    <ScrollView style={styles.outerView}>
      <View style={styles.splitView}>
        <View style={styles.typeArea}>
          <Text style={styles.label}>Type</Text>
          <PickerSelect
            style={{ inputIOS: styles.selector }}
            value={item.category}
            onValueChange={(t) => setItem({ ...item, category: t })}
            onPress={this.onPress}
            items={category}
          />

          <Text style={styles.label}>Sub-Type</Text>
          <PickerSelect
            style={{ inputIOS: styles.selector }}
            value={item.sub_category}
            onValueChange={(t) => setItem({ ...item, sub_category: t })}
            items={sub_category}
          />
        </View>
        <View style={styles.quantityArea}>
          <Text style={styles.label}>Serving Capacity</Text>
          <TextInput
            style={styles.textInput}
            value={item.serving_capacity}
            onChangeText={(t) => setItem({ ...item, serving_capacity: t})}
            onSubmitEditing={sendItem}
            returnKeyType='send'
            enablesReturnKeyAutomatically={true}
            placeholder='e.g., 10'
            keyboardType='numeric'
          />

          {/* <Text style={styles.label}>Average Queue</Text>
          <TextInput
            style={styles.textInput}
            value={item.quantity}
            onChangeText={(t) => setItem({ ...item, quantity: t})}
            onSubmitEditing={sendItem}
            returnKeyType='send'
            enablesReturnKeyAutomatically={true}
            placeholder='e.g., 10'
            keyboardType='numeric'
          /> */}
        </View>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.textInput}
        value={item.name}
        onChangeText={(t) => setItem({ ...item, name: t})}
        onSubmitEditing={sendItem}
        returnKeyType='send'
        enablesReturnKeyAutomatically={true}
        placeholder='e.g., Tomotatoes'
        blurOnSubmit={false}
      />
      <Text style={styles.label}>Email ID</Text>
      <TextInput
        style={styles.textInput}
        value={item.owner_id}
        onChangeText={(t) => setItem({ ...item, owner_id: t})}
        onSubmitEditing={sendItem}
        returnKeyType='send'
        enablesReturnKeyAutomatically={true}
        placeholder='user@domain.com'
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.textInput}
        value={item.password}
        onChangeText={(t) => setItem({ ...item, password: t})}
        onSubmitEditing={sendItem}
        returnKeyType='send'
        enablesReturnKeyAutomatically={true}
        secureTextEntry={true}
        placeholder='Enter Password'
      />
      {/* <Text style={styles.label}>Contact</Text>
      <TextInput
        style={styles.textInput}
        value={item.contact_no}
        onChangeText={(t) => setItem({ ...item, contact_no: t})}
        onSubmitEditing={sendItem}
        returnKeyType='send'
        enablesReturnKeyAutomatically={true}
        placeholder='+91 123456789'
      /> */}
      {/* <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textInput}
        value={item.description}
        onChangeText={(t) => setItem({ ...item, description: t})}
        onSubmitEditing={sendItem}
        returnKeyType='send'
        enablesReturnKeyAutomatically={true}
        placeholder='e.g., cans of tomatoes'
      /> */}
      <Text style={styles.label}>Location</Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={toggleUseLocation}>
          {
            (useLocation)
              ?
              <CheckedIcon height='18' width='18'/>
              :
              <UncheckedIcon height='18' width='18'/>
          }
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}> Use my current location </Text>
      </View>
      <TextInput
        style={useLocation ? styles.textInputDisabled : styles.textInput}
        value={item.location}
        onChangeText={(t) => setItem({ ...item, location: t})}
        onSubmitEditing={sendItem}
        returnKeyType='send'
        enablesReturnKeyAutomatically={true}
        placeholder='street address, city, state'
        editable={!useLocation}
      />

      {
        item.type !== '' &&
        item.name.trim() !== '' &&
        item.owner_id.trim() !== '' &&
        <TouchableOpacity onPress={sendItem}>
          <Text style={styles.button}>Add</Text>
        </TouchableOpacity>
      }
    </ScrollView>
  );
};

export default Register;
