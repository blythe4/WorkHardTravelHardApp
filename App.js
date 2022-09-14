import {StatusBar} from 'expo-status-bar';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from "./color";
import {useEffect, useState} from "react";

const STORAGE_KEY = "@toDos";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});

    useEffect(() => {
        loadToDos();
    }, []);

    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    const onChangeText = (payload) => setText(payload);
    const saveToDos = async (toSave) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch (e) {
            console.log(e);
        }
    }
    const loadToDos = async () => {
        const s = await AsyncStorage.getItem(STORAGE_KEY);
        setToDos(JSON.parse(s));
    }
    const addToDo = async () => {
        if (text === "") {
            return
        }
        // ver.es6
        const newToDos = {
            ...toDos,
            [Date.now()]: {text, working}
        }
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText('');
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
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
                placeholder={working ? "Add a To Do" : "Where do you want to go?"}
                onChangeText={onChangeText}
                onSubmitEditing={addToDo}
            />
            <ScrollView>
                {Object.keys(toDos).map((key) => (
                    toDos[key].working === working ? (
                        <View style={styles.toDo} key={key}>
                            <Text style={styles.toDoText}>{toDos[key].text}</Text>
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
        color: "white",
    },
    input: {
        marginVertical: 20,
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
    },
    toDoText: {
        fontSize: 16,
        fontWeight: "500",
        color: "white"
    }
});
