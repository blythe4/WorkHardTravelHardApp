import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {theme} from "./color";
import {useState} from "react";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const addToDo = () => {
      if(text === ""){
          return
      }
      const newToDos = Object.assign(
          {},
          toDos,
          {[Date.now()]:{text, work:working}}
      );
      setToDos(newToDos);
      setText('');
      console.log(toDos);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
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
          placeholder={working? "Add a To Do": "Where do you want to go?"}
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}
      />
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
  input : {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 18,
    borderRadius: 30,
    backgroundColor: "white",
  }
});
