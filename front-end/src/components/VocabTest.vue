<template>
    <div>
      <h2>Score: {{ score }} out of {{ this.words.length }}</h2>
  
      <!-- Language Selection -->
      <div class="ui form" v-if="!testStarted">
        <div class="two fields">
          <div class="field">
            <label>Question Language</label>
            <select v-model="questionLanguage" class="ui dropdown">
              <option value="german">German</option>
              <option value="english">English</option>
              <option value="french">French</option>
            </select>
          </div>
          <div class="field">
            <label>Answer Language</label>
            <select v-model="answerLanguage" class="ui dropdown">
              <option value="german" :disabled="questionLanguage === 'german'">German</option>
              <option value="english" :disabled="questionLanguage === 'english'">English</option>
              <option value="french" :disabled="questionLanguage === 'french'">French</option>
            </select>
          </div>
        </div>
        <button class="ui primary button" @click="startTest">Start Test</button>
      </div>
  
      <!-- Test Form -->
      <form v-if="testStarted" action="#" @submit.prevent="onSubmit">
        <div class="ui labeled input fluid">
          <div class="ui label">
            <i :class="[questionFlag, 'flag']"></i> {{ questionLanguageCapitalized }}
          </div>
          <input type="text" readonly :disabled="testOver" :value="currWord[questionLanguage]"/>
        </div>
        <div class="ui labeled input fluid">
          <div class="ui label">
            <i :class="[answerFlag, 'flag']"></i> {{ answerLanguageCapitalized }}
          </div>
          <input type="text" :placeholder="`Enter ${answerLanguageCapitalized} word...`" 
                 v-model="userAnswer" :disabled="testOver" autocomplete="off" />
        </div>
  
        <button class="positive ui button" :disabled="testOver">Submit</button>
      </form>
  
      <p :class="['results', resultClass]" v-if="result">
        <span v-html="result"></span>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'vocab-test',
    props: {
      words: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        randWords: [],
        incorrectGuesses: [],
        result: '',
        resultClass: '',
        userAnswer: '',
        score: 0,
        testOver: false,
        testStarted: false,
        questionLanguage: 'german',
        answerLanguage: 'english'
      };
    },
    computed: {
      currWord() {
        return this.randWords.length ? this.randWords[0] : '';
      },
      questionLanguageCapitalized() {
        return this.questionLanguage.charAt(0).toUpperCase() + this.questionLanguage.slice(1);
      },
      answerLanguageCapitalized() {
        return this.answerLanguage.charAt(0).toUpperCase() + this.answerLanguage.slice(1);
      },
      questionFlag() {
        return this.getFlag(this.questionLanguage);
      },
      answerFlag() {
        return this.getFlag(this.answerLanguage);
      }
    },
    methods: {
      getFlag(language) {
        const flags = {
          german: 'germany',
          english: 'united kingdom',
          french: 'france'
        };
        return flags[language];
      },
      startTest() {
        if (this.questionLanguage === this.answerLanguage) {
          this.flash('Please select different languages for question and answer', 'error');
          return;
        }
        this.randWords = [...this.words.sort(() => 0.5 - Math.random())];
        this.testStarted = true;
        this.score = 0;
        this.incorrectGuesses = [];
        this.result = '';
      },
      onSubmit() {
        if (this.userAnswer.toLowerCase() === this.currWord[this.answerLanguage].toLowerCase()) {
          this.flash('Correct!', 'success', { timeout: 1000 });
          this.score += 1;
        } else {
          this.flash('Wrong!', 'error', { timeout: 1000 });
          this.incorrectGuesses.push({
            question: this.currWord[this.questionLanguage],
            expected: this.currWord[this.answerLanguage],
            provided: this.userAnswer
          });
        }
  
        this.userAnswer = '';
        this.randWords.shift();
  
        if (this.randWords.length === 0) {
          this.testOver = true;
          this.displayResults();
        }
      },
      displayResults() {
        if (this.incorrectGuesses.length === 0) {
          this.result = 'You got everything correct. Well done!';
          this.resultClass = 'success';
        } else {
          const incorrectList = this.incorrectGuesses.map(guess => 
            `<li>${guess.question} = ${guess.expected} (you answered: ${guess.provided})</li>`
          ).join('');
          this.result = `<strong>You got the following words wrong:</strong><ul>${incorrectList}</ul>`;
          this.resultClass = 'error';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .results {
    margin: 25px auto;
    padding: 15px;
    border-radius: 5px;
  }
  
  .error {
    border: 1px solid #ebccd1;
    color: #a94442;
    background-color: #f2dede;
  }
  
  .success {
    border: 1px solid #d6e9c6;
    color: #3c763d;
    background-color: #dff0d8;
  }
  
  .ui.form {
    margin-bottom: 2em;
  }
  
  .ui.labeled.input {
    margin: 1em 0;
  }
  </style>