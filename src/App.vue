<template lang="pug">
  div
    h1 CHSM - Chromatic Harmonica Score Maker
    .form
      | Input ABC Score.
      br
      textarea(ref="abcInput") {{defaultAbcText}}
      br
      | Offset pitch:
      input(v-model="offsetPitch")
      | e.g. -12 means one octave down.
      br
      button(@click="transformAbc") reRender
      button(onclick="window.print()") print
    #abc(ref="abcObj")
</template>

<script>
import abcjs from "abcjs";
import AbcHarmonicaScoreMaker from "./utils/AbcHarmonicaScoreMaker.js"

const defaultAbcText =
`
T:All pitches
M:C
L:1/8
K:C
C,^C,D,^D, E,F,^F,G,|^G,A,^A,B, C^CD^D|
EF^FG ^GA^AB|c^cd^d ef^fg|
^ga^ab c'^c'd'^d'|e'f'^f'g' ^g'a'^a'b'|
c''^c''z6|]
`

export default {
  data() {
    return {
      defaultAbcText: defaultAbcText,
      offsetPitch: 0,
      scoreMaker: null,
    }
  },

  mounted() {
    this.abcHarmonicaScoreMaker = new AbcHarmonicaScoreMaker()
    this.transformAbc()
  },

  methods: {
    transformAbc() {
      let configure = {
        responsive: "resize",
        afterParsing: this.addHarmonicaTab,
        format: {
            annotationfont: "Times New Roman",
        }
      }
      abcjs.renderAbc("abc", this.$refs.abcInput.value, configure)[0]
      this.abcHarmonicaScoreMaker.addUnderline(this.$refs.abcObj)
    },
    addHarmonicaTab(tuneObj) {
      this.abcHarmonicaScoreMaker.transform(tuneObj, Number(this.offsetPitch))
    },
  },
}
</script>

<style lang="sass" scoped>
h1
  color: green

textarea
  width: 500px
  height: 100px

button, input
  margin-right: 10px

#abc
  width: 800px

@media print
  h1, .form
    display: none
  #abc2
    top: 0
    left: 0
    width: 172mm
    height: 251mm
</style>
