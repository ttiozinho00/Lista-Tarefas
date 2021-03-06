import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard, Alert, AsyncStorage } from 'react-native';
import { Octicons, MaterialIcons } from '@expo/vector-icons'

export default function App() {
	const [task, setTask] = useState([]);
	const [newTask, setNewTask] = useState("");

	async function addTask()
	{
		if (newTask === "")
		{
			return;
		}

		const search = task.filter(task => task === newTask);

		if (search.length !== 0) 
		{
			Alert.alert("Atenção","Tarefa já existente na lista");
			return 0;			
		}

		setTask([ ... task, newTask]);
		setNewTask("");

		Keyboard.dismiss();
	}

	async function removeTask(item) 
	{
		Alert.alert("Excluir Tarefa","Remover Tarefa da lista!", 
		[
			{
				text: "cancel",
				onPress: () => {
					return;
				},
				style: "cancel"
			},
			{
				text: "OK",
				onPress: () => setTask(task.filter(tasks => tasks !== item))
			}
		],{cancelable: false});
	}

	useEffect(() => {
		async function carregaDados() 
		{
			const task = await AsyncStorage.getItem("task");

			if (task) 
			{
				setTask(JSON.parse(task));
			}
		}
		carregaDados();

	}, []);

	useEffect(() => {
		async function salvaDados()
		{
			AsyncStorage.setItem("task", JSON.stringify(task));
		}
		salvaDados();
	}, [task])

  return (
  	<>
    <View style={styles.container}>

       <View style={styles.Body}>
    	<FlatList style={styles.FlatList} data={task} keyExtractor={item => item.toString()} showsVerticalScrollIndicator={false} renderItem={({item}) =>(
    		<View style={styles.ContainerView}>
    			<Text style={styles.Texto}>{item}</Text>
    			<TouchableOpacity onPress={() => removeTask(item)} >
    				<MaterialIcons name="delete-forever" size={26} color="#f64c75" />
    			</TouchableOpacity> 
    		</View>
    	)}/>
        <StatusBar style="auto" />
    </View>

      <View style={styles.Form}>
    	<TextInput style={styles.Input} placeholderTextColor ='#712' autoCorrect={true} placeholder="Adicione uma tarefa" maxLength={25} onChangeText={text => setNewTask(text)} value={newTask} />
    	<TouchableOpacity style={styles.Button} onPress={() => addTask()} >
    		<Octicons name="diff-added" size={26} color="red" />
    	</TouchableOpacity>
    </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
   
  },
  Body: {
  	flex: 1
  },

  Form: {
  	padding: 0,
  	height: 60,
  	justifyContent: 'center',
  	alignSelf: 'stretch',
  	flexDirection: 'row',
  	paddingTop: 13,
  	borderTopWidth: 1,
  	borderColor: '#eee',
  },

  Input: {
  	flex: 1,
  	height: 40,
  	backgroundColor: '#eee',
  	borderRadius: 4,
  	paddingVertical: 5,
  	paddingHorizontal: 10,
  	borderWidth: 1,
  	borderColor: '#aaa'

  },

  Button: {
  	height: 40,
  	width: 40,
  	justifyContent: 'center',
  	alignItems: 'center',
  	backgroundColor: '#1c6cce',
  	borderRadius: 4,
  	marginLeft: 10
  },

  FlatList: {
  	flex: 1,
  	marginTop: 5
  },

  ContainerView: {
  	marginBottom: 15,
  	padding: 15,
  	borderRadius: 4,
  	backgroundColor: "#aaa",

  	display: "flex",
  	flexDirection: "row",
  	alignItems: "center",
  	justifyContent: "space-between",
  	borderWidth: 1,
  	borderColor: "#aaa"

  },

  Texto: {
  	fontSize: 16,
  	color: "#111",
  	fontWeight: "bold",
  	marginTop: 4,
  	textAlign: "center"

  }


});
