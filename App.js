import {StatusBar} from 'expo-status-bar';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Alert, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Fontisto, SimpleLineIcons} from '@expo/vector-icons';
import {theme} from "./color";
import {useEffect, useState} from "react";

const WORKING_KEY = "@working";
const STORAGE_KEY = "@toDos";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [edit, setEdit] = useState("");
    const [toDos, setToDos] = useState({});

    useEffect(() => {
        loadToDos();
        loadWorking();

    }, []);

    const travel = () => {
        setWorking(false)
        saveWorking(working);
    };
    const work = () => {
        setWorking(true)
        saveWorking(working);
    };
    const onChangeText = (payload) => setText(payload);

    const saveWorking = async (working) => {
        try {
            await AsyncStorage.setItem(WORKING_KEY, working ? "0" : "1");
        } catch (e) {
            console.log(e);
        }
    }
    const loadWorking = async () => {
        const s = await AsyncStorage.getItem(WORKING_KEY);
        if (s === "1") {
            setWorking(true);
        } else {
            setWorking(false);
        }
    }
    const saveToDos = async (toSave) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch (e) {
            console.log(e);
        }
    }
    const loadToDos = async () => {
        const toDos = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
        Object.keys(toDos).map((key) => (
            toDos[key].update = false
        ));
        setToDos(toDos);
    }
    const addToDo = async () => {
        if (text === "") {
            return
        }
        // ver.es6
        const newToDos = {
            ...toDos,
            [Date.now()]: {text, working, completed: false, update: false}
        }
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText('');
    }

    const editToDo = async (key) => {
        const newToDos = {...toDos}
        newToDos[key].update = true;
        setEdit(newToDos[key].text);
        setToDos(newToDos);
        saveToDos(newToDos);
    }

    const onChangeUpdateText = async (payload, key) => {
        if (edit === "") {
            return
        }
        setEdit(payload);
    }
    const updateToDo = async (key) => {
        const newToDos = {...toDos}
        if (newToDos[key].text === "") {
            return
        }
        newToDos[key].text = edit;
        newToDos[key].update = false;
        setToDos(newToDos);
        saveToDos(newToDos);
    }

    const deleteToDo = async (key) => {
        if (Platform.OS === "web") {
            const ok = confirm("Do you want to delete this To Do?")
            if(ok){
                const newToDos = {...toDos}
                delete newToDos[key];
                setToDos(newToDos);
                saveToDos(newToDos);
            }
        } else {
            Alert.alert("Delete To Do", "Are you sure?", [
                {text: "Cancel"},
                {
                    text: "I'm Sure",
                    style: "destructive",
                    onPress: () => {
                        const newToDos = {...toDos}
                        delete newToDos[key];
                        setToDos(newToDos);
                        saveToDos(newToDos);
                    },
                },
            ]);
        }
    }

    const completedToDo = async (key) => {
        const newToDos = {...toDos}
        newToDos[key].completed = !newToDos[key].completed;
        setToDos(newToDos);
        saveToDos(newToDos);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light"/>
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.input}
                value={text}
                returnKeyType="done"
                placeholder={working ? "What do you have to do?" : "Where do you want to go?"}
                onChangeText={onChangeText}
                onSubmitEditing={addToDo}
            />
            <ScrollView>
                {Object.keys(toDos).map((key) => (
                    toDos[key].working === working ? (
                        <View style={styles.toDo} key={key}>
                            {toDos[key].update ?
                                <TextInput
                                    style={styles.updateInput}
                                    value={edit}
                                    returnKeyType="done"
                                    onChangeText={(e) => onChangeUpdateText(e, key)}
                                    onSubmitEditing={() => updateToDo(key)}
                                />
                                :
                                (
                                    <>
                                        <TouchableOpacity style={styles.toDoComplete}
                                                          onPress={() => completedToDo(key)}>
                                            <Fontisto
                                                name={toDos[key].completed ? 'checkbox-active' : 'checkbox-passive'}
                                                size={16}
                                                color={theme.white}/>
                                        </TouchableOpacity>
                                        <Text style={toDoStyles(toDos[key].completed).toDoText}>{toDos[key].text}</Text>
                                        {!toDos[key].completed &&
                                            <TouchableOpacity style={styles.toDoUpdate} onPress={() => editToDo(key)}>
                                                <SimpleLineIcons name="pencil" size={16} color={theme.toDoBg}/>
                                            </TouchableOpacity>
                                        }
                                        <TouchableOpacity style={toDoStyles(toDos[key].completed).toDoDelete}
                                                          onPress={() => deleteToDo(key)}>
                                            <Fontisto name="trash" size={16} color={theme.toDoBg}/>
                                        </TouchableOpacity>
                                    </>
                                )
                            }
                        </View>
                    ) : null
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 100,
    },
    btnText: {
        fontSize: 38,
        fontWeight: "600",
    },
    input: {
        marginVertical: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 18,
        borderRadius: 30,
        backgroundColor: "white",
    },
    updateInput: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 18,
        borderRadius: 30,
        backgroundColor: "white",
    },
    toDo: {
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        backgroundColor: theme.grey,
        flexDirection: "row",
        alignItems: "center"
    },
    toDoText: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: "500",
        color: "white"
    },
    toDoComplete: {
        width: 20,
    },
    toDoUpdate: {
        marginLeft: "auto",
    },
    toDoDelete: {
        marginLeft: 20,
    }
});

const toDoStyles = (completed) => StyleSheet.create({
    toDoText: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: "500",
        color: "white",
        textDecorationLine: completed ? "line-through" : "none",
    },
    toDoDelete: {
        marginLeft: completed ? "auto" : 20,
    }
})
