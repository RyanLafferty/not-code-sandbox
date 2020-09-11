<template>
  <v-app id="app">
    <v-main>
      <v-container fluid>
        <v-container id="languages">
          <v-row justify="space-between">
            <v-col sm="2">
              <v-overflow-btn
                :items="languages"
                label="language"
                target="#languages"
                v-model="cmOptions.mode.name"
              ></v-overflow-btn>
            </v-col>
            <v-col id="runBtnContainer">
              <v-btn rounded color="primary" dark @click="runCode" id="runBtn">Run</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container id="editor" fluid>
          <codemirror v-model="code" :options="cmOptions" id="code" />
        </v-container>
        <v-container id="output" fluid>
          <v-textarea
            v-model="output"
            outlined
            filled
            readonly
            :error="error"
          />
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/python/python';
import 'codemirror/mode/go/go';
import { codemirror } from 'vue-codemirror';

export default {
  name: 'App',
  components: {
    codemirror,
  },
  data: () => ({
    error: false,
    code: '',
    output: '',
    languages: [
      'javascript',
      'ruby',
      'python',
      'go',
    ],
    cmOptions: {
      tabSize: 2,
      mode: {
        name: 'javascript',
      },
      theme: 'monokai',
      lineNumbers: true,
      line: true,
    },
  }),
  methods: {
    runCode() {
      fetch('http://localhost:8081/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { lang: this.cmOptions.mode.name, code: this.code } }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data.error) {
            this.output = data.data.stderr;
            this.error = true;
          } else {
            this.output = data.data.output;
            this.error = false;
          }
        });
    },
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#code {
  margin-top: 20px;
  width: 80vw;
  text-align: left;
}
#runBtnContainer {
  display: flex;
  justify-content: flex-end;
}
#runBtn {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
